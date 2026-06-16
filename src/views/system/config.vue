<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>系统配置</span>
      </template>
      <el-form :model="config" label-width="150px">
        <el-form-item label="系统名称">
          <el-input v-model="config.systemName" />
        </el-form-item>
        <el-form-item label="系统版本">
          <el-input v-model="config.version" disabled />
        </el-form-item>
        <el-form-item label="主题颜色">
          <el-color-picker v-model="config.themeColor" />
        </el-form-item>
        <el-form-item label="自动刷新">
          <el-switch v-model="config.autoRefresh" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存配置</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const config = reactive({
  systemName: '无人机管理系统',
  version: '1.0.0',
  themeColor: '#409eff',
  autoRefresh: true
})
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
}
</style>
