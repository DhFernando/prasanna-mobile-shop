/**
 * FormCheckbox Component
 * Styled checkbox/toggle for forms
 */

'use client';

import React from 'react';

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
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="pt-0.5">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="
            w-5 h-5
            rounded-md
            border-stone-300
            text-teal-600
            focus:ring-2 focus:ring-teal-500/20 focus:ring-offset-0
            cursor-pointer
            transition-colors
          "
        />
      </div>
      <div>
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-stone-700 cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <p className="text-sm text-stone-500 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
};

export default FormCheckbox;

