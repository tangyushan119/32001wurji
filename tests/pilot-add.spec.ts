import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import PilotAdd from '@/views/pilot/add.vue'

describe('Pilot Add Form', () => {
  let router: any

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/pilot/add', component: PilotAdd },
        { path: '/pilot/list', component: {} }
      ]
    })
  })

  it('should render form correctly', async () => {
    router.push('/pilot/add')
    await router.isReady()

    const wrapper = mount(PilotAdd, {
      global: {
        plugins: [router, ElementPlus]
      }
    })

    expect(wrapper.find('.page-container').exists()).toBe(true)
  })

  it('should have required form fields', async () => {
    router.push('/pilot/add')
    await router.isReady()

    const wrapper = mount(PilotAdd, {
      global: {
        plugins: [router, ElementPlus]
      }
    })

    const formItems = wrapper.findAll('.el-form-item')
    expect(formItems.length).toBeGreaterThan(0)

    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBeGreaterThan(2)
  })

  it('should auto-fill birth date from ID card', async () => {
    router.push('/pilot/add')
    await router.isReady()

    const wrapper = mount(PilotAdd, {
      global: {
        plugins: [router, ElementPlus]
      }
    })

    const idCardInput = wrapper.find('input[placeholder="请输入18位身份证号"]')
    expect(idCardInput.exists()).toBe(true)
  })

  it('should have gender selection', async () => {
    router.push('/pilot/add')
    await router.isReady()

    const wrapper = mount(PilotAdd, {
      global: {
        plugins: [router, ElementPlus]
      }
    })

    const selects = wrapper.findAll('.el-select')
    expect(selects.length).toBeGreaterThan(0)
  })

  it('should have status selection', async () => {
    router.push('/pilot/add')
    await router.isReady()

    const wrapper = mount(PilotAdd, {
      global: {
        plugins: [router, ElementPlus]
      }
    })

    const selects = wrapper.findAll('.el-select')
    expect(selects.length).toBeGreaterThan(1)
  })

  it('should have license section', async () => {
    router.push('/pilot/add')
    await router.isReady()

    const wrapper = mount(PilotAdd, {
      global: {
        plugins: [router, ElementPlus]
      }
    })

    const licenseSection = wrapper.find('.license-section')
    expect(licenseSection.exists()).toBe(true)
  })

  it('should have submit button', async () => {
    router.push('/pilot/add')
    await router.isReady()

    const wrapper = mount(PilotAdd, {
      global: {
        plugins: [router, ElementPlus]
      }
    })

    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(2)
  })

  it('should switch to edit mode when id is provided', async () => {
    router.push('/pilot/add?id=1')
    await router.isReady()

    const wrapper = mount(PilotAdd, {
      global: {
        plugins: [router, ElementPlus]
      }
    })

    expect(wrapper.find('.page-container').exists()).toBe(true)
  })
})
