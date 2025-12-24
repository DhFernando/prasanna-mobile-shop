/**
 * DataTable Component
 * Reusable table for displaying data with actions
 */

'use client';

import React from 'react';
import { Icon } from '@/components/atoms';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onTogglePublish?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  getRowId: (item: T) => string;
}

function DataTable<T>({
  data,
  columns,
  onEdit,
  onDelete,
  onTogglePublish,
  isLoading = false,
  emptyMessage = 'No items found',
  getRowId,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="
        bg-white rounded-xl border border-stone-200
        p-12 text-center
      ">
        <div className="w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-stone-500">Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="
        bg-white rounded-xl border border-stone-200
        p-12 text-center
      ">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
          <Icon name="smartphone" size={28} className="text-stone-400" />
        </div>
        <p className="text-stone-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`
                    px-4 py-3.5 text-left
                    text-xs font-semibold text-stone-500 uppercase tracking-wider
                    ${col.className || ''}
                  `}
                >
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete || onTogglePublish) && (
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {data.map((item) => (
              <tr
                key={getRowId(item)}
                className="hover:bg-stone-50/50 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={`${getRowId(item)}-${String(col.key)}`}
                    className={`px-4 py-4 text-sm text-stone-700 ${col.className || ''}`}
                  >
                    {col.render 
                      ? col.render(item) 
                      : String((item as Record<string, unknown>)[col.key as string] ?? '')
                    }
                  </td>
                ))}
                {(onEdit || onDelete || onTogglePublish) && (
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onTogglePublish && (
                        <button
                          onClick={() => onTogglePublish(item)}
                          className="
                            p-2 rounded-lg
                            text-stone-400 hover:text-amber-600
                            hover:bg-amber-50
                            transition-colors
                          "
                          title="Toggle publish status"
                        >
                          <Icon name="check" size={18} />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="
                            p-2 rounded-lg
                            text-stone-400 hover:text-teal-600
                            hover:bg-teal-50
                            transition-colors
                          "
                          title="Edit"
                        >
                          <Icon name="tools" size={18} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="
                            p-2 rounded-lg
                            text-stone-400 hover:text-red-600
                            hover:bg-red-50
                            transition-colors
                          "
                          title="Delete"
                        >
                          <Icon name="close" size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;

