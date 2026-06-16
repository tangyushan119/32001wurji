const date = {
  format: (date: Date | string, fmt: string = 'yyyy-MM-dd HH:mm:ss'): string => {
    const d = typeof date === 'string' ? new Date(date) : date
    const o: Record<string, number> = {
      'M+': d.getMonth() + 1,
      'd+': d.getDate(),
      'H+': d.getHours(),
      'm+': d.getMinutes(),
      's+': d.getSeconds(),
      'q+': Math.floor((d.getMonth() + 3) / 3),
      'S': d.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (d.getFullYear() + '').substring(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] + '' : ('00' + o[k]).substring(('' + o[k]).length))
      }
    }
    return fmt
  },
  parse: (str: string): Date | null => {
    try {
      return new Date(str)
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
