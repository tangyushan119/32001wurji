<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-icon">
        <component :is="DocumentDelete" />
      </div>
      <h1>404</h1>
      <p>页面不存在</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { DocumentDelete } from '@element-plus/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.error-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.error-content {
  text-align: center;
}

.error-icon {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 60px;
  color: #fff;
}

.error-content h1 {
  font-size: 72px;
  color: #333;
  margin: 0 0 16px;
}

.error-content p {
  font-size: 18px;
  color: #999;
  margin: 0 0 30px;
}
</style>
