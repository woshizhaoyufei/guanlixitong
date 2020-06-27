<template>
  <div class="account-list">
    <card>
      <span slot="title">账号列表</span>
      <div slot="content">
        <!-- 表格组件 -->
        <el-table
          :data="tableData"
          style="width: 100%"
          ref="multipleTable"
          @selection-change="selectChange"
        >
          <!-- 选择框 -->
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="account" label="账号" width="180"></el-table-column>
          <el-table-column prop="userGroup" label="用户组" width="180"></el-table-column>
          <el-table-column prop="ctime" label="创建时间" width="180"></el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-change">
          <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[2,3,4,5,6]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
          <!-- 点击编辑出现模态框 -->
          <el-dialog
            title="账户编辑"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
          >
            <el-form
              :model="ruleForm"
              :rules="rules"
              status-icon
              ref="ruleForm"
              label-width="80px"
              class="ruleForm"
              size="small"
            >
              <!-- 账户 -->
              <el-form-item label="账户" prop="account">
                <el-input v-model="ruleForm.account" autocomplete="off"></el-input>
              </el-form-item>
              <!-- 用户组 -->
              <el-form-item label="用户组" prop="userGroup">
                <el-select v-model="ruleForm.userGroup" placeholder="请选择用户组">
                  <el-option label="超级管理员" value="超级管理员"></el-option>
                  <el-option label="普通管理员" value="普通管理员"></el-option>
                </el-select>
              </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="saveEdit">修 改</el-button>
            </span>
          </el-dialog>
        </div>

        <div class="del-choise">
          <el-button type="danger" @click="selectedDel">批量删除</el-button>
          <el-button type="primary" @click="toggleSelection">取消选中</el-button>
        </div>
      </div>
    </card>
  </div>
</template>

<script>
import card from "../../components/Card";
import { ACC_REG } from "../../utils/reg";
import {
  getAccList,
  editAdd,
  delAccList,
  delAccBatch
} from "../../api/account";
import moment from "moment";
export default {
  components: {
    card
  },
  data() {
    const checkAcc = (rule, value, callback) => {
      if (!value) {
        callback(new Error("不可以是空的"));
      } else if (!ACC_REG.test(value)) {
        callback(new Error("4到16位（字母，数字，下划线，减号）"));
      } else {
        callback();
      }
    };
    return {
      tableData: [],
      //  变量站位
      currentPage: 1,
      pageSize: 3,
      total: 0,
      // 模态框是否显示 默认不显示
      dialogVisible: false,
      ruleForm: { account: "", userGroup: "" },
      rules: {
        account: { required: true, trigger: "blur", validator: checkAcc },
        userGroup: ""
      }
    };
  },
  created() {
    this.getAccData();
  },
  methods: {
    // 进页面要获取列表，数据更新后也要获取列表，封装获取列表函数
    async getAccData() {
      let { data, total } = await getAccList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      });
      // 页面边界判断
      if (!data.length && this.currentPage !== 1) {
        this.currentPage -= 1;
        this.getAccData();
      }
      // 处理下时间格式moment
      data.forEach(v => {
        v.ctime = moment(v.ctime).format("YYYY-MM-DD HH:mm:ss");
      });
      this.tableData = data;
      this.total = total;
    },

    // 点击编辑触发handleEdit函数 更改标杆的值
    handleEdit(index, row) {
      this.dialogVisible = true;
      // 浅拷贝复制给模态框表单 因为是双向绑定 可以实现数据回填
      this.ruleForm = { ...row };
    },
    // 编辑保存
    async saveEdit() {
      this.dialogVisible = false;
      let { code, msg } = await editAdd({
        id: this.ruleForm.id,
        account: this.ruleForm.account,
        userGroup: this.ruleForm.userGroup
      });
      if (code === 0) {
        this.getAccData();
      }
    },
    // 点击删除单条  触发的事件  方法名随便定义 可以官网也可以自己
    // 亦可以写一个形参 row  模板内点击事件是触发handleDelete(scope.row)  传这一个实参即可
    handleDelete(index, row) {
      // console.log("删除id", row.id, row);
      // row 是这一行 的数据对象

      this.$confirm("确认删除该账号吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { code, msg } = await delAccList({
            id: row.id
          });
          if (code === 0) {
            this.getAccData();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 分页每页数据条数改变时触发 此函数 有一个形参 条数
    handleSizeChange(val) {
      // console.log("每页：", val);
      this.pageSize = val;
      this.getAccData();
    },
    // 分页当前页改变时触发
    handleCurrentChange(val) {
      // console.log("当前页：", val);
      this.currentPage = val;
      this.getAccData();
    },
    // 取消选中
    toggleSelection() {
      this.$refs.multipleTable.clearSelection();
    },

    // 选中批量删除
    // 选中的那几行 rows 一个数组 每一行都是一个对象 选中状态改变时触发次函数 获取选中id
    selectChange(rows) {
      this.ids = rows.map(row => row.id);
    },

    selectedDel() {
      if (!this.ids || !this.ids.length) {
        //  console.log("没有选中任何数据");
        this.$message.error("没有选中任何数据");
        return;
      }
      this.$confirm("确定批量删除吗?很危险哦~~~", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { code, msg } = await delAccBatch({
            ids: JSON.stringify(this.ids)
          });
          if (code === 0) {
            this.getAccData();
          }
        })
        .catch(() => {
          // 如果用户点击取消 走 catch
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 模态框
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>

<style lang="less" scoped>
.account-list {
  .content {
    .page-change {
      margin-top: 20px;
      margin-bottom: 20px;
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>