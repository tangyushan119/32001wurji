import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Maintenance {
  id: string
  deviceId: string
  deviceName: string
  deviceNo: string
  maintenanceType: string
  maintenanceDate: string
  maintenanceContent: string
  maintenancePerson: string
  maintenanceResult: string
  nextMaintenanceDate: string
  status: string
  createTime: string
  updateTime: string
  archived: boolean
}

export const useMaintenanceStore = defineStore('maintenance', () => {
  const maintenances = ref<Maintenance[]>([
    { id: '1', deviceId: '1', deviceName: '无人机-001', deviceNo: 'DJI-2024-001', maintenanceType: '定期保养', maintenanceDate: '2024-06-01', maintenanceContent: '更换电池、检查电机、校准陀螺仪', maintenancePerson: '张三', maintenanceResult: '正常', nextMaintenanceDate: '2024-07-01', status: '已完成', createTime: '2024-06-01 10:00:00', updateTime: '2024-06-01 15:30:00', archived: false },
    { id: '2', deviceId: '1', deviceName: '无人机-001', deviceNo: 'DJI-2024-001', maintenanceType: '故障维修', maintenanceDate: '2024-05-15', maintenanceContent: '修复云台故障、更换排线', maintenancePerson: '李四', maintenanceResult: '正常', nextMaintenanceDate: '2024-06-15', status: '已完成', createTime: '2024-05-15 09:00:00', updateTime: '2024-05-15 14:00:00', archived: false },
    { id: '3', deviceId: '2', deviceName: '无人机-002', deviceNo: 'DJI-2024-002', maintenanceType: '定期保养', maintenanceDate: '2024-06-05', maintenanceContent: '检查螺旋桨、清洁机身、校准GPS', maintenancePerson: '王五', maintenanceResult: '正常', nextMaintenanceDate: '2024-07-05', status: '已完成', createTime: '2024-06-05 08:30:00', updateTime: '2024-06-05 12:00:00', archived: false },
    { id: '4', deviceId: '3', deviceName: '无人机-003', deviceNo: 'DJI-2024-003', maintenanceType: '故障维修', maintenanceDate: '2024-06-10', maintenanceContent: '更换电机、修复飞控系统', maintenancePerson: '赵六', maintenanceResult: '正常', nextMaintenanceDate: '2024-07-10', status: '进行中', createTime: '2024-06-10 10:00:00', updateTime: '2024-06-10 10:00:00', archived: false },
    { id: '5', deviceId: '4', deviceName: '无人机-004', deviceNo: 'DJI-2024-004', maintenanceType: '定期保养', maintenanceDate: '2024-06-12', maintenanceContent: '电池检测、软件升级、参数校准', maintenancePerson: '张三', maintenanceResult: '正常', nextMaintenanceDate: '2024-07-12', status: '已完成', createTime: '2024-06-12 09:00:00', updateTime: '2024-06-12 11:30:00', archived: false },
    { id: '6', deviceId: '5', deviceName: '无人机-005', deviceNo: 'DJI-2024-005', maintenanceType: '故障维修', maintenanceDate: '2024-05-20', maintenanceContent: '修复相机故障、更换镜头', maintenancePerson: '李四', maintenanceResult: '正常', nextMaintenanceDate: '2024-06-20', status: '已完成', createTime: '2024-05-20 08:00:00', updateTime: '2024-05-20 16:00:00', archived: true },
    { id: '7', deviceId: '6', deviceName: '无人机-006', deviceNo: 'DJI-2024-006', maintenanceType: '定期保养', maintenanceDate: '2024-06-14', maintenanceContent: '全面检查、清洁传感器、更新固件', maintenancePerson: '王五', maintenanceResult: '正常', nextMaintenanceDate: '2024-07-14', status: '待处理', createTime: '2024-06-14 10:00:00', updateTime: '2024-06-14 10:00:00', archived: false },
    { id: '8', deviceId: '2', deviceName: '无人机-002', deviceNo: 'DJI-2024-002', maintenanceType: '故障维修', maintenanceDate: '2024-04-25', maintenanceContent: '更换电池管理系统、修复充电故障', maintenancePerson: '赵六', maintenanceResult: '正常', nextMaintenanceDate: '2024-05-25', status: '已完成', createTime: '2024-04-25 09:00:00', updateTime: '2024-04-25 15:00:00', archived: true }
  ])

  const addMaintenance = (maintenance: Omit<Maintenance, 'id' | 'createTime' | 'updateTime' | 'archived'>) => {
    const newMaintenance: Maintenance = {
      ...maintenance,
      id: String(Date.now()),
      createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      archived: false
    }
    maintenances.value.unshift(newMaintenance)
  }

  const updateMaintenance = (id: string, maintenance: Partial<Omit<Maintenance, 'id' | 'createTime' | 'archived'>>) => {
    const index = maintenances.value.findIndex(m => m.id === id)
    if (index !== -1) {
      maintenances.value[index] = {
        ...maintenances.value[index],
        ...maintenance,
        updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
      }
    }
  }

  const removeMaintenance = (id: string) => {
    const index = maintenances.value.findIndex(m => m.id === id)
    if (index !== -1) {
      maintenances.value.splice(index, 1)
    }
  }

  const archiveMaintenance = (id: string) => {
    const index = maintenances.value.findIndex(m => m.id === id)
    if (index !== -1) {
      maintenances.value[index].archived = true
      maintenances.value[index].updateTime = new Date().toISOString().replace('T', ' ').slice(0, 19)
    }
  }

  const unarchiveMaintenance = (id: string) => {
    const index = maintenances.value.findIndex(m => m.id === id)
    if (index !== -1) {
      maintenances.value[index].archived = false
      maintenances.value[index].updateTime = new Date().toISOString().replace('T', ' ').slice(0, 19)
    }
  }

  const getMaintenanceById = (id: string) => {
    return maintenances.value.find(m => m.id === id)
  }

  const getMaintenancesByDeviceId = (deviceId: string) => {
    return maintenances.value.filter(m => m.deviceId === deviceId && !m.archived)
  }

  const activeMaintenances = computed(() => maintenances.value.filter(m => !m.archived))
  const archivedMaintenances = computed(() => maintenances.value.filter(m => m.archived))
  const totalCount = computed(() => maintenances.value.length)
  const activeCount = computed(() => activeMaintenances.value.length)
  const archivedCount = computed(() => archivedMaintenances.value.length)
  const pendingCount = computed(() => activeMaintenances.value.filter(m => m.status === '待处理').length)
  const ongoingCount = computed(() => activeMaintenances.value.filter(m => m.status === '进行中').length)
  const completedCount = computed(() => activeMaintenances.value.filter(m => m.status === '已完成').length)

  return {
    maintenances,
    addMaintenance,
    updateMaintenance,
    removeMaintenance,
    archiveMaintenance,
    unarchiveMaintenance,
    getMaintenanceById,
    getMaintenancesByDeviceId,
    activeMaintenances,
    archivedMaintenances,
    totalCount,
    activeCount,
    archivedCount,
    pendingCount,
    ongoingCount,
    completedCount
  }
})
