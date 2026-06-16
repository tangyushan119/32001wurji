<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>任务列表</span>
      </template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="任务名称" />
        <el-table-column prop="device" label="关联设备" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" />
        <el-table-column prop="endTime" label="结束时间" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { name: '航拍任务-A', device: '无人机-001', status: '进行中', startTime: '2024-06-15 09:00', endTime: '2024-06-15 12:00' },
  { name: '测绘任务-B', device: '无人机-002', status: '已完成', startTime: '2024-06-14 14:00', endTime: '2024-06-14 18:00' },
  { name: '巡检任务-C', device: '无人机-003', status: '待执行', startTime: '-', endTime: '-' }
])

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '进行中': 'warning',
    '已完成': 'success',
    '待执行': 'info'
  }
  return map[status] || 'info'
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
}
</style>
