<template>
  <div class="dashboard">
    <el-card class="welcome-card">
      <div class="welcome-content">
        <div class="welcome-text">
          <h2>欢迎回来，管理员</h2>
          <p>今天是 {{ currentDate }}</p>
        </div>
        <div class="welcome-icon">
          <component :is="Compass" />
        </div>
      </div>
    </el-card>
    <div class="stats-row">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon blue">
            <component :is="Place" />
          </div>
          <div class="stat-info">
            <div class="stat-value">12</div>
            <div class="stat-label">无人机总数</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon green">
            <component :is="VideoPlay" />
          </div>
          <div class="stat-info">
            <div class="stat-value">8</div>
            <div class="stat-label">在线设备</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon orange">
            <component :is="MapLocation" />
          </div>
          <div class="stat-info">
            <div class="stat-value">24</div>
            <div class="stat-label">任务总数</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon purple">
            <component :is="TrendCharts" />
          </div>
          <div class="stat-info">
            <div class="stat-value">156</div>
            <div class="stat-label">飞行时长(h)</div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="content-row">
      <el-card class="left-card">
        <template #header>
          <span>飞行任务状态</span>
        </template>
        <div class="task-list">
          <div
            v-for="task in tasks"
            :key="task.id"
            class="task-item"
          >
            <div class="task-info">
              <div class="task-name">{{ task.name }}</div>
              <div class="task-time">{{ task.time }}</div>
            </div>
            <el-tag :type="getTagType(task.status)">{{ task.status }}</el-tag>
          </div>
        </div>
      </el-card>
      <el-card class="right-card">
        <template #header>
          <span>系统通知</span>
        </template>
        <div class="notification-list">
          <div
            v-for="notify in notifications"
            :key="notify.id"
            class="notification-item"
          >
            <component :is="notify.icon" class="notify-icon" />
            <div class="notify-content">
              <div class="notify-title">{{ notify.title }}</div>
              <div class="notify-desc">{{ notify.desc }}</div>
            </div>
            <div class="notify-time">{{ notify.time }}</div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Place,
  VideoPlay,
  MapLocation,
  TrendCharts,
  Compass,
  Bell,
  Warning,
  InfoFilled
} from '@element-plus/icons-vue'
import { date } from '@/utils/date'

const currentDate = computed(() => {
  return date.format(new Date(), 'yyyy年MM月dd日 HH:mm')
})

const tasks = [
  { id: 1, name: '农田巡查任务-A区', time: '2024-01-15 09:00', status: '进行中' },
  { id: 2, name: '城市测绘任务-B区', time: '2024-01-15 10:30', status: '待执行' },
  { id: 3, name: '电力巡检任务-C线', time: '2024-01-14 14:00', status: '已完成' },
  { id: 4, name: '森林防火监测', time: '2024-01-14 08:00', status: '已完成' }
]

const notifications = [
  { id: 1, icon: Bell, title: '无人机DJI-001电量低', desc: '当前电量剩余15%，请及时返航', time: '10分钟前' },
  { id: 2, icon: Warning, title: '任务超时警告', desc: '农田巡查任务超过预计时间', time: '30分钟前' },
  { id: 3, icon: InfoFilled, title: '系统升级通知', desc: '系统将于今晚22:00进行例行维护', time: '1小时前' }
]

const getTagType = (status: string) => {
  switch (status) {
    case '进行中':
      return 'warning'
    case '待执行':
      return 'info'
    case '已完成':
      return 'success'
    default:
      return 'default'
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  padding-bottom: 20px;
}

.welcome-card {
  margin-bottom: 20px;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-text h2 {
  font-size: 24px;
  color: #333;
  margin: 0 0 8px;
}

.welcome-text p {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.welcome-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: #fff;
}

.stats-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #fff;
  margin-right: 16px;

  &.blue {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &.green {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  }

  &.orange {
    background: linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%);
  }

  &.purple {
    background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
    color: #666;
  }
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}

.content-row {
  display: flex;
  gap: 20px;
}

.left-card,
.right-card {
  flex: 1;
}

.task-list {
  padding: 10px 0;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.task-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.task-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.notification-list {
  padding: 10px 0;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.notify-icon {
  font-size: 20px;
  color: #409eff;
  margin-right: 12px;
  flex-shrink: 0;
}

.notify-content {
  flex: 1;
}

.notify-title {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.notify-desc {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.notify-time {
  font-size: 12px;
  color: #bbb;
  flex-shrink: 0;
}
</style>
