<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="6" v-for="(v,i) in topMessage" :key="i">
        <div class="item">
          <div class="icon">
            <img width="60" height="60" :src="v.iconSrc" />
          </div>
          <div class="count">
            <p>{{ v.title }}</p>
            <h1>{{ v.count }}</h1>
          </div>
        </div>
      </el-col>
    </el-row>
    <charts :options="options"></charts>
  </div>
</template>

<script>
import charts from "../../components/Charts";
import { homeTotal } from "../../api/total";
export default {
  data() {
    return {
      //  顶部的数据
      topMessage: [
        {
          iconSrc: require("@/assets/imgs/order-icon01.png"),
          title: "总订单",
          count: ""
        },
        {
          iconSrc: require("@/assets/imgs/sale-icon01.png"),
          title: "总销售额",
          count: ""
        },
        {
          iconSrc: require("@/assets/imgs/order-icon02.png"),
          title: "今日订单",
          count: ""
        },
        {
          iconSrc: require("@/assets/imgs/sale-icon02.png"),
          title: "今日销售额",
          count: ""
        }
      ],
      // 报表配置 [数据从后端来 发送ajax]
      options: {
        title: "数据统计",
        legend: ["订单", "销售额"],
        xData: [],
        series: []
      }
    };
  },
  components: {
    charts
  },
  methods: {
    async toGetData(){
         // 发请求
    let {
      todayOrder,
      totalAmount,
      totalOrder,
      totayAmount,
      xData,
      amountData,
      orderData
    } = await homeTotal(); 
    // 和data内topMessage的对象元素匹配 总订单 总销售额 今日订单 今日销售额
    let arr = [totalOrder, totalAmount, todayOrder, totayAmount];

    arr.forEach((v, i) => {
      // 获取的到前4个数据组成数组 遍历赋值给对应的count值
      this.topMessage[i].count = v;
    });

    // 报表数据
    this.options.xData=xData
    this.options.series =[
      {
          name: "订单",
          type: "line",
          data: orderData,
        },
        {
          name: "销售额",
          type: "line",
          data: amountData,
        },


    ]
    }
  },
  mounted(){
    this.toGetData()
  },
  
};
</script>

<style lang="less" scoped>
.home {
  .el-row {
    .item {
      background-color: #fff;
      max-width: 260px;
      height: 100px;
      display: flex;
      .icon {
        flex: 0 0 100px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .count {
        flex: 1;
        padding: 20px;
        box-sizing: border-box;
        p {
          color: #97a8be;
          margin-bottom: 20px;
        }
        h1 {
          font-weight: 700;
          color: orange;
        }
      }
    }
  }
}
</style>