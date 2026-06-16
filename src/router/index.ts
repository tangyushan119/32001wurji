import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '首页',
          topMenuKey: 'dashboard',
          icon: 'HomeFilled'
        }
      },
      {
        path: 'device/list',
        name: 'DeviceList',
        component: () => import('@/views/device/list.vue'),
        meta: {
          title: '设备列表',
          topMenuKey: 'device',
          icon: 'Monitor'
        }
      },
      {
        path: 'device/detail',
        name: 'DeviceDetail',
        component: () => import('@/views/device/detail.vue'),
        meta: {
          title: '设备详情',
          topMenuKey: 'device',
          icon: 'Monitor'
        }
      },
      {
        path: 'device/add',
        name: 'DeviceAdd',
        component: () => import('@/views/device/add.vue'),
        meta: {
          title: '添加设备',
          topMenuKey: 'device',
          icon: 'Plus'
        }
      },
      {
        path: 'task/list',
        name: 'TaskList',
        component: () => import('@/views/task/list.vue'),
        meta: {
          title: '任务列表',
          topMenuKey: 'task',
          icon: 'List'
        }
      },
      {
        path: 'task/create',
        name: 'TaskCreate',
        component: () => import('@/views/task/create.vue'),
        meta: {
          title: '创建任务',
          topMenuKey: 'task',
          icon: 'Edit'
        }
      },
      {
        path: 'task/history',
        name: 'TaskHistory',
        component: () => import('@/views/task/history.vue'),
        meta: {
          title: '历史任务',
          topMenuKey: 'task',
          icon: 'Clock'
        }
      },
      {
        path: 'analytics/report',
        name: 'AnalyticsReport',
        component: () => import('@/views/analytics/report.vue'),
        meta: {
          title: '数据报表',
          topMenuKey: 'analytics',
          icon: 'Document'
        }
      },
      {
        path: 'analytics/chart',
        name: 'AnalyticsChart',
        component: () => import('@/views/analytics/chart.vue'),
        meta: {
          title: '数据图表',
          topMenuKey: 'analytics',
          icon: 'TrendCharts'
        }
      },
      {
        path: 'system/user',
        name: 'SystemUser',
        component: () => import('@/views/system/user.vue'),
        meta: {
          title: '用户管理',
          topMenuKey: 'system',
          icon: 'User'
        }
      },
      {
        path: 'system/role',
        name: 'SystemRole',
        component: () => import('@/views/system/role.vue'),
        meta: {
          title: '角色管理',
          topMenuKey: 'system',
          icon: 'UserFilled'
        }
      },
      {
        path: 'system/config',
        name: 'SystemConfig',
        component: () => import('@/views/system/config.vue'),
        meta: {
          title: '系统配置',
          topMenuKey: 'system',
          icon: 'Setting'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  const token = userStore.token

  if (to.path === '/login') {
    if (token) {
      next('/')
    } else {
      next()
    }
  } else {
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
