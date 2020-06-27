<template>
  <div class="layout">
    <menuleft></menuleft>
    <div class="main">
      <!-- 右侧头部拆分一个组件 -->
      <mainTop />
      <!-- 设置一个路由出口 内容的组件在此处输出渲染 间隙颜色不一样 加个div包裹下-->
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
// 把左侧菜单拆分成一个组件 引入注册后使用
import menuleft from "./menuleft";
// 右侧头部也拆分小组件 引入注册后使用
import mainTop from "./MainTop";
export default {
  components: {
    menuleft,
    mainTop
  }
};
</script>

<style lang="less" scoped>
.layout {
  height: 100%;
  display: flex;
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    .main-content {
      flex: 1;
      background-color: #f0f2f5;
      padding: 5px 15px;
      box-sizing: border-box;
    overflow: auto;
    background-image: linear-gradient(to top, #a8edea 0%, #fed6e3 100%);
  
    }
  }
}
</style>