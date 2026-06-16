<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>添加设备</span>
      </template>
      <el-form :model="formData" label-width="120px">
        <el-form-item label="设备名称">
          <el-input v-model="formData.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="formData.type" placeholder="请选择设备类型">
            <el-option label="航拍无人机" value="航拍无人机" />
            <el-option label="测绘无人机" value="测绘无人机" />
            <el-option label="巡检无人机" value="巡检无人机" />
          </el-select>
        </el-form-item>
        <el-form-item label="所在位置">
          <el-input v-model="formData.location" placeholder="请输入位置" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">提交</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const formData = reactive({
  name: '',
  type: '',
  location: ''
})
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
}
</style>
