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
            <el-option label="农业植保" value="农业植保" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="formData.startTime" type="datetime" placeholder="选择开始时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="formData.endTime" type="datetime" placeholder="选择结束时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="飞行区域" prop="flightArea">
          <el-input v-model="formData.flightArea" placeholder="请输入飞行区域" />
        </el-form-item>
        <el-form-item label="作业内容" prop="workContent">
          <el-input v-model="formData.workContent" type="textarea" :rows="4" placeholder="请输入作业内容" />
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
import { useTaskStore } from '@/stores/task'

const deviceStore = useDeviceStore()
const taskStore = useTaskStore()
const formRef = ref<FormInstance>()

const formData = reactive({
  name: '',
  device: '',
  type: '',
  startTime: null as Date | null,
  endTime: null as Date | null,
  flightArea: '',
  workContent: ''
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
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' },
    {
      validator: (_rule, value, callback) => {
        if (value && formData.startTime && new Date(value) < new Date(formData.startTime)) {
          callback(new Error('结束时间不能早于开始时间'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  flightArea: [
    { required: true, message: '请输入飞行区域', trigger: 'blur' }
  ],
  workContent: [
    { required: true, message: '请输入作业内容', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  
  taskStore.addTask({
    name: formData.name,
    deviceId: formData.device,
    type: formData.type,
    startTime: formData.startTime ? new Date(formData.startTime).toLocaleString('zh-CN') : '',
    endTime: formData.endTime ? new Date(formData.endTime).toLocaleString('zh-CN') : '',
    flightArea: formData.flightArea,
    workContent: formData.workContent
  })
  
  ElMessage.success('任务创建成功')
  handleReset()
}

const handleReset = () => {
  formData.name = ''
  formData.device = ''
  formData.type = ''
  formData.startTime = null
  formData.endTime = null
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