import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const InputField = React.forwardRef(({
  label,
  id,
  error,
  helperText,
  type = 'text',
  placeholder,
  required = false,
  className = '',
  containerClassName = '',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  rightAction,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={twMerge(clsx('w-full flex flex-col', containerClassName))}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          {label}
          {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative rounded-[10px]">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <LeftIcon className="w-4 h-4" aria-hidden="true" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          placeholder={placeholder}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={twMerge(
            clsx(
              'w-full h-11 px-3.5 py-2.5 rounded-[10px] bg-white text-slate-900 border text-sm transition-all duration-200 outline-none',
              'placeholder:text-slate-400',
              LeftIcon ? 'pl-10' : '',
              RightIcon || rightAction ? 'pr-10' : '',
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                : 'border-slate-300 focus:border-brand-interactive focus:ring-2 focus:ring-blue-100',
              className
            )
          )}
          {...props}
        />

        {RightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
            <RightIcon className="w-4 h-4" aria-hidden="true" />
          </div>
        )}
        {rightAction && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightAction}
          </div>
        )}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-rose-600 font-medium">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="mt-1 text-xs text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

InputField.displayName = 'InputField';
export default InputField;

