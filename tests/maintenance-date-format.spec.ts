import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { date } from '@/utils/date'
import { useMaintenanceStore } from '@/stores/maintenance'

describe('维保日期格式化测试', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('date.format 函数测试', () => {
    it('应正确格式化完整日期时间', () => {
      const testDate = new Date('2024-06-15T10:30:45')
      const result = date.format(testDate, 'yyyy-MM-dd HH:mm:ss')
      expect(result).toBe('2024-06-15 10:30:45')
    })

    it('应正确格式化仅日期', () => {
      const testDate = new Date('2024-06-15T10:30:45')
      const result = date.format(testDate, 'yyyy-MM-dd')
      expect(result).toBe('2024-06-15')
    })

    it('应正确处理字符串输入', () => {
      const result = date.format('2024-06-15T10:30:45', 'yyyy-MM-dd')
      expect(result).toBe('2024-06-15')
    })

    it('应正确处理单个数字月份和日期的补零', () => {
      const testDate = new Date(2024, 0, 5, 9, 3, 7)
      const result = date.format(testDate, 'yyyy-MM-dd HH:mm:ss')
      expect(result).toBe('2024-01-05 09:03:07')
    })

    it('应正确处理默认格式', () => {
      const testDate = new Date('2024-06-15T10:30:45')
      const result = date.format(testDate)
      expect(result).toBe('2024-06-15 10:30:45')
    })

    it('应正确处理维保日期格式', () => {
      const testDate = new Date('2024-06-01')
      const result = date.format(testDate, 'yyyy-MM-dd')
      expect(result).toBe('2024-06-01')
    })

    it('应正确处理下次维保日期格式', () => {
      const testDate = new Date('2024-07-01')
      const result = date.format(testDate, 'yyyy-MM-dd')
      expect(result).toBe('2024-07-01')
    })

    it('应处理无效日期返回空字符串', () => {
      const result = date.format('invalid-date', 'yyyy-MM-dd')
      expect(result).toBe('')
    })
  })

  describe('maintenance store 日期测试', () => {
    it('新增维保记录应使用统一日期格式', () => {
      const store = useMaintenanceStore()
      const initialCount = store.totalCount
      
      store.addMaintenance({
        deviceId: '1',
        deviceName: '测试设备',
        deviceNo: 'TEST-001',
        maintenanceType: '定期保养',
        maintenanceDate: '2024-06-20',
        maintenanceContent: '测试维保内容',
        maintenancePerson: '测试人员',
        maintenanceResult: '正常',
        nextMaintenanceDate: '2024-07-20',
        status: '已完成'
      })
      
      expect(store.totalCount).toBe(initialCount + 1)
      
      const newRecord = store.activeMaintenances[0]
      expect(newRecord.maintenanceDate).toBe('2024-06-20')
      expect(newRecord.nextMaintenanceDate).toBe('2024-07-20')
      expect(newRecord.createTime).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
      expect(newRecord.updateTime).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    })

    it('更新维保记录应更新 updateTime', () => {
      const store = useMaintenanceStore()
      const record = store.activeMaintenances[0]
      const originalUpdateTime = record.updateTime
      
      store.updateMaintenance(record.id, {
        maintenancePerson: '更新人员'
      })
      
      const updatedRecord = store.getMaintenanceById(record.id)
      expect(updatedRecord?.maintenancePerson).toBe('更新人员')
      expect(updatedRecord?.updateTime).not.toBe(originalUpdateTime)
      expect(updatedRecord?.updateTime).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    })

    it('归档和取消归档应更新 updateTime', () => {
      const store = useMaintenanceStore()
      const record = store.activeMaintenances[0]
      const originalUpdateTime = record.updateTime
      
      store.archiveMaintenance(record.id)
      let updatedRecord = store.getMaintenanceById(record.id)
      expect(updatedRecord?.archived).toBe(true)
      expect(updatedRecord?.updateTime).not.toBe(originalUpdateTime)
      
      store.unarchiveMaintenance(record.id)
      updatedRecord = store.getMaintenanceById(record.id)
      expect(updatedRecord?.archived).toBe(false)
      expect(updatedRecord?.updateTime).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    })

    it('示例数据日期格式应符合标准', () => {
      const store = useMaintenanceStore()
      
      store.maintenances.forEach(record => {
        expect(record.maintenanceDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
        expect(record.nextMaintenanceDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
        expect(record.createTime).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
        expect(record.updateTime).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
      })
    })
  })

  describe('date.parse 函数测试', () => {
    it('应正确解析日期字符串', () => {
      const result = date.parse('2024-06-15')
      expect(result).toBeInstanceOf(Date)
      expect(result?.getFullYear()).toBe(2024)
      expect(result?.getMonth()).toBe(5)
      expect(result?.getDate()).toBe(15)
    })

    it('应正确解析日期时间字符串', () => {
      const result = date.parse('2024-06-15 10:30:45')
      expect(result).toBeInstanceOf(Date)
      expect(result?.getHours()).toBe(10)
      expect(result?.getMinutes()).toBe(30)
      expect(result?.getSeconds()).toBe(45)
    })

    it('应在解析失败时返回 null', () => {
      const result = date.parse('invalid-date')
      expect(result).toBeNull()
    })
  })

  describe('date.now 函数测试', () => {
    it('应返回当前时间的标准格式', () => {
      const result = date.now()
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    })
  })

  describe('date.diff 函数测试', () => {
    it('应正确计算两个日期的时间差', () => {
      const date1 = new Date('2024-06-01')
      const date2 = new Date('2024-06-02')
      const diff = date.diff(date1, date2)
      expect(diff).toBe(86400000)
    })

    it('应正确处理字符串输入', () => {
      const diff = date.diff('2024-06-01', '2024-06-02')
      expect(diff).toBe(86400000)
    })
  })
})
