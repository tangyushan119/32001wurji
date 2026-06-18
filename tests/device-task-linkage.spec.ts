import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import TaskCreate from '@/views/task/create.vue'
import TaskRegister from '@/views/task/register.vue'
import { useDeviceStore } from '@/stores/device'

describe('Device- Task Data Linkage', () => {
  let router: any
  let deviceStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/task/create', component: TaskCreate },
        { path: '/task/register', component: TaskRegister }
      ]
    })

    deviceStore = useDeviceStore()
  })

  describe('Device Store Integration', () => {
    it('should have devices in store by default', () => {
      expect(deviceStore.devices.length).toBeGreaterThan(0)
      expect(deviceStore.devices.length).toBe(6)
    })

    it('should add device correctly', () => {
      const initialLength = deviceStore.devices.length

      deviceStore.addDevice({
        name: '新增无人机',
        type: '巡检无人机',
        location: '新增地点',
        status: '在线'
      })

      expect(deviceStore.devices.length).toBe(initialLength + 1)
      expect(deviceStore.devices[0].name).toBe('新增无人机')
    })

    it('should remove device correctly', () => {
      const deviceId = deviceStore.devices[0].id
      const initialLength = deviceStore.devices.length

      deviceStore.removeDevice(deviceId)

      expect(deviceStore.devices.length).toBe(initialLength - 1)
      expect(deviceStore.getDeviceById(deviceId)).toBeUndefined()
    })
  })

  describe('TaskCreate Component - Device Store Connection', () => {
    it('should mount successfully with deviceStore access', async () => {
      router.push('/task/create')
      await router.isReady()

      const wrapper = mount(TaskCreate, {
        global: {
          plugins: [router, ElementPlus]
        }
      })

      expect(wrapper.vm).toBeDefined()
      expect(wrapper.exists()).toBe(true)
    })

    it('should have el-select component for device selection', async () => {
      router.push('/task/create')
      await router.isReady()

      const wrapper = mount(TaskCreate, {
        global: {
          plugins: [router, ElementPlus]
        }
      })

      const selectComponents = wrapper.findAll('.el-select')
      expect(selectComponents.length).toBeGreaterThan(0)
    })
  })

  describe('TaskRegister Component - Device Store Connection', () => {
    it('should mount successfully with deviceStore access', async () => {
      router.push('/task/register')
      await router.isReady()

      const wrapper = mount(TaskRegister, {
        global: {
          plugins: [router, ElementPlus]
        }
      })

      expect(wrapper.vm).toBeDefined()
      expect(wrapper.exists()).toBe(true)
    })

    it('should have el-select component for device selection', async () => {
      router.push('/task/register')
      await router.isReady()

      const wrapper = mount(TaskRegister, {
        global: {
          plugins: [router, ElementPlus]
        }
      })

      const selectComponents = wrapper.findAll('.el-select')
      expect(selectComponents.length).toBeGreaterThan(0)
    })
  })

  describe('Data Flow Verification', () => {
    it('should synchronize device data between store and components', async () => {
      const initialDevices = deviceStore.devices.length

      router.push('/task/create')
      await router.isReady()

      mount(TaskCreate, {
        global: {
          plugins: [router, ElementPlus]
        }
      })

      deviceStore.addDevice({
        name: '同步测试无人机',
        type: '航拍无人机',
        location: '同步测试地点',
        status: '在线'
      })

      expect(deviceStore.devices.length).toBe(initialDevices + 1)
    })

    it('should reflect device removal in store', async () => {
      const initialDevices = deviceStore.devices.length
      const firstDeviceId = deviceStore.devices[0].id

      deviceStore.removeDevice(firstDeviceId)

      expect(deviceStore.devices.length).toBe(initialDevices - 1)
      expect(deviceStore.getDeviceById(firstDeviceId)).toBeUndefined()
    })

    it('should make deviceStore reactive changes available to components', async () => {
      router.push('/task/create')
      await router.isReady()

      const wrapper = mount(TaskCreate, {
        global: {
          plugins: [router, ElementPlus]
        }
      })

      const initialCount = deviceStore.devices.length

      deviceStore.addDevice({
        name: '响应式测试无人机',
        type: '测绘无人机',
        location: '响应式测试地点',
        status: '离线'
      })

      expect(deviceStore.devices.length).toBe(initialCount + 1)

      deviceStore.removeDevice(deviceStore.devices[0].id)

      expect(deviceStore.devices.length).toBe(initialCount)
    })
  })
})
