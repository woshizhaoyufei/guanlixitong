<template>
  <div class="order-details">
    <card>
      <span slot="title">订单详情</span>
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

            <el-form-item label="订单号" prop="orderNo">
              <el-input v-model="ruleForm.orderNo" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="下单时间" prop="orderTime">
              <el-input v-model="ruleForm.orderTime" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="送货地址" prop="deliverAddress">
              <el-input v-model="ruleForm.deliverAddress" autocomplete="off"></el-input>
            </el-form-item>
            
             <el-form-item label="手机号" prop="phone">
              <el-input v-model="ruleForm.phone" autocomplete="off"></el-input>
            </el-form-item>
             <el-form-item label="收货人" prop="consignee">
              <el-input v-model="ruleForm.consignee" autocomplete="off"></el-input>
            </el-form-item>
             <el-form-item label="送达时间" prop="deliveryTime">
              <el-input v-model="ruleForm.deliveryTime" autocomplete="off"></el-input>
            </el-form-item>
             <el-form-item label="用户备注" prop="remarks">
              <el-input v-model="ruleForm.remarks" autocomplete="off"></el-input>
            </el-form-item>
             <el-form-item label="订单金额" prop="orderAmount">
              <el-input v-model="ruleForm.orderAmount" autocomplete="off"></el-input>
            </el-form-item>
             <el-form-item label="订单状态" prop="orderState">
              <el-input v-model="ruleForm.orderState" autocomplete="off"></el-input>
            </el-form-item>
             
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveEdit">修 改</el-button>
          </span>
        </el-dialog>

        <el-table :data="tableData" style="width: 100%" max-height="400" height="400">
          <el-table-column fixed prop="orderNo" label="订单号" width="150"></el-table-column>
          <el-table-column prop="orderTime" label="下单时间" width="110"></el-table-column>
          <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
          <el-table-column prop="consignee" label="收货人" width="120"></el-table-column>
          <el-table-column prop="deliverAddress" label="送货地址" width="300"></el-table-column>
          <el-table-column prop="deliveryTime" label="送达时间" width="110"></el-table-column>
          <el-table-column prop="remarks" label="用户备注" width="120"></el-table-column>
          <el-table-column prop="orderAmount" label="订单金额" width="120"></el-table-column>
          <el-table-column fixed="right" prop="orderState" label="订单状态" width="120">
            <template slot-scope="scope">
              <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
              <el-button @click="handleEdit(scope.row)" type="text" size="small">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </card>
  </div>
</template>

<script>
import card from "../../components/Card";
import { editOrder } from "../../api/order";
export default {
  components: {
    card
  },
  created() {
    // 取到参数
    //  console.log(this.$route.query);
    console.log(this.$route.query.row);

    // params 方式传递的数据
    // console.log(this.$route.params)
  },
  data() {
    return {
      tableData: [JSON.parse(this.$route.query.row)],
      // 模态框是否显示 默认不显示
      dialogVisible: false,
      ruleForm: {}
    };
  },
  methods: {
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
      let {code}= await editOrder(this.ruleForm)
      if(code===0){
          this.$router.push('/order/order-list')
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>