<template>
  <div class="goods-list">
    <card>
      <span slot="title">商品列表</span>
      <div slot="content">
        <!-- 点击编辑出现模态框 -->
        <el-dialog
          title="订单编辑"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose"
        >
          <el-form
            :model="ruleForm"
            status-icon
            ref="ruleForm"
            label-width="80px"
            class="ruleForm"
            size="small"
          >
            <!-- 账户 -->

            <el-form-item label="商品ID" prop="id">
              <el-input v-model="ruleForm.id" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="category">
              <el-input v-model="ruleForm.category" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="商品价格" prop="price">
              <el-input v-model="ruleForm.price" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="商品图片">
              <img :src="baseImgUrl+ruleForm.imgUrl" alt width="50" height="50" />
            </el-form-item>

            <el-form-item label="商品描述" prop="goodsDesc">
              <el-input v-model="ruleForm.goodsDesc" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveEdit">修 改</el-button>
          </span>
        </el-dialog>
        <el-table :data="tableData" style="width: 100%" height="400">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="商品 ID">
                  <span>{{ props.row.id }}</span>
                </el-form-item>

                <el-form-item label="商品名称">
                  <span>{{ props.row.name }}</span>
                </el-form-item>

                <el-form-item label="商品分类">
                  <span>{{ props.row.category }}</span>
                </el-form-item>

                <el-form-item label="商品价格">
                  <span>{{ props.row.price}}</span>
                </el-form-item>

                <el-form-item label="商品图片">
                  <!-- <span>{{ baseImgUrl+props.row.imgUrl }}</span> -->

                  <img :src="baseImgUrl+props.row.imgUrl" alt width="50" height="50" />
                </el-form-item>
                <el-form-item label="创建时间">
                  <span>{{ props.row.ctime|filterTime }}</span>
                </el-form-item>

                <el-form-item label="商品评价">
                  <span>{{ props.row.rating }}</span>
                </el-form-item>

                <el-form-item label="商品销量">
                  <span>{{ props.row.sellCount }}</span>
                </el-form-item>

                <el-form-item label="商品描述">
                  <span>{{ props.row.goodsDesc }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>

          <el-table-column label="商品名称" prop="name"></el-table-column>
          <el-table-column label="所属分类" prop="category"></el-table-column>
          <el-table-column label="商品价格" prop="price"></el-table-column>

          <el-table-column label="商品图片" width="180">
            <!-- 这样添加图片 -->
            <template slot-scope="scope">
              <img :src="baseImgUrl+scope.row.imgUrl" alt width="50" height="50" />
            </template>
          </el-table-column>

          <el-table-column label="商品描述" prop="goodsDesc"></el-table-column>

          <!-- 加入自定义的列模板 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleEdit( scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete( scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          :page-size="pageSize"
          :page-sizes="[10, 20, 30, 40]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </card>
  </div>
</template>

<script>
import card from "../../components/Card";
import { getGoodsList, delGoods, changeGoods } from "../../api/goods";
import moment from "moment";

export default {
  components: {
    card
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      tableData: [],
      total: 0,
      baseImgUrl: "http://127.0.0.1:5000/upload/imgs/goods_img/",
      // 模态框是否显示 默认不显示
      dialogVisible: false,
      ruleForm: {}
    };
  },
  created() {
    this.goodsList();
  },
  methods: {
    async goodsList() {
      let { data, total } = await getGoodsList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      });
      // 页面边界判断
      if (!data.length && this.currentPage !== 1) {
        this.currentPage -= 1;
        this.getAccData();
      }
      this.tableData = data;
      this.total = total;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.goodsList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.goodsList();
    },

    // 修改商品

    // 模态框
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 点击编辑触发handleEdit函数 更改标杆的值
    handleEdit(row) {
      this.dialogVisible = true;
      // 浅拷贝复制给模态框表单 因为是双向绑定 可以实现数据回填
      this.ruleForm = { ...row };
    },
    // 编辑保存
    async saveEdit() {
      let { code } = await changeGoods(this.ruleForm);
      if (code === 0) {
        this.dialogVisible = !this.dialogVisible;
        this.goodsList();
      }
    },

    async handleDelete(row) {
      let { code } = await delGoods({ id: row.id });
      if (code === 0) {
        this.goodsList();
      }
    }
  },
  filters: {
    filterTime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

<style lang="less" scoped>
.demo-table-expand {
  font-size: 0;
  & label {
    width: 90px;
    color: #99a9bf;
  }
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
}
.el-pagination {
  margin-top: 20px;
}
</style>