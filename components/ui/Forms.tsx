import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  mask?: (value: string) => string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', mask, onChange, ...props }, ref) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (mask) {
        e.target.value = mask(e.target.value);
      }
      if (onChange) {
        onChange(e);
      }
    };

    const inputId = React.useId();

    return (
      <div className="w-full mb-4">
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          onChange={handleChange}
          className={`
            w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-slate-400
            transition-all duration-200 ease-in-out
            focus:outline-none focus:border-mulungu-500 focus:ring-1 focus:ring-mulungu-500
            disabled:bg-slate-50 disabled:text-slate-500
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600 animate-slide-in font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "w-full py-3 px-4 rounded-lg font-bold text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    primary: "bg-mulungu-600 hover:bg-mulungu-700 text-white shadow-md shadow-mulungu-200 focus:ring-mulungu-500 hover:shadow-lg",
    outline: "border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700 focus:ring-slate-500 hover:border-slate-300",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="animate-pulse">Processando...</span>
        </span>
      ) : children}
    </button>
  );
};