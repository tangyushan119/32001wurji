<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>角色管理</span>
      </template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="description" label="角色描述" />
        <el-table-column prop="permissions" label="权限数量" />
        <el-table-column prop="users" label="用户数" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { name: '管理员', description: '系统最高权限', permissions: 20, users: 1 },
  { name: '操作员', description: '日常操作权限', permissions: 12, users: 5 },
  { name: '查看员', description: '仅查看权限', permissions: 5, users: 10 }
])
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
}
</style>
