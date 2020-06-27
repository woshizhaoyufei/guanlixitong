<template>
  <div class="main-top">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="i in bread" :key="i.title" :to="{ path: i.path}">{{i.title}}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        欢迎你，{{info.account}}
        <img :src="info.imgUrl" alt />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="person">个人中心</el-dropdown-item>
        <el-dropdown-item command="gouout">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import local from "../../utils/local";
import { personMsg } from "../../api/account";

export default {
  data() {
    return {
      info: {},
      bread: []
    };
  },
  methods: {
    handleCommand(command) {
      if (command === "person") {
        this.$router.push("/account/account-msg");
      } else {
        // console.log("退出系统");
        // 清楚本地
        local.clear();
        // 弹出信息
        this.$message({
          type: "success",
          message: "已退出"
        });
        // 跳转登录
        this.$router.push("/login");
      }
    },
    async getInfo() {
      let { accountInfo } = await personMsg();
      this.info = accountInfo;
      // console.log(this.info);
      // 存入本地
      local.set("info", this.info);
    },
    // 写一个计算面包屑函数

    calcBread(route) {
      let arr = [{ title: "首页", path: "/home" }];

      route.matched.forEach(v => {
        if (v.meta.title) {
          arr.push({ title: v.meta.title, path: v.path });
          // console.log(arr);
        }
      });

      // console.log(arr);
      this.bread = arr;
    }
  },

  created() {
    // 获取用户信息的函数
    this.getInfo();
    // 接受信息
    this.$bus.$on("touppdatapic", () => {
      // 继续更新
      this.getInfo();
    });
    // 查看$route.matched 属性 这是个数组 每个元素都是一个对象 包含meta path
    // console.log(this.$route.matched);
    // 计算出面包屑
    this.calcBread(this.$route);
  },
  watch: {
    // 观察路由变化 '$route.path'
    "$route.path"() {
      // console.log(this.$route.matched);
      this.calcBread(this.$route);
    }
  }
};
</script>

<style lang="less" scoped>
.main-top {
  flex: 0 0 30px;
  background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .el-dropdown {
    margin-right: 15px;
    img {
      width: 60px;
      vertical-align: middle;
      margin-right: 20px;
      border-radius: 50%;
    }
  }
  .el-breadcrumb {
    margin-left: 15px;
  }
}
</style>