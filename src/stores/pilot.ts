﻿import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface LicenseInfo {
  id: string
  name: string
  no: string
  issueDate: string
  expireDate: string
  status: string
}

export interface Pilot {
  id: string
  name: string
  gender: string
  idCard: string
  phone: string
  birthDate: string
  entryDate: string
  status: string
  licenses: LicenseInfo[]
  createTime: string
  lastUpdate: string
}

export const usePilotStore = defineStore('pilot', () => {
  const pilots = ref<Pilot[]>([
    {
      id: '1',
      name: '张三',
      gender: '男',
      idCard: '110101199001011234',
      phone: '13800138001',
      birthDate: '1990-01-01',
      entryDate: '2020-03-15',
      status: '在职',
      licenses: [
        { id: '1', name: '无人机驾驶员执照', no: 'DJI-2020-001', issueDate: '2020-06-01', expireDate: '2025-05-31', status: '有效' },
        { id: '2', name: '民用无人机驾驶员合格证', no: 'CAAC-2020-001', issueDate: '2020-06-15', expireDate: '2025-06-14', status: '有效' }
      ],
      createTime: '2020-03-15',
      lastUpdate: '2024-06-15'
    },
    {
      id: '2',
      name: '李四',
      gender: '女',
      idCard: '220101199205156789',
      phone: '13900139002',
      birthDate: '1992-05-15',
      entryDate: '2021-08-20',
      status: '在职',
      licenses: [
        { id: '3', name: '无人机驾驶员执照', no: 'DJI-2021-005', issueDate: '2021-10-01', expireDate: '2026-09-30', status: '有效' }
      ],
      createTime: '2021-08-20',
      lastUpdate: '2024-06-10'
    },
    {
      id: '3',
      name: '王五',
      gender: '男',
      idCard: '330101198812254321',
      phone: '13700137003',
      birthDate: '1988-12-25',
      entryDate: '2019-01-10',
      status: '离职',
      licenses: [
        { id: '4', name: '无人机驾驶员执照', no: 'DJI-2019-010', issueDate: '2019-05-01', expireDate: '2024-04-30', status: '已过期' }
      ],
      createTime: '2019-01-10',
      lastUpdate: '2024-05-01'
    }
  ])

  const addPilot = (pilot: Omit<Pilot, 'id' | 'createTime' | 'lastUpdate'>) => {
    const newPilot: Pilot = {
      ...pilot,
      id: String(Date.now()),
      createTime: new Date().toISOString().split('T')[0],
      lastUpdate: new Date().toISOString().split('T')[0]
    }
    pilots.value.unshift(newPilot)
  }

  const updatePilot = (id: string, pilot: Partial<Pilot>) => {
    const index = pilots.value.findIndex(p => p.id === id)
    if (index !== -1) {
      pilots.value[index] = {
        ...pilots.value[index],
        ...pilot,
        lastUpdate: new Date().toISOString().split('T')[0]
      }
    }
  }

  const removePilot = (id: string) => {
    const index = pilots.value.findIndex(p => p.id === id)
    if (index !== -1) {
      pilots.value.splice(index, 1)
    }
  }

  const getPilotById = (id: string) => {
    return pilots.value.find(p => p.id === id)
  }

  const totalCount = computed(() => pilots.value.length)
  const activeCount = computed(() => pilots.value.filter(p => p.status === '在职').length)
  const inactiveCount = computed(() => pilots.value.filter(p => p.status !== '在职').length)

  return {
    pilots,
    addPilot,
    updatePilot,
    removePilot,
    getPilotById,
    totalCount,
    activeCount,
    inactiveCount
  }
})
