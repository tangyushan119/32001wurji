<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>设备列表</span>
          <div class="header-actions">
            <el-button type="success" @click="handleExport">
              <component :is="Download" />
              导出Excel
            </el-button>
            <el-button type="primary" @click="handleAdd">
              <component :is="Plus" />
              添加设备
            </el-button>
          </div>
        </div>
      </template>
      <div class="stats-bar">
        <div class="stat-item">
          <el-tag type="info">总设备数</el-tag>
          <span class="stat-value">{{ deviceStore.totalCount }}</span>
        </div>
        <div class="stat-item">
          <el-tag type="success">在线</el-tag>
          <span class="stat-value online">{{ deviceStore.onlineCount }}</span>
        </div>
        <div class="stat-item">
          <el-tag type="danger">离线</el-tag>
          <span class="stat-value offline">{{ deviceStore.offlineCount }}</span>
        </div>
      </div>
      <el-table :data="deviceStore.devices" style="width: 100%">
        <el-table-column prop="name" label="设备名称" />
        <el-table-column prop="deviceNo" label="设备编号" />
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
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleDetail(row.id)">查看详情</el-button>
            <el-button size="small" type="primary" @click="handleReport(row.id)">报表</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Plus, Download } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useDeviceStore, type Device } from '@/stores/device'
import { ElMessage, ElMessageBox } from 'element-plus'
import { exportToExcelWithFormat, type ExportColumn } from '@/utils/excel'

const router = useRouter()
const deviceStore = useDeviceStore()

const handleAdd = () => {
  router.push('/drone/add')
}

const handleDetail = (id: string) => {
  router.push(`/drone/detail?id=${id}`)
}

const handleReport = (id: string) => {
  router.push(`/drone/report?id=${id}`)
}

const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除该设备吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    deviceStore.removeDevice(id)
    ElMessage.success('删除成功')
  } catch {
    ElMessage.info('已取消删除')
  }
}

const handleExport = () => {
  const data = deviceStore.devices.map(device => ({
    ...device,
    lastUpdate: device.lastUpdate ?? ''
  }))

  if (data.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const columns: ExportColumn<Device>[] = [
    { key: 'deviceNo', label: '设备编号' },
    { key: 'name', label: '设备名称' },
    { key: 'type', label: '设备类型' },
    { key: 'status', label: '状态' },
    { key: 'location', label: '位置' },
    { key: 'createTime', label: '创建时间' },
    { key: 'lastUpdate', label: '最后更新' }
  ]

  const fileName = `无人机档案_${new Date().toISOString().split('T')[0]}.xlsx`
  exportToExcelWithFormat(data, columns, '无人机档案', fileName)
  ElMessage.success(`成功导出 ${data.length} 条设备数据`)
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

  &.online {
    color: #67c23a;
  }

  &.offline {
    color: #f56c6c;
  }
}
</style>