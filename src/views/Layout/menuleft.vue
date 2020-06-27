<template>
  <div class="menu-left">
    <div class="logo">
      <img src="../../assets/imgs/1231.jpg" alt />
    </div>
    <el-menu
      router
      unique-opened
      text-color="#fff"
      background-color="#304156"
      :default-active="currentActive"
      collapse-transition
    >
     <template v-for="v in menus">
        <!-- 后台首页 没儿子 children只有1个-->
      <el-menu-item :index="v.path + '/' + v.children[0].path" :key='v.path' v-if="v.children&&v.children.length===1">
        <i class="iconfont" :class="v.meta && v.meta.icon ? v.meta.icon: v.children[0].meta.icon "></i>
        <!-- 如果 有meta meta有icon就用自己的 否则就用儿子的 -->
        <span slot="title">{{v.meta && v.meta.title ? v.meta.title: v.children[0].meta.title }}</span>
      </el-menu-item>

      <!-- 商品管理  有儿子的，children至少2个以上-->
      <!-- el-submenu 不会跳转 index值不重复就行 -->
      <el-submenu :index="v.path" :key='v.path' v-else>
        <template slot="title">
          <i class="iconfont" :class="v.meta && v.meta.icon"></i>
          <span slot="title">{{ v.meta && v.meta.title }}</span>
        </template>
        <el-menu-item v-for="i in v.children" :index="v.path+'/'+i.path" :key='i.path'>{{i.meta.title}}</el-menu-item>
      </el-submenu>
     </template>

      <!-- el-submenu 有子菜单 -->
      <!-- <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">导航一</span>
        </template>
        <el-menu-item index="1-1">选项1</el-menu-item>
        <el-menu-item index="1-2">选项2</el-menu-item>
      </el-submenu>-->
      <!-- 无子菜单 -->
      <!-- <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">导航二</span>
      </el-menu-item>-->
    </el-menu>
  </div>
</template>

<script>
import local from "../../utils/local";
import {creatRouters} from "../../router"
export default {
  data() {
    return {
      menus: []
    };
  },
  // 订单详情 的路径 路由路径设置为订单列表达到激活效果
  computed: {
    currentActive() {
      if (this.$route.path == "/order/order-details") {
        return "/order/order-list";
      }

      return this.$route.path;
    }
  },
  created() {
// 登录成功 调用从路由引入的函数
    creatRouters()
    // 路由先走
    this.menus = local.get("menus");
    // console.log(this.menus);
  }
};
</script>

<style lang="less" scoped>
.menu-left {
  flex: 0 0 200px;
  background-color: #304156;
  > ul {
    border-right: none;
    li {
      i {
        font-size: 17px;
        margin-right: 10px;
      }
    }
  }
  .logo {
    text-align: center;
    img {
      width: 35%;
      margin: 20px auto;
      border-radius: 50%;
    }
  }
}
</style>