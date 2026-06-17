import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePilotStore } from '@/stores/pilot'

describe('Pilot Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should have initial pilots data', () => {
    const store = usePilotStore()
    expect(store.pilots).toBeDefined()
    expect(store.pilots.length).toBeGreaterThan(0)
  })

  it('should have correct computed properties', () => {
    const store = usePilotStore()
    expect(store.totalCount).toBe(store.pilots.length)
    expect(store.activeCount).toBe(store.pilots.filter(p => p.status === '在职').length)
    expect(store.inactiveCount).toBe(store.pilots.filter(p => p.status !== '在职').length)
  })

  it('should add a new pilot', () => {
    const store = usePilotStore()
    const initialCount = store.totalCount
    
    store.addPilot({
      name: '测试飞手',
      gender: '男',
      idCard: '440101199501011234',
      phone: '13800138999',
      birthDate: '1995-01',
      entryDate: '2024-01-01',
      status: '在职',
      licenses: []
    })
    
    expect(store.totalCount).toBe(initialCount + 1)
    expect(store.pilots[0].name).toBe('测试飞手')
    expect(store.pilots[0].idCard).toBe('440101199501011234')
    expect(store.pilots[0].createTime).toBeDefined()
    expect(store.pilots[0].lastUpdate).toBeDefined()
  })

  it('should update an existing pilot', () => {
    const store = usePilotStore()
    const pilot = store.pilots[0]
    const originalName = pilot.name
    const originalUpdate = pilot.lastUpdate
    
    store.updatePilot(pilot.id, {
      name: '更新后的飞手',
      phone: '13900139888'
    })
    
    const updatedPilot = store.getPilotById(pilot.id)
    expect(updatedPilot?.name).toBe('更新后的飞手')
    expect(updatedPilot?.phone).toBe('13900139888')
    expect(updatedPilot?.lastUpdate).not.toBe(originalUpdate)
    expect(updatedPilot?.idCard).toBe(pilot.idCard)
  })

  it('should remove a pilot', () => {
    const store = usePilotStore()
    const initialCount = store.totalCount
    const pilotId = store.pilots[0].id
    
    store.removePilot(pilotId)
    
    expect(store.totalCount).toBe(initialCount - 1)
    expect(store.getPilotById(pilotId)).toBeUndefined()
  })

  it('should get pilot by id', () => {
    const store = usePilotStore()
    const pilot = store.pilots[0]
    
    const foundPilot = store.getPilotById(pilot.id)
    
    expect(foundPilot).toBeDefined()
    expect(foundPilot?.id).toBe(pilot.id)
    expect(foundPilot?.name).toBe(pilot.name)
  })

  it('should return undefined for non-existent id', () => {
    const store = usePilotStore()
    const foundPilot = store.getPilotById('non-existent-id')
    
    expect(foundPilot).toBeUndefined()
  })

  it('should correctly count active and inactive pilots', () => {
    const store = usePilotStore()
    const activeBefore = store.activeCount
    
    store.updatePilot(store.pilots[0].id, { status: '离职' })
    
    expect(store.activeCount).toBe(activeBefore - 1)
    expect(store.inactiveCount).toBe(store.totalCount - store.activeCount)
  })

  it('should handle pilots with licenses', () => {
    const store = usePilotStore()
    store.addPilot({
      name: '持证飞手',
      gender: '女',
      idCard: '330101199303033333',
      phone: '13700137777',
      birthDate: '1993-03',
      entryDate: '2023-06-01',
      status: '在职',
      licenses: [
        { id: '1', name: '无人机执照', no: 'TEST-001', issueDate: '2023-07-01', expireDate: '2028-06-30', status: '有效' }
      ]
    })
    
    const addedPilot = store.pilots[0]
    expect(addedPilot.licenses).toBeDefined()
    expect(addedPilot.licenses.length).toBe(1)
    expect(addedPilot.licenses[0].name).toBe('无人机执照')
  })
})
