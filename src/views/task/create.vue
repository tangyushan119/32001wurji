<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>创建任务</span>
      </template>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="关联设备" prop="device">
          <el-select v-model="formData.device" placeholder="请选择设备">
            <el-option v-for="device in deviceStore.devices" :key="device.id" :label="device.name" :value="device.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择任务类型">
            <el-option label="航拍" value="航拍" />
            <el-option label="测绘" value="测绘" />
            <el-option label="巡检" value="巡检" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行时间" prop="date">
          <el-date-picker v-model="formData.date" type="datetime" placeholder="选择日期时间" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">创建任务</el-button>
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
import { useDeviceStore } from '@/stores/device'

const deviceStore = useDeviceStore()
const formRef = ref<FormInstance>()

const formData = reactive({
  name: '',
  device: '',
  type: '',
  date: null as Date | null
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
    { min: 2, max: 50, message: '任务名称长度在2-50个字符', trigger: 'blur' }
  ],
  device: [
    { required: true, message: '请选择关联设备', trigger: 'change' }
  ],
  type: [
    { required: true, message: '请选择任务类型', trigger: 'change' }
  ],
  date: [
    { required: true, message: '请选择执行时间', trigger: 'change' },
    {
      validator: (_rule, value, callback) => {
        if (value && new Date(value) < new Date()) {
          callback(new Error('执行时间不能早于当前时间'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  ElMessage.success('任务创建成功')
  handleReset()
}

const handleReset = () => {
  formData.name = ''
  formData.device = ''
  formData.type = ''
  formData.date = null
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
}
</style>
