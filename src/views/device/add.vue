<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>添加设备</span>
      </template>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择设备类型">
            <el-option label="航拍无人机" value="航拍无人机" />
            <el-option label="测绘无人机" value="测绘无人机" />
            <el-option label="巡检无人机" value="巡检无人机" />
          </el-select>
        </el-form-item>
        <el-form-item label="所在位置" prop="location">
          <el-input v-model="formData.location" placeholder="请输入位置" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleReset">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const formRef = ref<FormInstance>()

const formData = reactive({
  name: '',
  type: '',
  location: ''
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入设备名称', trigger: 'blur' },
    { min: 2, max: 50, message: '设备名称长度在2-50个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择设备类型', trigger: 'change' }
  ],
  location: [
    { required: true, message: '请输入所在位置', trigger: 'blur' },
    { min: 2, max: 100, message: '位置长度在2-100个字符', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  ElMessage.success('设备添加成功')
  handleReset()
}

const handleReset = () => {
  formData.name = ''
  formData.type = ''
  formData.location = ''
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
}
</style>
