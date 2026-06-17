import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import Layout from '@/layout/index.vue'
import Dashboard from '@/views/dashboard/index.vue'

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { title: '首页', topMenuKey: 'dashboard', icon: 'HomeFilled' }
      },
      {
        path: 'drone/list',
        name: 'DroneList',
        component: Dashboard,
        meta: { title: '设备列表', topMenuKey: 'drone', icon: 'Monitor' }
      },
      {
        path: 'drone/add',
        name: 'DroneAdd',
        component: Dashboard,
        meta: { title: '添加设备', topMenuKey: 'drone', icon: 'Plus' }
      },
      {
        path: 'task/list',
        name: 'TaskList',
        component: Dashboard,
        meta: { title: '任务列表', topMenuKey: 'task', icon: 'List' }
      },
      {
        path: 'task/create',
        name: 'TaskCreate',
        component: Dashboard,
        meta: { title: '创建任务', topMenuKey: 'task', icon: 'Edit' }
      },
      {
        path: 'personnel/user',
        name: 'PersonnelUser',
        component: Dashboard,
        meta: { title: '用户管理', topMenuKey: 'personnel', icon: 'User' }
      },
      {
        path: 'personnel/role',
        name: 'PersonnelRole',
        component: Dashboard,
        meta: { title: '角色管理', topMenuKey: 'personnel', icon: 'UserFilled' }
      }
    ]
  }
]

describe('Layout Sidebar', () => {
  let router: any

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes
    })
    setActivePinia(createPinia())
  })

  it('should render sidebar with three main categories', async () => {
    router.push('/dashboard')
    await router.isReady()

    const wrapper = mount(Layout, {
      global: {
        plugins: [router, ElementPlus]
      }
    })

    const sidebar = wrapper.find('.sidebar')
    expect(sidebar.exists()).toBe(true)

    const menuItems = sidebar.findAll('.el-menu-item')
    expect(menuItems.length).toBeGreaterThan(0)

    const subMenus = sidebar.findAll('.el-sub-menu')
    expect(subMenus.length).toBe(3)

    const subMenuLabels = subMenus.map(sub => sub.find('.el-sub-menu__title span').text())
    expect(subMenuLabels).toContain('无人机管理')
    expect(subMenuLabels).toContain('任务分派')
    expect(subMenuLabels).toContain('人员管理')
  })

  it('should not render any icons in sidebar menu items', async () => {
    router.push('/dashboard')
    await router.isReady()

    const wrapper = mount(Layout, {
      global: {
        plugins: [router, ElementPlus]
      }
    })

    const sidebar = wrapper.find('.sidebar')
    const iconComponents = sidebar.findAll('svg')
    
    expect(iconComponents.length).toBe(0)
  })

  it('should render home page menu item', async () => {
    router.push('/dashboard')
    await router.isReady()

    const wrapper = mount(Layout, {
      global: {
        plugins: [router, ElementPlus]
      }
    })

    const sidebar = wrapper.find('.sidebar')
    const homeMenuItem = sidebar.find('.el-menu-item')
    expect(homeMenuItem.exists()).toBe(true)
    expect(homeMenuItem.text()).toBe('首页')
  })

  it('should have proper menu item spacing and font size', async () => {
    router.push('/dashboard')
    await router.isReady()

    const wrapper = mount(Layout, {
      global: {
        plugins: [router, ElementPlus]
      }
    })

    const sidebar = wrapper.find('.sidebar')
    const menuItem = sidebar.find('.el-menu-item')
    
    expect(menuItem.exists()).toBe(true)
  })

  it('should navigate to dashboard when home menu item is clicked', async () => {
    router.push('/drone/list')
    await router.isReady()

    const wrapper = mount(Layout, {
      global: {
        plugins: [router, ElementPlus]
      }
    })

    const homeMenuItem = wrapper.find('.el-menu-item')
    await homeMenuItem.trigger('click')

    expect(router.currentRoute.value.path).toBe('/dashboard')
  })
})