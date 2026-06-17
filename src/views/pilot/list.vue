<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>飞手人员列表</span>
          <el-button type="primary" @click="handleAdd">
            <component :is="Plus" />
            新增飞手
          </el-button>
        </div>
      </template>
      <div class="stats-bar">
        <div class="stat-item">
          <el-tag type="info">总人数</el-tag>
          <span class="stat-value">{{ pilotStore.totalCount }}</span>
        </div>
        <div class="stat-item">
          <el-tag type="success">在职</el-tag>
          <span class="stat-value online">{{ pilotStore.activeCount }}</span>
        </div>
        <div class="stat-item">
          <el-tag type="danger">离职</el-tag>
          <span class="stat-value offline">{{ pilotStore.inactiveCount }}</span>
        </div>
      </div>
      <el-table :data="pilotStore.pilots" style="width: 100%">
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="gender" label="性别" width="80" />
        <el-table-column prop="idCard" label="身份证号" width="180">
          <template #default="{ row }">
            {{ maskIdCard(row.idCard) }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="130">
          <template #default="{ row }">
            {{ maskPhone(row.phone) }}
          </template>
        </el-table-column>
        <el-table-column prop="birthDate" label="出生年月" width="120">
          <template #default="{ row }">
            {{ formatDate(row.birthDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="entryDate" label="入职时间" width="120" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '在职' ? 'success' : 'danger'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="licenses" label="持证数量" width="100">
          <template #default="{ row }">
            <span>{{ row.licenses?.length || 0 }} 个</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastUpdate" label="最后更新" width="120" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row.id)">查看详情</el-button>
            <el-button size="small" type="primary" @click="handleEdit(row.id)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="detailVisible" title="飞手详情" width="700px">
      <el-descriptions :column="2" border v-if="currentPilot">
        <el-descriptions-item label="姓名">{{ currentPilot.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ currentPilot.gender }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ maskIdCard(currentPilot.idCard) }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ maskPhone(currentPilot.phone) }}</el-descriptions-item>
        <el-descriptions-item label="出生年月">{{ formatDate(currentPilot.birthDate) }}</el-descriptions-item>
        <el-descriptions-item label="入职时间">{{ currentPilot.entryDate }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentPilot.status === '在职' ? 'success' : 'danger'">{{ currentPilot.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentPilot.createTime }}</el-descriptions-item>
        <el-descriptions-item label="持证信息" :span="2">
          <el-table :data="currentPilot.licenses" style="width: 100%" size="small">
            <el-table-column prop="name" label="证照名称" />
            <el-table-column prop="no" label="证照编号" />
            <el-table-column prop="issueDate" label="发证日期" />
            <el-table-column prop="expireDate" label="到期日期" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="row.status === '有效' ? 'success' : 'danger'">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { usePilotStore } from '@/stores/pilot'
import type { Pilot } from '@/stores/pilot'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const pilotStore = usePilotStore()

const detailVisible = ref(false)
const currentPilot = ref<Pilot | null>(null)

const handleAdd = () => {
  router.push('/pilot/add')
}

const handleView = (id: string) => {
  currentPilot.value = pilotStore.getPilotById(id) || null
  detailVisible.value = true
}

const handleEdit = (id: string) => {
  router.push(`/pilot/add?id=${id}`)
}

const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除该飞手吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    pilotStore.removePilot(id)
    ElMessage.success('删除成功')
  } catch {
    ElMessage.info('已取消删除')
  }
}

const maskIdCard = (idCard: string) => {
  if (!idCard) return ''
  return idCard.slice(0, 6) + '**********' + idCard.slice(-4)
}

const maskPhone = (phone: string) => {
  if (!phone) return ''
  return phone.slice(0, 3) + '****' + phone.slice(-4)
}

const formatDate = (date: string) => {
  if (!date) return ''
  return date.slice(0, 7)
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
