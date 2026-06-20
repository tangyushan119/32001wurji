<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑维保记录' : '新增维保记录' }}</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="设备名称" prop="deviceId">
              <el-select v-model="form.deviceId" placeholder="请选择设备" @change="handleDeviceChange">
                <el-option v-for="device in devices" :key="device.id" :label="device.name" :value="device.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备编号" prop="deviceNo">
              <el-input v-model="form.deviceNo" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="维保类型" prop="maintenanceType">
              <el-select v-model="form.maintenanceType" placeholder="请选择维保类型">
                <el-option label="定期保养" value="定期保养" />
                <el-option label="故障维修" value="故障维修" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维保日期" prop="maintenanceDate">
              <el-date-picker v-model="form.maintenanceDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="维保人员" prop="maintenancePerson">
              <el-input v-model="form.maintenancePerson" placeholder="请输入维保人员" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维保结果" prop="maintenanceResult">
              <el-select v-model="form.maintenanceResult" placeholder="请选择维保结果">
                <el-option label="正常" value="正常" />
                <el-option label="异常" value="异常" />
                <el-option label="待复检" value="待复检" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="下次维保日期" prop="nextMaintenanceDate">
              <el-date-picker v-model="form.nextMaintenanceDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态">
                <el-option label="待处理" value="待处理" />
                <el-option label="进行中" value="进行中" />
                <el-option label="已完成" value="已完成" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="维保内容" prop="maintenanceContent">
          <el-input v-model="form.maintenanceContent" type="textarea" :rows="4" placeholder="请输入维保内容" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMaintenanceStore } from '@/stores/maintenance'
import { useDeviceStore } from '@/stores/device'
import { ElMessage } from 'element-plus'
import { date } from '@/utils/date'

const route = useRoute()
const router = useRouter()
const maintenanceStore = useMaintenanceStore()
const deviceStore = useDeviceStore()
const formRef = ref()

const devices = deviceStore.devices

const isEdit = ref(false)
const editId = ref('')

const form = reactive({
  deviceId: '',
  deviceName: '',
  deviceNo: '',
  maintenanceType: '',
  maintenanceDate: '',
  maintenanceContent: '',
  maintenancePerson: '',
  maintenanceResult: '',
  nextMaintenanceDate: '',
  status: ''
})

const rules = {
  deviceId: [{ required: true, message: '请选择设备', trigger: 'change' }],
  maintenanceType: [{ required: true, message: '请选择维保类型', trigger: 'change' }],
  maintenanceDate: [{ required: true, message: '请选择维保日期', trigger: 'change' }],
  maintenancePerson: [{ required: true, message: '请输入维保人员', trigger: 'blur' }],
  maintenanceContent: [{ required: true, message: '请输入维保内容', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const handleDeviceChange = (deviceId: string) => {
  const device = deviceStore.getDeviceById(deviceId)
  if (device) {
    form.deviceName = device.name
    form.deviceNo = device.deviceNo || ''
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (isEdit.value) {
      maintenanceStore.updateMaintenance(editId.value, {
        deviceId: form.deviceId,
        deviceName: form.deviceName,
        deviceNo: form.deviceNo,
        maintenanceType: form.maintenanceType,
        maintenanceDate: form.maintenanceDate,
        maintenanceContent: form.maintenanceContent,
        maintenancePerson: form.maintenancePerson,
        maintenanceResult: form.maintenanceResult,
        nextMaintenanceDate: form.nextMaintenanceDate,
        status: form.status
      })
      ElMessage.success('修改成功')
    } else {
      maintenanceStore.addMaintenance({
        deviceId: form.deviceId,
        deviceName: form.deviceName,
        deviceNo: form.deviceNo,
        maintenanceType: form.maintenanceType,
        maintenanceDate: form.maintenanceDate,
        maintenanceContent: form.maintenanceContent,
        maintenancePerson: form.maintenancePerson,
        maintenanceResult: form.maintenanceResult,
        nextMaintenanceDate: form.nextMaintenanceDate,
        status: form.status
      })
      ElMessage.success('新增成功')
    }
    
    router.push('/maintenance/list')
  } catch {
    ElMessage.error('请填写完整信息')
  }
}

const handleReset = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  form.deviceName = ''
  form.deviceNo = ''
}

const handleBack = () => {
  router.push('/maintenance/list')
}

onMounted(() => {
  const id = route.query.id as string
  if (id) {
    isEdit.value = true
    editId.value = id
    const maintenance = maintenanceStore.getMaintenanceById(id)
    if (maintenance) {
      form.deviceId = maintenance.deviceId
      form.deviceName = maintenance.deviceName
      form.deviceNo = maintenance.deviceNo
      form.maintenanceType = maintenance.maintenanceType
      form.maintenanceDate = maintenance.maintenanceDate
      form.maintenanceContent = maintenance.maintenanceContent
      form.maintenancePerson = maintenance.maintenancePerson
      form.maintenanceResult = maintenance.maintenanceResult
      form.nextMaintenanceDate = maintenance.nextMaintenanceDate
      form.status = maintenance.status
    }
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
