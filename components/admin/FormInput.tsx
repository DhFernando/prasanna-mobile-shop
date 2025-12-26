/**
 * FormInput Component
 * Reusable form input with label and error handling
 * Supports dark/light mode
 */

'use client';

import React from 'react';
import { useTheme } from '@/lib/theme';

interface FormInputProps {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'date';
  value: string | number | undefined | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  min?: number;
  step?: number;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  options = [],
  rows = 3,
  min,
  step,
}) => {
  const { isDark, currentTheme } = useTheme();

  const baseInputClasses = `
    w-full px-4 py-3
    border rounded-xl
    transition-all duration-200
    focus:outline-none focus:ring-2
    ${isDark 
      ? `bg-stone-800 border-stone-600 text-white placeholder-stone-500 focus:border-stone-500`
      : `bg-white border-stone-200 text-stone-900 placeholder-stone-400 focus:border-teal-500`
    }
    ${error 
      ? isDark 
        ? 'border-red-500/50 focus:ring-red-500/20 focus:border-red-500' 
        : 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
      : ''
    }
  `;

  const focusRingStyle = { '--tw-ring-color': `${currentTheme.primaryHex}20` } as React.CSSProperties;

  return (
    <div className="mb-4">
      <label 
        htmlFor={name}
        className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`${baseInputClasses} resize-none`}
          style={focusRingStyle}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          required={required}
          className={baseInputClasses}
          style={focusRingStyle}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          step={step}
          className={baseInputClasses}
          style={focusRingStyle}
        />
      )}
      
      {error && (
        <p className={`mt-1.5 text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
      )}
    </div>
  );
};

export default FormInput;
