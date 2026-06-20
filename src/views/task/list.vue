<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="header-content">
          <span>任务列表</span>
          <div class="header-actions">
            <el-tag type="info" size="small">共 {{ taskStore.activeTasks.length }} 条任务</el-tag>
            <el-button type="primary" @click="handleBatchArchive" :disabled="selectedTasks.length === 0">批量归档</el-button>
          </div>
        </div>
      </template>
      <el-table :data="taskStore.activeTasks" style="width: 100%" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" />
        <el-table-column prop="name" label="任务名称" />
        <el-table-column prop="deviceName" label="关联设备" />
        <el-table-column prop="type" label="任务类型" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" />
        <el-table-column prop="endTime" label="结束时间" />
        <el-table-column prop="flightArea" label="飞行区域" />
        <el-table-column prop="workContent" label="作业内容" show-overflow-tooltip />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button v-if="row.status === '待执行'" type="primary" size="small" @click="handleStart(row.id)">开始执行</el-button>
            <el-button v-if="row.status === '进行中'" type="success" size="small" @click="handleComplete(row.id)">完成任务</el-button>
            <el-button v-if="row.status === '已完成'" type="info" size="small" @click="handleArchive(row.id)">归档</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useTaskStore } from '@/stores/task'

const taskStore = useTaskStore()
const selectedTasks = ref<string[]>([])

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '进行中': 'warning',
    '已完成': 'success',
    '待执行': 'primary'
  }
  return map[status] || 'info'
}

const handleSelectionChange = (val: any[]) => {
  selectedTasks.value = val.map(item => item.id)
}

const handleStart = (id: string) => {
  taskStore.updateTask(id, { status: '进行中' })
  ElMessage.success('任务已开始执行')
}

const handleComplete = (id: string) => {
  taskStore.completeTask(id)
  ElMessage.success('任务已完成')
}

const handleArchive = (id: string) => {
  taskStore.archiveTask(id)
  ElMessage.success('任务已归档')
}

const handleBatchArchive = () => {
  const completedTasks = taskStore.activeTasks.filter(t => t.status === '已完成' && selectedTasks.value.includes(t.id))
  if (completedTasks.length === 0) {
    ElMessage.warning('请选择已完成的任务进行归档')
    return
  }
  taskStore.archiveTasks(completedTasks.map(t => t.id))
  ElMessage.success(`成功归档 ${completedTasks.length} 条任务`)
  selectedTasks.value = []
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

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>