import type { ReactNode } from 'react';
import { cx } from './types';

export interface DataColumn<T> {
  align?: 'left' | 'center' | 'right';
  header: ReactNode;
  key: string;
  render: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  caption?: string;
  columns: Array<DataColumn<T>>;
  emptyMessage?: ReactNode;
  getRowKey?: (row: T, index: number) => string | number;
  rows: T[];
}

export function DataTable<T,>({
  caption,
  columns,
  emptyMessage = 'No records available.',
  getRowKey,
  rows,
}: DataTableProps<T>) {
  return (
    <div className="as-table-wrap">
      <table className="as-table">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                className={cx(column.align && `is-${column.align}`)}
                key={column.key}
                scope="col"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>{emptyMessage}</td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr key={getRowKey?.(row, rowIndex) ?? rowIndex}>
                {columns.map((column) => (
                  <td className={cx(column.align && `is-${column.align}`)} key={column.key}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
