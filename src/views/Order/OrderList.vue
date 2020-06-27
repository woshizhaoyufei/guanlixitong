

<template>
  <div class="order-list">
    <card>
      <span slot="title">默认订单列表</span>
      <div slot="content">
        <!-- 头部查询表单 -->
        <el-form
          ref="form"
          :model="form"
          label-width="70px"
          size="small"
          class="top-form"
          :label-position="labelPosition"
        >
          <el-form-item label="订单号">
            <el-input v-model="form.orderNo" placeholder="订单号"></el-input>
          </el-form-item>
          <el-form-item label="收货人">
            <el-input v-model="form.consignee" placeholder="收货人"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="form.phone" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select v-model="form.orderState" placeholder="订单状态">
              <el-option label="已完成" value="已完成"></el-option>
              <el-option label="已受理" value="已受理"></el-option>
              <el-option label="派送中" value="派送中"></el-option>
            </el-select>
          </el-form-item>
          <!-- 时间选择 -->
          <el-form-item label="选择时间">
            <template>
              <el-date-picker
                v-model="form.date"
                type="datetimerange"
                align="right"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['12:00:00', '08:00:00']"
              ></el-date-picker>
            </template>
          </el-form-item>

          <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
          <el-button type="primary" size="small" @click="resetForm">重置</el-button>
        </el-form>
        <!-- 内容显示表格 -->
        <el-table :data="tableData" style="width: 100%" max-height="400" >
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
              <el-button @click.native.prevent="handleEdit(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5,10,15]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </card>
  </div>
</template>

<script>
import card from "../../components/Card";
import { orderList, orderListCheck } from "../../api/order";
import moment from "moment";
export default {
  components: {
    card
  },
  data() {
    return {
      form: {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: "",
        date: []
      },

      labelPosition: "right",
      tableData: [],
      // 分页 变量站位
      currentPage: 1,
      pageSize: 5,
      total: 0
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      let { data, total } = await orderList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        orderNo: this.form.orderNo,
        consignee: this.form.consignee,
        phone: this.form.phone,
        orderState: this.form.orderState,
        date: JSON.stringify(this.form.date)
      });
     /*  if (!data.length && this.currentPage !== 1) {
        this.currentPage -= 1;
        this.getOrderList();
      } */
      data.forEach(v => {
        v.orderTime = moment(v.orderTime).format("YYYY-MM-DD HH:mm:ss");
        v.deliveryTime = moment(v.deliveryTime).format("YYYY-MM-DD HH:mm:ss");
      });
      this.tableData = data;
      this.total = total;
    },

    async onSubmit() {
      this.currentPage = 1;
      this.getOrderList();
    },

    resetForm() {
      this.form = {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: "",
        value: []
      };
      this.getOrderList();
    },
    handleEdit(row) {
      // console.log(index, row);
      // query 传参
      this.$router.push({
        path: "/order/order-details",
        query: { row: JSON.stringify(row) }
      });

      // params传参
      // this.$router.push({
      //   name:'order-details',
      //   params:{id:row.id}
      // })
    },

    // 分页每页数据条数改变时触发 此函数 有一个形参 条数
    handleSizeChange(val) {
      // console.log("每页：", val);
      this.pageSize = val;
      this.getOrderList();
    },
    // 分页当前页改变时触发
    handleCurrentChange(val) {
      // console.log("当前页：", val);
      this.currentPage = val;
      this.getOrderList();
    }
  }
};
</script>

<style lang="less" scoped>
.top-form {
  > div {
    display: inline-block;
    margin-left: 10px;
  }
}
.el-button--primary {
  margin-left: 20px;
}
.page {
  margin-top: 20px;
  margin-bottom: 20px;
}

</style>