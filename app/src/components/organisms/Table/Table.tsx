import React from 'react'
import { TableProps } from './Table.types'

export function Table<T extends Record<string, any>>({
  data,
  columns,
  className = '',
  tableClassName = '',
  headerClassName = '',
  rowClassName = '',
}: TableProps<T>) {
  return (
    <div className={`container mx-auto ${className}`}>
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
    </div>
  )
}

export default Table
