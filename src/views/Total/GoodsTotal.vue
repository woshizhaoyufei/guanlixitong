<template>
  <div class="goods-total">
    <el-form ref="form" size="small" label-width="80px" :label-position="labelPosition">
      <el-form-item label="选择时间">
        <el-time-picker
          is-range
          v-model="value1"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        ></el-time-picker>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div ref="main" style="width: 100%;height:400px;"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      labelPosition: "right",
      value1: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)]
    };
  },
  methods: {
    onSubmit() {}
  },
 mounted() {
    // 1. 初始化报表
    const myChart = echarts.init(this.$refs.main);

    // 2. 核心配置 ( 将来我们需要动的 只有配置 )
    var option = {
      title: {
        text: "ECharts 入门示例"
      },
      tooltip: {},
      legend: {
        data: ["销量"]
      },
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    };
    // 3. 使用配置生成报表
    myChart.setOption(option);
  }
};
</script>

<style lang="less" scoped>
.goods-total {
  > div {
    background-color: #fff;
    margin-top: 30px;
  }
  .el-form{
      margin-top: 20px;
  }
 
  
}
</style>