<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>历史任务</span>
      </template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="任务名称" />
        <el-table-column prop="device" label="关联设备" />
        <el-table-column prop="result" label="执行结果">
          <template #default="{ row }">
            <el-tag :type="row.result === '成功' ? 'success' : 'danger'">
              {{ row.result }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="执行日期" />
        <el-table-column prop="duration" label="耗时" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { name: '历史任务-001', device: '无人机-001', result: '成功', date: '2024-06-10', duration: '2小时30分' },
  { name: '历史任务-002', device: '无人机-002', result: '成功', date: '2024-06-08', duration: '3小时15分' },
  { name: '历史任务-003', device: '无人机-003', result: '失败', date: '2024-06-05', duration: '1小时20分' }
])
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
}
</style>
