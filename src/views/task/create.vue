<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>创建任务</span>
      </template>
      <el-form :model="formData" label-width="120px">
        <el-form-item label="任务名称">
          <el-input v-model="formData.name" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="关联设备">
          <el-select v-model="formData.device" placeholder="请选择设备">
            <el-option label="无人机-001" value="无人机-001" />
            <el-option label="无人机-002" value="无人机-002" />
            <el-option label="无人机-003" value="无人机-003" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select v-model="formData.type" placeholder="请选择任务类型">
            <el-option label="航拍" value="航拍" />
            <el-option label="测绘" value="测绘" />
            <el-option label="巡检" value="巡检" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行时间">
          <el-date-picker v-model="formData.date" type="datetime" placeholder="选择日期时间" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">创建任务</el-button>
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
  device: '',
  type: '',
  date: null
})
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
}
</style>
