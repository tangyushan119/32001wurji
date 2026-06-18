<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑飞手' : '新增飞手' }}</span>
          <el-button @click="handleBack">返回列表</el-button>
        </div>
      </template>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-divider content-position="left">基本信息</el-divider>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formData.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="formData.gender" placeholder="请选择性别">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="formData.idCard" placeholder="请输入18位身份证号" @blur="handleIdCardBlur" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出生年月" prop="birthDate">
              <el-date-picker
                v-model="formData.birthDate"
                type="month"
                placeholder="请选择出生年月"
                value-format="YYYY-MM"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职时间" prop="entryDate">
              <el-date-picker
                v-model="formData.entryDate"
                type="date"
                placeholder="请选择入职时间"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态">
            <el-option label="在职" value="在职" />
            <el-option label="离职" value="离职" />
          </el-select>
        </el-form-item>
        
        <el-divider content-position="left">持证信息</el-divider>
        
        <div class="license-section">
          <el-table :data="formData.licenses" style="width: 100%" size="small">
            <el-table-column prop="name" label="证照名称" width="180">
              <template #default="{ row }">
                <el-input v-model="row.name" placeholder="证照名称" size="small" />
              </template>
            </el-table-column>
            <el-table-column prop="no" label="证照编号" width="150">
              <template #default="{ row }">
                <el-input v-model="row.no" placeholder="证照编号" size="small" />
              </template>
            </el-table-column>
            <el-table-column prop="issueDate" label="发证日期" width="120">
              <template #default="{ row }">
                <el-date-picker
                  v-model="row.issueDate"
                  type="date"
                  placeholder="发证日期"
                  value-format="YYYY-MM-DD"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column prop="expireDate" label="到期日期" width="120">
              <template #default="{ row }">
                <el-date-picker
                  v-model="row.expireDate"
                  type="date"
                  placeholder="到期日期"
                  value-format="YYYY-MM-DD"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-select v-model="row.status" placeholder="状态" size="small">
                  <el-option label="有效" value="有效" />
                  <el-option label="已过期" value="已过期" />
                  <el-option label="待审核" value="待审核" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template #default="{ $index }">
                <el-button size="small" type="danger" @click="removeLicense($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" size="small" @click="addLicense" style="margin-top: 10px">
            添加证照
          </el-button>
        </div>
        
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="handleBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { usePilotStore } from '@/stores/pilot'
import type { LicenseInfo } from '@/stores/pilot'

const router = useRouter()
const route = useRoute()
const pilotStore = usePilotStore()

const formRef = ref<FormInstance>()
const isEdit = ref(false)
const editId = ref('')

const formData = reactive({
  name: '',
  gender: '',
  idCard: '',
  phone: '',
  birthDate: '',
  entryDate: '',
  status: '在职',
  licenses: [] as LicenseInfo[]
})

const validateIdCard = (_: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入身份证号'))
    return
  }
  
  const idCardReg = /^\d{17}[\dXx]$/
  if (!idCardReg.test(value)) {
    callback(new Error('请输入18位身份证号'))
    return
  }
  
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  
  let sum = 0
  for (let i = 0; i < 17; i++) {
    sum += parseInt(value[i]) * weights[i]
  }
  
  const checkCode = checkCodes[sum % 11]
  if (value[17].toUpperCase() !== checkCode) {
    callback(new Error('身份证号校验码错误，请检查输入'))
    return
  }
  
  const year = parseInt(value.substring(6, 10))
  const month = parseInt(value.substring(10, 12))
  const day = parseInt(value.substring(12, 14))
  
  if (year < 1900 || year > new Date().getFullYear()) {
    callback(new Error('身份证号年份无效'))
    return
  }
  
  if (month < 1 || month > 12) {
    callback(new Error('身份证号月份无效'))
    return
  }
  
  if (day < 1 || day > 31) {
    callback(new Error('身份证号日期无效'))
    return
  }
  
  callback()
}

const validateName = (_: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入姓名'))
    return
  }
  
  if (value.length < 1 || value.length > 50) {
    callback(new Error('姓名长度在1-50个字符'))
    return
  }
  
  const nameReg = /^[\u4e00-\u9fa5a-zA-Z]+$/
  if (!nameReg.test(value)) {
    callback(new Error('姓名只能包含中文或英文'))
    return
  }
  
  callback()
}

const rules: FormRules = {
  name: [
    { validator: validateName, trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  idCard: [
    { validator: validateIdCard, trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  birthDate: [
    { required: true, message: '请选择出生年月', trigger: 'change' }
  ],
  entryDate: [
    { required: true, message: '请选择入职时间', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

const handleIdCardBlur = () => {
  const idCard = formData.idCard
  if (idCard.length === 18) {
    const year = idCard.substring(6, 10)
    const month = idCard.substring(10, 12)
    const birthDate = `${year}-${month}`
    if (!formData.birthDate) {
      formData.birthDate = birthDate
    }
  }
}

const addLicense = () => {
  formData.licenses.push({
    id: String(Date.now()),
    name: '',
    no: '',
    issueDate: '',
    expireDate: '',
    status: '有效'
  })
}

const removeLicense = (index: number) => {
  formData.licenses.splice(index, 1)
}

const handleSubmit = async () => {
  if (!formRef.value) {
    await ElMessageBox.alert('表单初始化失败，请刷新页面重试', '错误', {
      type: 'error',
      confirmButtonText: '确定'
    })
    return
  }
  
  try {
    await formRef.value.validate()
  } catch (error: any) {
    const errorMessages = error.map((e: any) => e.message).join('\\n')
    await ElMessageBox.alert(errorMessages, '表单校验失败', {
      type: 'error',
      confirmButtonText: '确定'
    })
    return
  }
  
  const filteredLicenses = formData.licenses.filter(l => l.name || l.no)
  
  try {
    if (isEdit.value) {
      pilotStore.updatePilot(editId.value, {
        ...formData,
        licenses: filteredLicenses
      })
      ElMessage.success('飞手信息更新成功')
    } else {
      pilotStore.addPilot({
        ...formData,
        licenses: filteredLicenses
      })
      ElMessage.success('飞手添加成功')
    }
    
    router.push('/pilot/list')
  } catch (error: any) {
    await ElMessageBox.alert(error.message || '操作失败，请重试', '错误', {
      type: 'error',
      confirmButtonText: '确定'
    })
  }
}

const handleReset = () => {
  formData.name = ''
  formData.gender = ''
  formData.idCard = ''
  formData.phone = ''
  formData.birthDate = ''
  formData.entryDate = ''
  formData.status = '在职'
  formData.licenses = []
  formRef.value?.resetFields()
}

const handleBack = () => {
  router.push('/pilot/list')
}

onMounted(() => {
  const id = route.query.id as string
  if (id) {
    isEdit.value = true
    editId.value = id
    const pilot = pilotStore.getPilotById(id)
    if (pilot) {
      formData.name = pilot.name
      formData.gender = pilot.gender
      formData.idCard = pilot.idCard
      formData.phone = pilot.phone
      formData.birthDate = pilot.birthDate
      formData.entryDate = pilot.entryDate
      formData.status = pilot.status
      formData.licenses = JSON.parse(JSON.stringify(pilot.licenses))
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

.license-section {
  background: #fafafa;
  padding: 15px;
  border-radius: 8px;
}
</style>
