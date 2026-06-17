<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>设备详情</span>
          <div class="header-actions">
            <el-button type="primary" @click="handleReport">查看报表</el-button>
            <el-button @click="handleBack">返回列表</el-button>
          </div>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="设备名称">{{ device?.name }}</el-descriptions-item>
        <el-descriptions-item label="设备类型">{{ device?.type }}</el-descriptions-item>
        <el-descriptions-item label="设备编号">{{ device?.deviceNo }}</el-descriptions-item>
        <el-descriptions-item label="当前状态">
          <el-tag :type="device?.status === '在线' ? 'success' : 'danger'">
            {{ device?.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="所在位置" :span="2">{{ device?.location }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ device?.createTime }}</el-descriptions-item>
        <el-descriptions-item label="最后更新">{{ device?.lastUpdate }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card style="margin-top: 20px" v-if="report">
      <template #header>
        <span>设备统计数据</span>
      </template>
      <div class="stats-grid">
        <div class="stat-card">
          <el-statistic title="飞行时长" :value="report.flightHours" suffix="小时" />
        </div>
        <div class="stat-card">
          <el-statistic title="任务数量" :value="report.taskCount" suffix="个" />
        </div>
        <div class="stat-card">
          <el-statistic title="任务完成率" :value="report.completionRate" suffix="%" />
        </div>
        <div class="stat-card">
          <el-statistic title="电池健康度" :value="report.batteryHealth" suffix="%" />
        </div>
        <div class="stat-card">
          <el-statistic title="维护次数" :value="report.maintenanceTimes" suffix="次" />
        </div>
      </div>
    </el-card>
    <el-card style="margin-top: 20px" v-if="report">
      <template #header>
        <span>数据可视化图表</span>
      </template>
      <div ref="chartRef" class="chart-container"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDeviceStore } from '@/stores/device'
import * as echarts from 'echarts'

const route = useRoute()
const router = useRouter()
const deviceStore = useDeviceStore()

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const deviceId = computed(() => (route.query.id as string) || '1')
const device = computed(() => deviceStore.getDeviceById(deviceId.value))
const report = computed(() => deviceStore.getReportByDeviceId(deviceId.value))

const handleBack = () => {
  router.push('/drone/list')
}

const handleReport = () => {
  router.push(`/drone/report?id=${deviceId.value}`)
}

const initChart = () => {
  if (!chartRef.value || !report.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['飞行时长', '任务数量', '完成率', '电池健康', '维护次数']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '设备数据',
        type: 'bar',
        data: [
          report.value.flightHours,
          report.value.taskCount,
          report.value.completionRate,
          report.value.batteryHealth,
          report.value.maintenanceTimes
        ],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ]),
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  }
  
  chartInstance.setOption(option)
}

const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
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

.header-actions {
  display: flex;
  gap: 10px;
}

.stats-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.stat-card {
  flex: 1;
  min-width: 150px;
  text-align: center;
}

.chart-container {
  height: 300px;
  width: 100%;
}
</style>