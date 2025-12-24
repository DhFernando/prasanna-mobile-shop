/**
 * FormInput Component
 * Reusable form input with label and error handling
 */

'use client';

import React from 'react';

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
  const baseInputClasses = `
    w-full px-4 py-3
    bg-white
    border rounded-xl
    text-stone-900 placeholder-stone-400
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500
    ${error ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-stone-200'}
  `;

  return (
    <div className="mb-4">
      <label 
        htmlFor={name}
        className="block text-sm font-medium text-stone-700 mb-1.5"
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
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          required={required}
          className={baseInputClasses}
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
        />
      )}
      
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormInput;

