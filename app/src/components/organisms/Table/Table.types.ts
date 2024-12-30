export interface TableColumn<T> {
  header: string
  accessor: keyof T
  render?: (value: T[keyof T], item: T) => React.ReactNode
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  className?: string
  tableClassName?: string
  headerClassName?: string
  rowClassName?: string
  isLoading?: boolean
}
