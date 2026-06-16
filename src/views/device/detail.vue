<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>设备详情</span>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="设备名称">无人机-001</el-descriptions-item>
        <el-descriptions-item label="设备类型">航拍无人机</el-descriptions-item>
        <el-descriptions-item label="设备编号">DJI-2024-001</el-descriptions-item>
        <el-descriptions-item label="当前状态">
          <el-tag type="success">在线</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="所在位置" :span="2">北京市朝阳区</el-descriptions-item>
        <el-descriptions-item label="创建时间">2024-01-15</el-descriptions-item>
        <el-descriptions-item label="最后更新">2024-06-15</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
}
</style>
