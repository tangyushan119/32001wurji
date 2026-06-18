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
