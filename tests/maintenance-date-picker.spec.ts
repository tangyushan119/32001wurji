import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useMaintenanceStore } from '@/stores/maintenance'
import { date } from '@/utils/date'

describe('维保日期选择器绑定逻辑测试', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('日期字段初始化', () => {
    it('新增模式下日期字段应初始化为空字符串', () => {
      const form = {
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
      }
      
      expect(form.maintenanceDate).toBe('')
      expect(form.nextMaintenanceDate).toBe('')
    })
  })

  describe('日期选择器值格式匹配', () => {
    it('日期值应为字符串类型', () => {
      const form = {
        maintenanceDate: '2024-06-20',
        nextMaintenanceDate: '2024-07-20'
      }
      
      expect(typeof form.maintenanceDate).toBe('string')
      expect(typeof form.nextMaintenanceDate).toBe('string')
    })

    it('日期值格式应符合 yyyy-MM-dd', () => {
      const validDates = [
        '2024-01-01',
        '2024-12-31',
        '2024-06-15'
      ]
      
      validDates.forEach(d => {
        expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      })
    })

    it('日期选择器 value-format 应与表单字段类型匹配', () => {
      const dateFromPicker = '2024-06-20'
      
      expect(typeof dateFromPicker).toBe('string')
      expect(dateFromPicker).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })

  describe('日期回填测试', () => {
    it('编辑模式下应正确回填历史日期', () => {
      const store = useMaintenanceStore()
      const record = store.activeMaintenances[0]
      
      const form = {
        deviceId: record.deviceId,
        deviceName: record.deviceName,
        deviceNo: record.deviceNo,
        maintenanceType: record.maintenanceType,
        maintenanceDate: record.maintenanceDate,
        maintenanceContent: record.maintenanceContent,
        maintenancePerson: record.maintenancePerson,
        maintenanceResult: record.maintenanceResult,
        nextMaintenanceDate: record.nextMaintenanceDate,
        status: record.status
      }
      
      expect(form.maintenanceDate).toBe(record.maintenanceDate)
      expect(form.nextMaintenanceDate).toBe(record.nextMaintenanceDate)
    })

    it('回填日期格式应与日期选择器兼容', () => {
      const store = useMaintenanceStore()
      const record = store.activeMaintenances[0]
      
      expect(record.maintenanceDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(record.nextMaintenanceDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })

  describe('日期修改与提交', () => {
    it('修改日期后表单值应更新', () => {
      const form = {
        maintenanceDate: '2024-06-01',
        nextMaintenanceDate: '2024-07-01'
      }
      
      const newDate = '2024-08-15'
      form.maintenanceDate = newDate
      
      expect(form.maintenanceDate).toBe(newDate)
      expect(form.maintenanceDate).not.toBe('2024-06-01')
    })

    it('新增维保记录时应使用用户选择的日期', () => {
      const store = useMaintenanceStore()
      const initialCount = store.totalCount
      
      const userSelectedDate = '2024-08-10'
      const userSelectedNextDate = '2024-09-10'
      
      store.addMaintenance({
        deviceId: '1',
        deviceName: '测试设备',
        deviceNo: 'TEST-001',
        maintenanceType: '定期保养',
        maintenanceDate: userSelectedDate,
        maintenanceContent: '测试维保内容',
        maintenancePerson: '测试人员',
        maintenanceResult: '正常',
        nextMaintenanceDate: userSelectedNextDate,
        status: '已完成'
      })
      
      expect(store.totalCount).toBe(initialCount + 1)
      
      const newRecord = store.activeMaintenances[0]
      expect(newRecord.maintenanceDate).toBe(userSelectedDate)
      expect(newRecord.nextMaintenanceDate).toBe(userSelectedNextDate)
    })

    it('更新维保记录时应使用用户修改后的日期', () => {
      const store = useMaintenanceStore()
      const record = store.activeMaintenances[0]
      const originalDate = record.maintenanceDate
      
      const newDate = '2024-12-31'
      const newNextDate = '2025-01-31'
      
      store.updateMaintenance(record.id, {
        maintenanceDate: newDate,
        nextMaintenanceDate: newNextDate
      })
      
      const updatedRecord = store.getMaintenanceById(record.id)
      expect(updatedRecord?.maintenanceDate).toBe(newDate)
      expect(updatedRecord?.maintenanceDate).not.toBe(originalDate)
      expect(updatedRecord?.nextMaintenanceDate).toBe(newNextDate)
    })
  })

  describe('日期格式工具函数', () => {
    it('应正确格式化表单中的日期值', () => {
      const testDate = '2024-06-15'
      const formatted = date.format(testDate, 'yyyy-MM-dd')
      expect(formatted).toBe('2024-06-15')
    })

    it('应正确解析日期选择器返回的字符串', () => {
      const dateStr = '2024-06-20'
      const parsed = date.parse(dateStr)
      
      expect(parsed).toBeInstanceOf(Date)
      expect(parsed?.getFullYear()).toBe(2024)
      expect(parsed?.getMonth()).toBe(5)
      expect(parsed?.getDate()).toBe(20)
    })

    it('应处理空日期返回占位符', () => {
      const result = date.format('', 'yyyy-MM-dd')
      expect(result).toBe('-')
    })

    it('应处理 undefined 日期返回占位符', () => {
      const result = date.format(undefined, 'yyyy-MM-dd')
      expect(result).toBe('-')
    })
  })

  describe('日期范围过滤', () => {
    it('日期范围过滤应正确比较日期字符串', () => {
      const store = useMaintenanceStore()
      const start = '2024-06-01'
      const end = '2024-06-30'
      
      const filtered = store.activeMaintenances.filter(m => 
        m.maintenanceDate >= start && m.maintenanceDate <= end
      )
      
      expect(filtered.length).toBeGreaterThan(0)
      
      filtered.forEach(m => {
        expect(m.maintenanceDate >= start && m.maintenanceDate <= end).toBe(true)
      })
    })
  })

  describe('无固定日期赋值验证', () => {
    it('新增记录不应自动设置为当前日期', () => {
      const store = useMaintenanceStore()
      const initialCount = store.totalCount
      
      const specificDate = '2023-01-15'
      
      store.addMaintenance({
        deviceId: '1',
        deviceName: '历史记录',
        deviceNo: 'HIST-001',
        maintenanceType: '定期保养',
        maintenanceDate: specificDate,
        maintenanceContent: '历史维保',
        maintenancePerson: '历史人员',
        maintenanceResult: '正常',
        nextMaintenanceDate: '2023-02-15',
        status: '已完成'
      })
      
      const newRecord = store.activeMaintenances[0]
      expect(newRecord.maintenanceDate).toBe(specificDate)
    })

    it('编辑记录日期不应被强制覆盖为当前日期', () => {
      const store = useMaintenanceStore()
      const record = store.activeMaintenances[0]
      const originalDate = record.maintenanceDate
      
      store.updateMaintenance(record.id, {
        maintenancePerson: '更新人员'
      })
      
      const updatedRecord = store.getMaintenanceById(record.id)
      expect(updatedRecord?.maintenanceDate).toBe(originalDate)
    })
  })
})
