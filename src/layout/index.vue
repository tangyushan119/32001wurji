<template>
  <div class="layout-container">
    <aside class="sidebar" :class="{ 'collapsed': isCollapsed }">
      <div class="sidebar-logo">
        <span class="logo-icon">
          <Place />
        </span>
        <span v-if="!isCollapsed" class="logo-text">无人机管理系统</span>
      </div>
      <div class="sidebar-menu">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapsed"
          background-color="#001529"
          text-color="#bfcbd9"
          active-text-color="#409eff"
        >
          <el-menu-item index="/dashboard">
            <component :is="HomeFilled" />
            <span>首页</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="sidebar-toggle" @click="isCollapsed = !isCollapsed">
        <component :is="isCollapsed ? Expand : Fold" />
      </div>
    </aside>
    <header class="header">
      <div class="header-left">
        <component :is="Menu" @click="toggleSidebar" class="menu-btn" />
        <span class="header-title">{{ currentPageTitle }}</span>
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
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Place, HomeFilled, Menu, Expand, Fold, User, ArrowDown } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isCollapsed = ref(false)

const activeMenu = computed(() => route.path)

const currentPageTitle = computed(() => {
  return route.meta.title || '首页'
})

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('退出成功')
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  background-color: #001529;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: relative;

  &.collapsed {
    width: 64px;
  }
}

.sidebar-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border-bottom: 1px solid #001529;
}

.logo-icon {
  font-size: 24px;
  color: #409eff;
}

.logo-text {
  margin-left: 12px;
  font-size: 16px;
  font-weight: bold;
}

.sidebar-menu {
  flex: 1;
  overflow-y: auto;
}

.sidebar-toggle {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background-color: #1890ff;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
}

.header {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
}

.menu-btn {
  font-size: 20px;
  margin-right: 16px;
  cursor: pointer;
  color: #666;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
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

.main {
  flex: 1;
  overflow-y: auto;
  background-color: #f5f7fa;
  padding: 20px;
}
</style>
