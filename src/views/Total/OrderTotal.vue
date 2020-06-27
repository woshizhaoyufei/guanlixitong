<template>
  <div class="order-total">
    <el-form
      :model="form"
      ref="form"
      size="small"
      label-width="80px"
      :label-position="labelPosition"
    >
      <el-form-item label="选择时间">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="form.data"
          type="datetimerange"
          align="right"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 报表容器 -->
    <charts :options="options" />
  </div>
</template>

<script>
import charts from "../../components/Charts";
import { totalOrder } from "../../api/total";
import moment from "moment";
export default {
  components: {
    charts
  },
  data() {
    return {
      labelPosition: "right",
      form: {
        data: []
      },
      // 报表数据
      options: {
        title: "订单统计",
        legend: "订单金额",
        xData: [],
        series: []
      }
    };
  },
  methods: {
    onSubmit() {
      this.getData();
    },
    async getData() {
      // 数组转一下传
      let { data } = await totalOrder({
        date: this.form.data
          ? JSON.stringify(this.form.data)
          : JSON.stringify([])
      });

      this.options.xData = data.map(v => {
        return moment(v.orderTime).format("YYYY-MM-DD HH-mm-ss");
      });

      let yData = data.map(v => {
        return v.orderAmount;
      });
      this.options.series = [
        {
          name: "订单金额",
          type: "line",
          data: yData //动态数据
        }
      ];
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="less" scoped>
.order-total {
  > div {
    background-color: #fff;
    margin-top: 30px;
  }
  .el-form {
    margin-top: 20px;
  }
}
</style>