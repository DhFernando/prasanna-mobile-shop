/**
 * FormCheckbox Component
 * Styled checkbox/toggle for forms
 * Supports dark/light mode
 */

'use client';

import React from 'react';
import { useTheme } from '@/lib/theme';

interface FormCheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  name,
  checked,
  onChange,
  description,
}) => {
  const { isDark, currentTheme } = useTheme();

  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="pt-0.5">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={`
            w-5 h-5
            rounded-md
            cursor-pointer
            transition-colors
            focus:ring-2 focus:ring-offset-0
            ${isDark 
              ? 'bg-stone-700 border-stone-500' 
              : 'border-stone-300'
            }
          `}
          style={{ 
            accentColor: currentTheme.primaryHex,
            '--tw-ring-color': `${currentTheme.primaryHex}30` 
          } as React.CSSProperties}
        />
      </div>
      <div>
        <label 
          htmlFor={name}
          className={`block text-sm font-medium cursor-pointer ${isDark ? 'text-stone-300' : 'text-stone-700'}`}
        >
          {label}
        </label>
        {description && (
          <p className={`text-sm mt-0.5 ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>{description}</p>
        )}
      </div>
    </div>
  );
};

export default FormCheckbox;
