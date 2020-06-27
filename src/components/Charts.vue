<template>
  <div class="chartsBox">
    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div ref="main" style="width: 95%;height:400px;"></div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  mounted() {
    //   挂在后调用 操作dom
    this.drawCharts();
  },
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    // 绘制报表函数
    drawCharts() {
      // 1. 初始化报表
      this.myChart = echarts.init(this.$refs.main);

      // 2. 核心配置 ( 将来我们需要动的 只有配置 )
      var option = {
        title: {
          text: this.options.title //1外部传入
        },
        tooltip: {
            trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {
          data: this.options.legend // 2外部传入
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "5%",
          top: "12%",
          containLabel: true,
        },
         toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
             type: "category",
          boundaryGap: false,
          data: this.options.xData //3外部传入
        },
        yAxis: { type: "value",},
        series: this.options.series //4外部传入
      };
      // 3. 使用配置生成报表
      this.myChart.setOption(option);
    }
  },
  //   组件内部深度监听
  watch: {
    options: {
        // newVal就是新的数据
      handler(newVal, oldVal) {
          this.myChart.setOption({
                 title: {
          text: newVal.title //1外部传入
        },
        legend: {
          data: newVal.legend // 2外部传入
        },
        xAxis: {
          data: newVal.xData //3外部传入
        },
        series: newVal.series, 
            
          })
      },
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
.chartsBox {
  background-color: #fff;
  margin-top: 25px;
  padding: 20px;
  box-sizing: border-box;
}
</style>