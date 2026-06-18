import * as XLSX from 'xlsx'

export interface ExportColumn<T> {
  key: keyof T
  label: string
}

export function exportToExcel<T>(
  data: T[],
  columns: ExportColumn<T>[],
  sheetName: string = 'Sheet1',
  fileName: string = 'export.xlsx'
): void {
  const headers = columns.map(col => col.label)
  const rows = data.map(row =>
    columns.map(col => {
      const value = row[col.key]
      return value ?? ''
    })
  )

  const worksheetData = [headers, ...rows]
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  XLSX.writeFile(workbook, fileName)
}

export function exportToExcelWithFormat<T>(
  data: T[],
  columns: ExportColumn<T>[],
  sheetName: string = 'Sheet1',
  fileName: string = 'export.xlsx'
): void {
  const jsonData = data.map(row => {
    const formattedRow: Record<string, any> = {}
    columns.forEach(col => {
      formattedRow[col.label] = row[col.key] ?? ''
    })
    return formattedRow
  })

  const worksheet = XLSX.utils.json_to_sheet(jsonData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  columns.forEach((_, index) => {
    const colLetter = XLSX.utils.encode_col(index)
    worksheet[`${colLetter}1`] = {
      ...worksheet[`${colLetter}1`],
      s: {
        font: { bold: true },
        fill: { fgColor: { rgb: 'E8E8E8' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        }
      }
    }
  })

  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = `${XLSX.utils.encode_col(col)}${row + 1}`
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = {
          ...worksheet[cellAddress].s,
          alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          }
        }
      }
    }
  }

  worksheet['!cols'] = columns.map(() => ({ wch: 18 }))

  XLSX.writeFile(workbook, fileName)
}