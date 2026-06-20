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
        path: 'drone/list',
        name: 'DroneList',
        component: () => import('@/views/device/list.vue'),
        meta: {
          title: '设备列表',
          topMenuKey: 'drone',
          icon: 'Monitor'
        }
      },
      {
        path: 'drone/detail',
        name: 'DroneDetail',
        component: () => import('@/views/device/detail.vue'),
        meta: {
          title: '设备详情',
          topMenuKey: 'drone',
          icon: 'Monitor'
        }
      },
      {
        path: 'drone/add',
        name: 'DroneAdd',
        component: () => import('@/views/device/add.vue'),
        meta: {
          title: '添加设备',
          topMenuKey: 'drone',
          icon: 'Plus'
        }
      },
      {
        path: 'drone/report',
        name: 'DroneReport',
        component: () => import('@/views/analytics/report.vue'),
        meta: {
          title: '数据报表',
          topMenuKey: 'drone',
          icon: 'Document'
        }
      },
      {
        path: 'drone/chart',
        name: 'DroneChart',
        component: () => import('@/views/analytics/chart.vue'),
        meta: {
          title: '数据图表',
          topMenuKey: 'drone',
          icon: 'TrendCharts'
        }
      },
      {
        path: 'maintenance/list',
        name: 'MaintenanceList',
        component: () => import('@/views/maintenance/list.vue'),
        meta: {
          title: '维保记录',
          topMenuKey: 'maintenance',
          icon: 'Wrench'
        }
      },
      {
        path: 'maintenance/add',
        name: 'MaintenanceAdd',
        component: () => import('@/views/maintenance/add.vue'),
        meta: {
          title: '新增/编辑维保',
          topMenuKey: 'maintenance',
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
        path: 'task/register',
        name: 'TaskRegister',
        component: () => import('@/views/task/register.vue'),
        meta: {
          title: '飞行任务登记',
          topMenuKey: 'task',
          icon: 'Plane'
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
        path: 'personnel/user',
        name: 'PersonnelUser',
        component: () => import('@/views/system/user.vue'),
        meta: {
          title: '用户管理',
          topMenuKey: 'personnel',
          icon: 'User'
        }
      },
      {
        path: 'personnel/role',
        name: 'PersonnelRole',
        component: () => import('@/views/system/role.vue'),
        meta: {
          title: '角色管理',
          topMenuKey: 'personnel',
          icon: 'UserFilled'
        }
      },
      {
        path: 'personnel/config',
        name: 'PersonnelConfig',
        component: () => import('@/views/system/config.vue'),
        meta: {
          title: '系统配置',
          topMenuKey: 'personnel',
          icon: 'Setting'
        }
      },
      {
        path: 'pilot/list',
        name: 'PilotList',
        component: () => import('@/views/pilot/list.vue'),
        meta: {
          title: '飞手人员',
          topMenuKey: 'personnel',
          icon: 'User'
        }
      },
      {
        path: 'pilot/add',
        name: 'PilotAdd',
        component: () => import('@/views/pilot/add.vue'),
        meta: {
          title: '新增/编辑飞手',
          topMenuKey: 'personnel',
          icon: 'Plus'
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
