/**
 * DataTable Component
 * Reusable table for displaying data with actions
 * Supports dark/light mode
 */

'use client';

import React from 'react';
import { Icon } from '@/components/atoms';
import { useTheme } from '@/lib/theme';

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
  const { isDark, currentTheme } = useTheme();
  
  if (isLoading) {
    return (
      <div className={`rounded-xl border p-12 text-center ${
        isDark ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-stone-200'
      }`}>
        <div 
          className="w-8 h-8 border-3 rounded-full animate-spin mx-auto mb-3"
          style={{ borderColor: `${currentTheme.primaryHex}30`, borderTopColor: currentTheme.primaryHex }}
        />
        <p className={isDark ? 'text-stone-400' : 'text-stone-500'}>Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`rounded-xl border p-12 text-center ${
        isDark ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-stone-200'
      }`}>
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
          isDark ? 'bg-stone-700' : 'bg-stone-100'
        }`}>
          <Icon name="smartphone" size={28} className={isDark ? 'text-stone-500' : 'text-stone-400'} />
        </div>
        <p className={isDark ? 'text-stone-400' : 'text-stone-500'}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border overflow-hidden ${
      isDark ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-stone-200'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`
                    px-4 py-3.5 text-left
                    text-xs font-semibold uppercase tracking-wider
                    ${isDark ? 'text-stone-400' : 'text-stone-500'}
                    ${col.className || ''}
                  `}
                >
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete || onTogglePublish) && (
                <th className={`px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider ${
                  isDark ? 'text-stone-400' : 'text-stone-500'
                }`}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-stone-700' : 'divide-stone-100'}`}>
            {data.map((item) => (
              <tr
                key={getRowId(item)}
                className={`transition-colors ${isDark ? 'hover:bg-stone-700/50' : 'hover:bg-stone-50/50'}`}
              >
                {columns.map((col) => (
                  <td
                    key={`${getRowId(item)}-${String(col.key)}`}
                    className={`px-4 py-4 text-sm ${isDark ? 'text-stone-300' : 'text-stone-700'} ${col.className || ''}`}
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
                          className={`p-2 rounded-lg transition-colors ${
                            isDark 
                              ? 'text-stone-500 hover:text-amber-400 hover:bg-amber-500/10' 
                              : 'text-stone-400 hover:text-amber-600 hover:bg-amber-50'
                          }`}
                          title="Toggle publish status"
                        >
                          <Icon name="check" size={18} />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark 
                              ? 'text-stone-500 hover:text-blue-400 hover:bg-blue-500/10' 
                              : 'text-stone-400 hover:text-teal-600 hover:bg-teal-50'
                          }`}
                          title="Edit"
                        >
                          <Icon name="tools" size={18} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark 
                              ? 'text-stone-500 hover:text-red-400 hover:bg-red-500/10' 
                              : 'text-stone-400 hover:text-red-600 hover:bg-red-50'
                          }`}
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


