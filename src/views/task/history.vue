<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="header-content">
          <span>飞行历史归档查询</span>
          <el-tag type="info" size="small">共 {{ filteredTasks.length }} 条记录</el-tag>
        </div>
      </template>
      <div class="search-bar">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="handleDateChange"
        />
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
      <el-table :data="filteredTasks" style="width: 100%" border>
        <el-table-column prop="name" label="任务名称" />
        <el-table-column prop="deviceName" label="关联设备" />
        <el-table-column prop="type" label="任务类型" />
        <el-table-column prop="startTime" label="开始时间" />
        <el-table-column prop="endTime" label="结束时间" />
        <el-table-column prop="flightArea" label="飞行区域" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="archiveTime" label="归档时间" />
        <el-table-column prop="workContent" label="作业内容" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/task'

const taskStore = useTaskStore()
const dateRange = ref<[string, string] | null>(null)

const filteredTasks = computed(() => {
  if (!dateRange.value) {
    return taskStore.archivedTasks
  }
  const [startDate, endDate] = dateRange.value
  return taskStore.queryArchivedByDateRange(startDate, endDate)
})

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '已归档': 'info',
    '已完成': 'success',
    '进行中': 'warning',
    '待执行': 'primary'
  }
  return map[status] || 'info'
}

const handleDateChange = () => {}

const handleSearch = () => {}

const handleReset = () => {
  dateRange.value = null
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}
</style>