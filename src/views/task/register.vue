<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>飞行任务登记</span>
      </template>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="关联设备" prop="device">
          <el-select v-model="formData.device" placeholder="请选择设备">
            <el-option v-for="device in deviceStore.devices" :key="device.id" :label="device.name" :value="device.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="飞行时间" prop="flightTime">
          <el-date-picker
            v-model="formData.flightTime"
            type="datetime"
            placeholder="选择飞行日期时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="飞行区域" prop="flightArea">
          <el-input
            v-model="formData.flightArea"
            placeholder="请输入飞行区域"
          />
        </el-form-item>
        <el-form-item label="作业内容" prop="workContent">
          <el-input
            v-model="formData.workContent"
            type="textarea"
            :rows="4"
            placeholder="请输入作业内容"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">登记任务</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { registerFlightTask } from '@/api'
import { useDeviceStore } from '@/stores/device'

const deviceStore = useDeviceStore()
const formRef = ref<FormInstance>()

const formData = reactive({
  device: '',
  flightTime: null as Date | null,
  flightArea: '',
  workContent: ''
})

const rules: FormRules = {
  device: [
    { required: true, message: '请选择关联设备', trigger: 'change' }
  ],
  flightTime: [
    { required: true, message: '请选择飞行时间', trigger: 'change' },
    {
      validator: (_rule, value, callback) => {
        if (value && new Date(value) < new Date()) {
          callback(new Error('飞行时间不能早于当前时间'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  flightArea: [
    { required: true, message: '请输入飞行区域', trigger: 'blur' },
    { min: 2, max: 100, message: '飞行区域长度在2-100个字符', trigger: 'blur' }
  ],
  workContent: [
    { required: true, message: '请输入作业内容', trigger: 'blur' },
    { min: 5, max: 500, message: '作业内容长度在5-500个字符', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    await registerFlightTask({
      device: formData.device,
      flightTime: formData.flightTime,
      flightArea: formData.flightArea,
      workContent: formData.workContent
    })
    ElMessage.success('飞行任务登记成功')
    handleReset()
  } catch (error) {
    ElMessage.error('登记失败，请重试')
  }
}

const handleReset = () => {
  formData.device = ''
  formData.flightTime = null
  formData.flightArea = ''
  formData.workContent = ''
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
}
</style>
