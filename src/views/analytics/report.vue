<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isSingleDevice ? `${device?.name} - 详情报表` : '数据报表' }}</span>
          <el-button @click="handleBack">返回列表</el-button>
        </div>
      </template>
      <div class="report-content">
        <el-statistic title="总设备数" :value="deviceStore.totalCount" suffix="台" />
        <el-statistic title="在线设备" :value="deviceStore.onlineCount" suffix="台" />
        <el-statistic title="任务总数" :value="totalTasks" suffix="个" />
        <el-statistic title="平均完成率" :value="avgCompletionRate" suffix="%" />
      </div>
    </el-card>
    <el-card style="margin-top: 20px">
      <template #header>
        <span>设备统计列表</span>
      </template>
      <el-table :data="filteredReports" style="width: 100%">
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="flightHours" label="飞行时长(h)" />
        <el-table-column prop="taskCount" label="任务数量" />
        <el-table-column prop="completionRate" label="完成率(%)" />
        <el-table-column prop="batteryHealth" label="电池健康度(%)">
          <template #default="{ row }">
            <el-progress :percentage="row.batteryHealth" :color="getBatteryColor(row.batteryHealth)" :stroke-width="10" />
          </template>
        </el-table-column>
        <el-table-column prop="maintenanceTimes" label="维护次数" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button size="small" @click="handleViewDetail(row.deviceId)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card style="margin-top: 20px" v-if="isSingleDevice && report">
      <template #header>
        <span>设备数据图表</span>
      </template>
      <div ref="chartRef" class="chart-container"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDeviceStore } from '@/stores/device'
import * as echarts from 'echarts'

const route = useRoute()
const router = useRouter()
const deviceStore = useDeviceStore()

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const deviceId = computed(() => route.query.id as string | undefined)
const isSingleDevice = computed(() => !!deviceId.value)
const device = computed(() => deviceId.value ? deviceStore.getDeviceById(deviceId.value) : null)
const report = computed(() => deviceId.value ? deviceStore.getReportByDeviceId(deviceId.value) : null)

const filteredReports = computed(() => {
  if (isSingleDevice.value && report.value) {
    return [report.value]
  }
  return deviceStore.deviceReports
})

const totalTasks = computed(() => deviceStore.deviceReports.reduce((sum, r) => sum + r.taskCount, 0))
const avgCompletionRate = computed(() => {
  const reports = deviceStore.deviceReports
  if (reports.length === 0) return 0
  return Math.round(reports.reduce((sum, r) => sum + r.completionRate, 0) / reports.length * 10) / 10
})

const getBatteryColor = (percentage: number) => {
  if (percentage >= 80) return '#67c23a'
  if (percentage >= 50) return '#e6a23c'
  return '#f56c6c'
}

const handleBack = () => {
  if (isSingleDevice.value) {
    router.push('/drone/report')
  } else {
    router.push('/drone/list')
  }
}

const handleViewDetail = (id: string) => {
  router.push(`/drone/detail?id=${id}`)
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
    legend: {
      data: ['数值'],
      bottom: '0'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['飞行时长', '任务数量', '完成率', '电池健康', '维护次数']
    },
    yAxis: {
      type: 'value'
    },
    color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
    series: [
      {
        name: '数值',
        type: 'bar',
        data: [
          report.value.flightHours,
          report.value.taskCount,
          report.value.completionRate,
          report.value.batteryHealth,
          report.value.maintenanceTimes
        ],
        itemStyle: {
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
  if (isSingleDevice.value) {
    initChart()
    window.addEventListener('resize', handleResize)
  }
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

.report-content {
  display: flex;
  justify-content: space-around;
}

.chart-container {
  height: 350px;
  width: 100%;
}
</style>