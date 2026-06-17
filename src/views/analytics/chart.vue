<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>数据统计图表</span>
      </template>
      <div class="chart-section">
        <el-card class="chart-card">
          <template #header>
            <span>设备类型分布</span>
          </template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
        <el-card class="chart-card">
          <template #header>
            <span>设备状态统计</span>
          </template>
          <div ref="barChartRef" class="chart-container"></div>
        </el-card>
      </div>
      <div class="chart-section">
        <el-card class="chart-card full-width">
          <template #header>
            <span>设备飞行时长对比</span>
          </template>
          <div ref="lineChartRef" class="chart-container"></div>
        </el-card>
      </div>
      <div class="chart-section">
        <el-card class="chart-card">
          <template #header>
            <span>任务完成率分布</span>
          </template>
          <div ref="gaugeChartRef" class="chart-container"></div>
        </el-card>
        <el-card class="chart-card">
          <template #header>
            <span>电池健康度排行</span>
          </template>
          <div ref="radarChartRef" class="chart-container"></div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useDeviceStore } from '@/stores/device'
import * as echarts from 'echarts'

const deviceStore = useDeviceStore()

const pieChartRef = ref<HTMLDivElement>()
const barChartRef = ref<HTMLDivElement>()
const lineChartRef = ref<HTMLDivElement>()
const gaugeChartRef = ref<HTMLDivElement>()
const radarChartRef = ref<HTMLDivElement>()

let pieChart: echarts.ECharts | null = null
let barChart: echarts.ECharts | null = null
let lineChart: echarts.ECharts | null = null
let gaugeChart: echarts.ECharts | null = null
let radarChart: echarts.ECharts | null = null

const initPieChart = () => {
  if (!pieChartRef.value) return
  
  pieChart = echarts.init(pieChartRef.value)
  
  const typeStats = deviceStore.typeStats
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}台 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center'
    },
    series: [
      {
        name: '设备类型',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: Object.entries(typeStats).map(([name, value], index) => ({
          value,
          name,
          itemStyle: {
            color: ['#5470c6', '#91cc75', '#fac858', '#ee6666'][index % 4]
          }
        }))
      }
    ]
  }
  
  pieChart.setOption(option)
}

const initBarChart = () => {
  if (!barChartRef.value) return
  
  barChart = echarts.init(barChartRef.value)
  
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
      data: ['在线', '离线']
    },
    yAxis: {
      type: 'value',
      name: '设备数量'
    },
    color: ['#67c23a', '#f56c6c'],
    series: [
      {
        name: '设备状态',
        type: 'bar',
        data: [deviceStore.onlineCount, deviceStore.offlineCount],
        barWidth: '50%'
      }
    ]
  }
  
  barChart.setOption(option)
}

const initLineChart = () => {
  if (!lineChartRef.value) return
  
  lineChart = echarts.init(lineChartRef.value)
  
  const reports = deviceStore.deviceReports
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>{a}: {c}小时'
    },
    legend: {
      data: ['飞行时长'],
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
      data: reports.map(r => r.deviceName),
      axisLabel: {
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      name: '飞行时长(小时)'
    },
    series: [
      {
        name: '飞行时长',
        type: 'line',
        smooth: true,
        data: reports.map(r => r.flightHours),
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(84, 112, 198, 0.5)' },
            { offset: 1, color: 'rgba(84, 112, 198, 0.1)' }
          ])
        },
        itemStyle: {
          color: '#5470c6'
        }
      }
    ]
  }
  
  lineChart.setOption(option)
}

const initGaugeChart = () => {
  if (!gaugeChartRef.value) return
  
  gaugeChart = echarts.init(gaugeChartRef.value)
  
  const reports = deviceStore.deviceReports
  const avgCompletion = reports.reduce((sum, r) => sum + r.completionRate, 0) / reports.length
  
  const option: echarts.EChartsOption = {
    series: [
      {
        type: 'gauge',
        radius: '100%',
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#5470c6' },
                { offset: 1, color: '#91cc75' }
              ]
            }
          }
        },
        axisLine: {
          lineStyle: {
            width: 20,
            color: [[1, '#e8e8e8']]
          }
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        data: [
          {
            value: avgCompletion,
            detail: {
              offsetCenter: ['0%', '0%'],
              fontSize: 30,
              fontWeight: 'bold',
              color: '#333',
              formatter: '{value}%'
            }
          }
        ],
        title: {
          offsetCenter: ['0%', '30%'],
          fontSize: 14,
          color: '#999'
        }
      }
    ]
  }
  
  gaugeChart.setOption(option)
}

const initRadarChart = () => {
  if (!radarChartRef.value) return
  
  radarChart = echarts.init(radarChartRef.value)
  
  const reports = deviceStore.deviceReports.slice(0, 4)
  const option: echarts.EChartsOption = {
    tooltip: {},
    legend: {
      data: reports.map(r => r.deviceName),
      bottom: '0'
    },
    radar: {
      indicator: [
        { name: '飞行时长', max: 300 },
        { name: '任务数量', max: 40 },
        { name: '完成率', max: 100 },
        { name: '电池健康', max: 100 },
        { name: '维护次数', max: 10 }
      ],
      radius: '60%'
    },
    series: [
      {
        type: 'radar',
        data: reports.map((r, index) => ({
          value: [r.flightHours, r.taskCount, r.completionRate, r.batteryHealth, r.maintenanceTimes],
          name: r.deviceName,
          lineStyle: {
            color: ['#5470c6', '#91cc75', '#fac858', '#ee6666'][index]
          },
          areaStyle: {
            color: ['rgba(84, 112, 198, 0.2)', 'rgba(145, 204, 117, 0.2)', 'rgba(250, 200, 88, 0.2)', 'rgba(238, 102, 102, 0.2)'][index]
          },
          itemStyle: {
            color: ['#5470c6', '#91cc75', '#fac858', '#ee6666'][index]
          }
        }))
      }
    ]
  }
  
  radarChart.setOption(option)
}

const handleResize = () => {
  pieChart?.resize()
  barChart?.resize()
  lineChart?.resize()
  gaugeChart?.resize()
  radarChart?.resize()
}

onMounted(() => {
  initPieChart()
  initBarChart()
  initLineChart()
  initGaugeChart()
  initRadarChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  pieChart?.dispose()
  barChart?.dispose()
  lineChart?.dispose()
  gaugeChart?.dispose()
  radarChart?.dispose()
})
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
}

.chart-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  flex: 1;
  
  &.full-width {
    flex: 1 1 100%;
  }
}

.chart-container {
  height: 300px;
  width: 100%;
}
</style>