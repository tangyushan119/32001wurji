const storage = {
  get: <T>(key: string): T | null => {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch {
      return null
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      console.error('Storage set error')
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch {
      console.error('Storage remove error')
    }
  },
  clear: (): void => {
    try {
      localStorage.clear()
    } catch {
      console.error('Storage clear error')
    }
  }
}

export { storage }
