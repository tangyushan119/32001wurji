const date = {
  format: (date: Date | string, fmt: string = 'yyyy-MM-dd HH:mm:ss'): string => {
    const d = typeof date === 'string' ? new Date(date) : date
    if (!d || isNaN(d.getTime())) {
      return ''
    }
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')
    
    return fmt
      .replace('yyyy', String(year))
      .replace('MM', month)
      .replace('dd', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)
  },
  parse: (str: string): Date | null => {
    try {
      const d = new Date(str)
      if (isNaN(d.getTime())) {
        return null
      }
      return d
    } catch {
      return null
    }
  },
  now: (): string => {
    return date.format(new Date())
  },
  diff: (start: Date | string, end: Date | string): number => {
    const d1 = typeof start === 'string' ? new Date(start) : start
    const d2 = typeof end === 'string' ? new Date(end) : end
    return Math.abs(d2.getTime() - d1.getTime())
  }
}

export { date }
