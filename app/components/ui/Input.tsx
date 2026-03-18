import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, error, fullWidth = false, className = '', ...props }, ref) => {
    const baseStyles =
      'rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-base text-[var(--color-text-primary)] transition-colors placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 disabled:cursor-not-allowed disabled:opacity-50';

    const widthStyles = fullWidth ? 'w-full' : '';
    const paddingStyles = leftIcon ? 'py-2.5 pl-10 pr-4' : 'px-4 py-2.5';

    return (
      <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${paddingStyles} ${widthStyles} ${className} ${error ? 'border-red-500' : ''}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
