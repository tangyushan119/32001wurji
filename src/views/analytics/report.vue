<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>数据报表</span>
      </template>
      <div class="report-content">
        <el-statistic title="总设备数" :value="128" suffix="台" />
        <el-statistic title="在线设备" :value="96" suffix="台" />
        <el-statistic title="任务总数" :value="256" suffix="个" />
        <el-statistic title="完成率" :value="85.5" suffix="%" />
      </div>
    </el-card>
    <el-card style="margin-top: 20px">
      <template #header>
        <span>详细统计</span>
      </template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="month" label="月份" />
        <el-table-column prop="devices" label="设备数量" />
        <el-table-column prop="tasks" label="任务数量" />
        <el-table-column prop="completion" label="完成率" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { month: '2024-01', devices: 80, tasks: 120, completion: '82%' },
  { month: '2024-02', devices: 95, tasks: 150, completion: '85%' },
  { month: '2024-03', devices: 110, tasks: 180, completion: '88%' },
  { month: '2024-04', devices: 120, tasks: 220, completion: '86%' },
  { month: '2024-05', devices: 125, tasks: 240, completion: '84%' },
  { month: '2024-06', devices: 128, tasks: 256, completion: '85.5%' }
])
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
}

.report-content {
  display: flex;
  justify-content: space-around;
}
</style>
