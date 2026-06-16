<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>用户管理</span>
      </template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="用户名" />
        <el-table-column prop="role" label="角色" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-switch v-model="row.status" :active-value="true" :inactive-value="false" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { name: 'admin', role: '管理员', status: true, createTime: '2024-01-01' },
  { name: 'user001', role: '普通用户', status: true, createTime: '2024-02-15' },
  { name: 'user002', role: '普通用户', status: false, createTime: '2024-03-20' }
])
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
}
</style>
