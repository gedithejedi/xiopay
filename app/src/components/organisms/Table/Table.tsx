import React from 'react'
import { TableProps } from './Table.types'
import Spinner from '@/components/atoms/Spinner'

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function Table<T extends Record<string, any>>({
  data,
  columns,
  className = '',
  tableClassName = '',
  headerClassName = '',
  rowClassName = '',
  isLoading = false,
}: TableProps<T>) {
  return (
    <div className={`container mx-auto ${className}`}>
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-full">
          <Spinner className="w-10 h-10" />
        </div>
      ) : (
        <table className={`table w-full ${tableClassName}`}>
          <thead className={headerClassName}>
            <tr className="border-gray-300">
              {columns.map((column, index) => (
                <th key={index}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr key={rowIndex} className={rowClassName}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {column.render
                      ? column.render(item[column.accessor], item)
                      : item[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Table
