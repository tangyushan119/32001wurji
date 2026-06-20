import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useDeviceStore } from './device'

export interface FlightTask {
  id: string
  name: string
  deviceId: string
  deviceName: string
  type: string
  status: '待执行' | '进行中' | '已完成' | '已归档'
  startTime: string
  endTime: string
  flightArea: string
  workContent: string
  createTime: string
  lastUpdate: string
  archiveTime?: string
}

export const useTaskStore = defineStore('task', () => {
  const deviceStore = useDeviceStore()
  const tasks = ref<FlightTask[]>([
    { id: '1', name: '航拍任务-A', deviceId: '1', deviceName: '无人机-001', type: '航拍', status: '进行中', startTime: '2024-06-15 09:00', endTime: '2024-06-15 12:00', flightArea: '北京市朝阳区', workContent: '城市航拍作业', createTime: '2024-06-14', lastUpdate: '2024-06-15' },
    { id: '2', name: '测绘任务-B', deviceId: '2', deviceName: '无人机-002', type: '测绘', status: '已完成', startTime: '2024-06-14 14:00', endTime: '2024-06-14 18:00', flightArea: '上海市浦东新区', workContent: '地形测绘作业', createTime: '2024-06-13', lastUpdate: '2024-06-14' },
    { id: '3', name: '巡检任务-C', deviceId: '3', deviceName: '无人机-003', type: '巡检', status: '待执行', startTime: '2024-06-16 10:00', endTime: '2024-06-16 14:00', flightArea: '广州市天河区', workContent: '电力巡检作业', createTime: '2024-06-15', lastUpdate: '2024-06-15' },
    { id: '4', name: '农业植保任务-D', deviceId: '4', deviceName: '无人机-004', type: '农业植保', status: '已归档', startTime: '2024-05-20 08:00', endTime: '2024-05-20 12:00', flightArea: '成都市武侯区', workContent: '农作物喷洒作业', createTime: '2024-05-19', lastUpdate: '2024-05-20', archiveTime: '2024-05-21' },
    { id: '5', name: '航拍任务-E', deviceId: '5', deviceName: '无人机-005', type: '航拍', status: '已归档', startTime: '2024-05-15 09:00', endTime: '2024-05-15 11:30', flightArea: '深圳市南山区', workContent: '景区航拍作业', createTime: '2024-05-14', lastUpdate: '2024-05-15', archiveTime: '2024-05-16' },
    { id: '6', name: '测绘任务-F', deviceId: '6', deviceName: '无人机-006', type: '测绘', status: '已归档', startTime: '2024-04-10 13:00', endTime: '2024-04-10 17:00', flightArea: '杭州市西湖区', workContent: '城市规划测绘', createTime: '2024-04-09', lastUpdate: '2024-04-10', archiveTime: '2024-04-11' }
  ])

  const addTask = (task: Omit<FlightTask, 'id' | 'createTime' | 'lastUpdate' | 'deviceName' | 'status'>) => {
    const device = deviceStore.getDeviceById(task.deviceId)
    const newTask: FlightTask = {
      ...task,
      id: String(Date.now()),
      deviceName: device?.name || task.deviceId,
      status: '待执行',
      createTime: new Date().toISOString().split('T')[0],
      lastUpdate: new Date().toISOString().split('T')[0]
    }
    tasks.value.unshift(newTask)
    return newTask
  }

  const updateTask = (id: string, task: Partial<FlightTask>) => {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks.value[index] = {
        ...tasks.value[index],
        ...task,
        lastUpdate: new Date().toISOString().split('T')[0]
      }
    }
  }

  const completeTask = (id: string) => {
    const task = tasks.value.find(t => t.id === id)
    if (task && task.status === '进行中') {
      task.status = '已完成'
      task.endTime = new Date().toLocaleString('zh-CN')
      task.lastUpdate = new Date().toISOString().split('T')[0]
    }
  }

  const archiveTask = (id: string) => {
    const task = tasks.value.find(t => t.id === id)
    if (task && task.status === '已完成') {
      task.status = '已归档'
      task.archiveTime = new Date().toISOString().split('T')[0]
      task.lastUpdate = new Date().toISOString().split('T')[0]
    }
  }

  const archiveTasks = (ids: string[]) => {
    ids.forEach(id => archiveTask(id))
  }

  const getTaskById = (id: string) => {
    return tasks.value.find(t => t.id === id)
  }

  const activeTasks = computed(() => tasks.value.filter(t => t.status !== '已归档'))
  const archivedTasks = computed(() => tasks.value.filter(t => t.status === '已归档'))

  const queryArchivedByDateRange = (startDate: string, endDate: string) => {
    return tasks.value.filter(task => {
      if (task.status !== '已归档' || !task.archiveTime) return false
      return task.archiveTime >= startDate && task.archiveTime <= endDate
    })
  }

  const queryByDateRange = (startDate: string, endDate: string) => {
    return tasks.value.filter(task => {
      return task.createTime >= startDate && task.createTime <= endDate
    })
  }

  const totalCount = computed(() => tasks.value.length)
  const activeCount = computed(() => activeTasks.value.length)
  const archivedCount = computed(() => archivedTasks.value.length)

  return {
    tasks,
    addTask,
    updateTask,
    completeTask,
    archiveTask,
    archiveTasks,
    getTaskById,
    activeTasks,
    archivedTasks,
    queryArchivedByDateRange,
    queryByDateRange,
    totalCount,
    activeCount,
    archivedCount
  }
})