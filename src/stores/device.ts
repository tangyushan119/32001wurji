import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Device {
  id: string
  name: string
  type: string
  status: string
  location: string
  createTime: string
  deviceNo?: string
  lastUpdate?: string
}

export interface DeviceReport {
  id: string
  deviceId: string
  deviceName: string
  flightHours: number
  taskCount: number
  completionRate: number
  batteryHealth: number
  maintenanceTimes: number
  month: string
}

export const useDeviceStore = defineStore('device', () => {
  const devices = ref<Device[]>([
    { id: '1', name: '无人机-001', type: '航拍无人机', status: '在线', location: '北京市朝阳区', createTime: '2024-01-15', deviceNo: 'DJI-2024-001', lastUpdate: '2024-06-15' },
    { id: '2', name: '无人机-002', type: '测绘无人机', status: '离线', location: '上海市浦东新区', createTime: '2024-01-16', deviceNo: 'DJI-2024-002', lastUpdate: '2024-06-14' },
    { id: '3', name: '无人机-003', type: '巡检无人机', status: '在线', location: '广州市天河区', createTime: '2024-01-17', deviceNo: 'DJI-2024-003', lastUpdate: '2024-06-15' },
    { id: '4', name: '无人机-004', type: '农业植保', status: '在线', location: '成都市武侯区', createTime: '2024-02-01', deviceNo: 'DJI-2024-004', lastUpdate: '2024-06-15' },
    { id: '5', name: '无人机-005', type: '航拍无人机', status: '离线', location: '深圳市南山区', createTime: '2024-02-15', deviceNo: 'DJI-2024-005', lastUpdate: '2024-06-10' },
    { id: '6', name: '无人机-006', type: '测绘无人机', status: '在线', location: '杭州市西湖区', createTime: '2024-03-01', deviceNo: 'DJI-2024-006', lastUpdate: '2024-06-15' }
  ])

  const deviceReports = ref<DeviceReport[]>([
    { id: '1', deviceId: '1', deviceName: '无人机-001', flightHours: 156, taskCount: 24, completionRate: 87.5, batteryHealth: 92, maintenanceTimes: 3, month: '2024-06' },
    { id: '2', deviceId: '2', deviceName: '无人机-002', flightHours: 98, taskCount: 18, completionRate: 82.3, batteryHealth: 85, maintenanceTimes: 5, month: '2024-06' },
    { id: '3', deviceId: '3', deviceName: '无人机-003', flightHours: 234, taskCount: 32, completionRate: 91.2, batteryHealth: 88, maintenanceTimes: 2, month: '2024-06' },
    { id: '4', deviceId: '4', deviceName: '无人机-004', flightHours: 178, taskCount: 28, completionRate: 85.6, batteryHealth: 94, maintenanceTimes: 1, month: '2024-06' },
    { id: '5', deviceId: '5', deviceName: '无人机-005', flightHours: 67, taskCount: 12, completionRate: 78.9, batteryHealth: 76, maintenanceTimes: 6, month: '2024-06' },
    { id: '6', deviceId: '6', deviceName: '无人机-006', flightHours: 145, taskCount: 20, completionRate: 89.1, batteryHealth: 90, maintenanceTimes: 2, month: '2024-06' }
  ])

  const addDevice = (device: Omit<Device, 'id' | 'createTime' | 'lastUpdate'>) => {
    const newDevice: Device = {
      ...device,
      id: String(Date.now()),
      createTime: new Date().toISOString().split('T')[0],
      lastUpdate: new Date().toISOString().split('T')[0],
      deviceNo: `DJI-${new Date().getFullYear()}-${String(devices.value.length + 1).padStart(3, '0')}`,
      status: '离线'
    }
    devices.value.unshift(newDevice)

    const newReport: DeviceReport = {
      id: String(Date.now()),
      deviceId: newDevice.id,
      deviceName: newDevice.name,
      flightHours: 0,
      taskCount: 0,
      completionRate: 0,
      batteryHealth: 100,
      maintenanceTimes: 0,
      month: new Date().toISOString().split('T')[0].slice(0, 7)
    }
    deviceReports.value.push(newReport)
  }

  const removeDevice = (id: string) => {
    const index = devices.value.findIndex(d => d.id === id)
    if (index !== -1) {
      devices.value.splice(index, 1)
    }
    const reportIndex = deviceReports.value.findIndex(r => r.deviceId === id)
    if (reportIndex !== -1) {
      deviceReports.value.splice(reportIndex, 1)
    }
  }

  const getDeviceById = (id: string) => {
    return devices.value.find(d => d.id === id)
  }

  const getReportByDeviceId = (deviceId: string) => {
    return deviceReports.value.find(r => r.deviceId === deviceId)
  }

  const onlineCount = computed(() => devices.value.filter(d => d.status === '在线').length)
  const offlineCount = computed(() => devices.value.filter(d => d.status === '离线').length)
  const totalCount = computed(() => devices.value.length)
  const typeStats = computed(() => {
    const stats: Record<string, number> = {}
    devices.value.forEach(d => {
      stats[d.type] = (stats[d.type] || 0) + 1
    })
    return stats
  })

  return {
    devices,
    deviceReports,
    addDevice,
    removeDevice,
    getDeviceById,
    getReportByDeviceId,
    onlineCount,
    offlineCount,
    totalCount,
    typeStats
  }
})