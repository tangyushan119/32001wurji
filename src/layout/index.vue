<template>
  <div class="layout-container">
    <header class="header">
      <div class="header-left">
        <span class="logo-icon">
          <Place />
        </span>
        <span class="logo-text">无人机管理系统</span>
      </div>
      <div class="header-right">
        <el-dropdown trigger="click">
          <span class="user-info">
            <component :is="User" />
            <span>管理员</span>
            <component :is="ArrowDown" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item @click.native="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    <div class="main-content">
      <aside class="sidebar">
        <div class="sidebar-menu">
          <el-menu
            :default-active="activeMenu"
            background-color="#001529"
            text-color="#bfcbd9"
            active-text-color="#409eff"
            @select="handleSidebarSelect"
          >
            <el-menu-item key="/dashboard" index="/dashboard">
              <component :is="HomeFilled" />
              <span>首页</span>
            </el-menu-item>
            <el-sub-menu v-for="category in menuCategories" :key="category.key" :index="category.key">
              <template #title>
                <component :is="category.icon" />
                <span>{{ category.label }}</span>
              </template>
              <el-menu-item v-for="item in getCategoryMenuItems(category.key)" :key="item.path" :index="item.path">
                <component :is="item.icon" />
                <span>{{ item.title }}</span>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </div>
      </aside>
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Place, User, ArrowDown, HomeFilled, Monitor, Plus, List, Edit,
  Clock, Document, TrendCharts, UserFilled, Setting
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const iconMap: Record<string, any> = {
  HomeFilled,
  Monitor,
  Plus,
  List,
  Edit,
  Clock,
  Document,
  TrendCharts,
  User,
  UserFilled,
  Setting
}

const menuCategories = [
  { key: 'drone', label: '无人机管理', icon: Monitor },
  { key: 'task', label: '任务分派', icon: List },
  { key: 'personnel', label: '人员管理', icon: UserFilled }
]

const activeMenu = computed(() => route.path)

const getCategoryMenuItems = (categoryKey: string) => {
  const layoutRoute = route.matched.find(r => r.name === 'Layout')
  if (!layoutRoute?.children) return []
  
  return layoutRoute.children
    .filter(child => {
      const topMenuKey = (child.meta as any)?.topMenuKey
      return topMenuKey === categoryKey
    })
    .map(child => ({
      path: '/' + child.path,
      title: (child.meta as any)?.title || '',
      icon: iconMap[(child.meta as any)?.icon] || List
    }))
}

const handleSidebarSelect = (index: string) => {
  router.push(index)
}

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('退出成功')
  router.push('/login')
}

watch(() => route.path, () => {}, { immediate: true })
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.header {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  padding: 0 20px;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  width: 200px;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 24px;
  color: #409eff;
}

.logo-text {
  margin-left: 12px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
  width: 150px;
  justify-content: flex-end;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #666;
}

.user-info span {
  margin-left: 8px;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background-color: #001529;
  color: #fff;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.sidebar-menu {
  flex: 1;
  overflow-y: auto;
}

.sidebar-menu :deep(.el-menu-item) {
  height: 56px;
  line-height: 56px;
  padding-left: 20px;
}

.sidebar-menu :deep(.el-menu-item span) {
  font-size: 14px;
}

.sidebar-menu :deep(.el-sub-menu .el-menu-item) {
  padding-left: 50px;
}

.content {
  flex: 1;
  overflow-y: auto;
  background-color: #f5f7fa;
  padding: 20px;
}
</style>
