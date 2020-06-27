<template>
  <div class="card">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 插标题 -->
        <slot name="title" />
      </div>
      <div class="content">
        <!-- 插内容 -->
        <slot name="content" />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>

</style>