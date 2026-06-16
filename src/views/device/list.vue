<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>设备列表</span>
      </template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="设备名称" />
        <el-table-column prop="type" label="设备类型" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === '在线' ? 'success' : 'danger'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="位置" />
        <el-table-column prop="createTime" label="创建时间" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { name: '无人机-001', type: '航拍无人机', status: '在线', location: '北京市朝阳区', createTime: '2024-01-15' },
  { name: '无人机-002', type: '测绘无人机', status: '离线', location: '上海市浦东新区', createTime: '2024-01-16' },
  { name: '无人机-003', type: '巡检无人机', status: '在线', location: '广州市天河区', createTime: '2024-01-17' }
])
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
}
</style>
