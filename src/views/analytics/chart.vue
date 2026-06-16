<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>数据图表</span>
      </template>
      <div class="chart-placeholder">
        <el-empty description="图表展示区域" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
}

.chart-placeholder {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
