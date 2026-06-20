import request from '@/utils/request'

export const login = (data: { username: string; password: string }) => {
  return request.post('/api/login', data)
}

export const getUserInfo = () => {
  return request.get('/api/user/info')
}

export const logout = () => {
  return request.post('/api/logout')
}

export const registerFlightTask = (data: {
  device: string
  flightTime: Date | null
  flightArea: string
  workContent: string
}) => {
  return request.post('/api/task/register', data)
}

export const addMaintenance = (data: {
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
}) => {
  return request.post('/api/maintenance/add', data)
}

export const updateMaintenance = (id: string, data: {
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
}) => {
  return request.put(`/api/maintenance/${id}`, data)
}

export const deleteMaintenance = (id: string) => {
  return request.delete(`/api/maintenance/${id}`)
}

export const archiveMaintenance = (id: string) => {
  return request.post(`/api/maintenance/${id}/archive`)
}

export const unarchiveMaintenance = (id: string) => {
  return request.post(`/api/maintenance/${id}/unarchive`)
}

export const getMaintenances = (params?: {
  status?: string
  type?: string
  dateRange?: [string, string]
  keyword?: string
  archived?: boolean
}) => {
  return request.get('/api/maintenance/list', { params })
}

export const getMaintenanceById = (id: string) => {
  return request.get(`/api/maintenance/${id}`)
}
