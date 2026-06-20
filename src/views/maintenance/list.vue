<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>维保记录</span>
          <div class="header-actions">
            <el-button type="success" @click="handleExport">
              <component :is="Download" />
              导出Excel
            </el-button>
            <el-button type="primary" @click="handleAdd">
              <component :is="Plus" />
              新增维保记录
            </el-button>
          </div>
        </div>
      </template>
      <div class="stats-bar">
        <div class="stat-item">
          <el-tag type="info">总记录</el-tag>
          <span class="stat-value">{{ maintenanceStore.totalCount }}</span>
        </div>
        <div class="stat-item">
          <el-tag type="warning">待处理</el-tag>
          <span class="stat-value pending">{{ maintenanceStore.pendingCount }}</span>
        </div>
        <div class="stat-item">
          <el-tag type="primary">进行中</el-tag>
          <span class="stat-value ongoing">{{ maintenanceStore.ongoingCount }}</span>
        </div>
        <div class="stat-item">
          <el-tag type="success">已完成</el-tag>
          <span class="stat-value completed">{{ maintenanceStore.completedCount }}</span>
        </div>
        <div class="stat-item">
          <el-tag type="danger">已归档</el-tag>
          <span class="stat-value archived">{{ maintenanceStore.archivedCount }}</span>
        </div>
      </div>
      <div class="filter-bar">
        <el-select v-model="filters.status" placeholder="状态筛选" style="width: 120px" @change="handleFilter">
          <el-option label="全部" value="" />
          <el-option label="待处理" value="待处理" />
          <el-option label="进行中" value="进行中" />
          <el-option label="已完成" value="已完成" />
        </el-select>
        <el-select v-model="filters.type" placeholder="维保类型" style="width: 120px" @change="handleFilter">
          <el-option label="全部" value="" />
          <el-option label="定期保养" value="定期保养" />
          <el-option label="故障维修" value="故障维修" />
        </el-select>
        <el-date-picker v-model="filters.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="handleFilter" />
        <el-input v-model="filters.keyword" placeholder="搜索设备名称或编号" style="width: 200px" @input="handleFilter">
          <template #prefix>
            <component :is="Search" />
          </template>
        </el-input>
        <el-switch v-model="showArchived" active-text="显示归档" inactive-text="显示正常" @change="handleFilter" />
      </div>
      <el-table :data="filteredMaintenances" style="width: 100%">
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="deviceNo" label="设备编号" />
        <el-table-column prop="maintenanceType" label="维保类型">
          <template #default="{ row }">
            <el-tag :type="row.maintenanceType === '定期保养' ? 'success' : 'danger'">
              {{ row.maintenanceType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="maintenanceDate" label="维保日期" />
        <el-table-column prop="maintenancePerson" label="维保人员" />
        <el-table-column prop="maintenanceContent" label="维保内容" show-overflow-tooltip />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="nextMaintenanceDate" label="下次维保" />
        <el-table-column label="操作" width="280">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row.id)">编辑</el-button>
            <el-button size="small" type="success" @click="handleArchive(row.id)">{{ row.archived ? '取消归档' : '归档' }}</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Download, Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useMaintenanceStore, type Maintenance } from '@/stores/maintenance'
import { ElMessage, ElMessageBox } from 'element-plus'
import { exportToExcelWithFormat, type ExportColumn } from '@/utils/excel'

const router = useRouter()
const maintenanceStore = useMaintenanceStore()

const showArchived = ref(false)
const filters = ref({
  status: '',
  type: '',
  dateRange: null as [Date, Date] | null,
  keyword: ''
})

const filteredMaintenances = computed(() => {
  let data = showArchived.value ? maintenanceStore.archivedMaintenances : maintenanceStore.activeMaintenances

  if (filters.value.status) {
    data = data.filter(m => m.status === filters.value.status)
  }
  if (filters.value.type) {
    data = data.filter(m => m.maintenanceType === filters.value.type)
  }
  if (filters.value.dateRange) {
    const [start, end] = filters.value.dateRange
    const startStr = start.toISOString().split('T')[0]
    const endStr = end.toISOString().split('T')[0]
    data = data.filter(m => m.maintenanceDate >= startStr && m.maintenanceDate <= endStr)
  }
  if (filters.value.keyword) {
    const keyword = filters.value.keyword.toLowerCase()
    data = data.filter(m => m.deviceName.toLowerCase().includes(keyword) || m.deviceNo.toLowerCase().includes(keyword))
  }

  return data
})

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    '待处理': 'warning',
    '进行中': 'primary',
    '已完成': 'success'
  }
  return types[status] || 'info'
}

const handleFilter = () => {}

const handleAdd = () => {
  router.push('/maintenance/add')
}

const handleEdit = (id: string) => {
  router.push(`/maintenance/add?id=${id}`)
}

const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除该维保记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    maintenanceStore.removeMaintenance(id)
    ElMessage.success('删除成功')
  } catch {
    ElMessage.info('已取消删除')
  }
}

const handleArchive = async (id: string) => {
  const maintenance = maintenanceStore.getMaintenanceById(id)
  const action = maintenance?.archived ? '取消归档' : '归档'
  try {
    await ElMessageBox.confirm(`确定要${action}该维保记录吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    if (maintenance?.archived) {
      maintenanceStore.unarchiveMaintenance(id)
    } else {
      maintenanceStore.archiveMaintenance(id)
    }
    ElMessage.success(`${action}成功`)
  } catch {
    ElMessage.info('已取消操作')
  }
}

const handleExport = () => {
  const data = filteredMaintenances.value.map(m => ({
    ...m
  }))

  if (data.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const columns: ExportColumn<Maintenance>[] = [
    { key: 'deviceName', label: '设备名称' },
    { key: 'deviceNo', label: '设备编号' },
    { key: 'maintenanceType', label: '维保类型' },
    { key: 'maintenanceDate', label: '维保日期' },
    { key: 'maintenancePerson', label: '维保人员' },
    { key: 'maintenanceContent', label: '维保内容' },
    { key: 'maintenanceResult', label: '维保结果' },
    { key: 'status', label: '状态' },
    { key: 'nextMaintenanceDate', label: '下次维保' },
    { key: 'createTime', label: '创建时间' }
  ]

  const fileName = `维保记录_${new Date().toISOString().split('T')[0]}.xlsx`
  exportToExcelWithFormat(data, columns, '维保记录', fileName)
  ElMessage.success(`成功导出 ${data.length} 条维保记录`)
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.stats-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;

  &.pending {
    color: #e6a23c;
  }

  &.ongoing {
    color: #409eff;
  }

  &.completed {
    color: #67c23a;
  }

  &.archived {
    color: #909399;
  }
}

.filter-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
}
</style>
