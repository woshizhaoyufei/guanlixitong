<template>
  <div class="goods-cate">
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>商品分类</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="add">添加分类</el-button>
      </div>
      <div class="content">
        <!-- 模态框 -->
        <el-dialog
          title="添加分类"
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
            <!-- 分类 -->
            <el-form-item label="分类名称" prop="cateName">
              <el-input v-model="ruleForm.cateName" autocomplete="off" placeholder="分类名称"></el-input>
            </el-form-item>
          </el-form>
          <el-form label-width="80px">
            <el-form-item label="是否启用">
              <el-switch
                v-model="ruleForm.state"
                active-value=true
                inactive-value=false
                active-color="#13ce66"
              ></el-switch>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveCate">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 页面内容 -->
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="序号" width="180">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column prop="name" label="分类名称" width="180">
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{ scope.row.cateName }}</span>
              <el-input v-else v-model="scope.row.cateName" placeholder="请输入内容 " size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column label-width="80px" label="是否启用">
            <template slot-scope="scope" @click="getChange(scope.$index, scope.row)">
              <el-switch
                :disabled="!scope.row.isEdit"
                v-model="scope.row.state"
                active-color="#13ce66"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" v-if="!scope.row.isEdit" @click="edit(scope.row)">编辑</el-button>
              <el-button size="mini" v-else @click="saveEdit" type="success">完成</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getGoodsCatelist, editCate, delCate, addCate } from "../../api/goods";
export default {
  data() {
    return {
      // 模态框是否显示 默认不显示
      dialogVisible: false,
      ruleForm: { cateName: "", state:'' },
      // 模态框的开关
      value: false,
      // 主页面的开关
      value2: false,
      currentPage: 1,
      tableData: [],
      total: 0,
      pageSize: 4
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 点击添加分类 模态框显示
    add() {
      this.dialogVisible = true;
    },

    // 模态框 关闭
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 当前页改变
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      // 页数赋值给数据
      this.currentPage = val;
      this.getList();
    },

    async handleDelete(row) {
      let { code } = await delCate({
        id: row.id
      });
      if (code === 0) {
        this.getList();
      }
    },

   
    async getList() {
      let { data, total } = await getGoodsCatelist({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      });
      data.forEach(v => {
        v.state = v.state === 1 ? true : false;
        v.isEdit = false; //每一项添加一个isEdit 是否可以编辑的字段 默认是false
      });
      this.tableData = data;
      this.total = total;
    },
    edit(row) {
      row.isEdit = !row.isEdit;
      this.row = row;
    },
    async saveEdit() {
      // 发送ajax
      console.log(this.row);
      let { code } = await editCate({
        id: this.row.id,
        cateName: this.row.cateName,
        state: this.row.state
      });
      if (code === 0) {
        this.getList();
      }
    },
    async saveCate() {
      this.dialogVisible = false;
      console.log(this.ruleForm.state,this.ruleForm.cateName);
      
      let { code } = await addCate({
        cateName: this.ruleForm.cateName,
        state: this.ruleForm.state
      });
      if (code === 0) this.getList();
    }
  }
};
</script>

<style lang="less" scoped>
.el-pagination {
  margin: 20px auto;
}
</style>