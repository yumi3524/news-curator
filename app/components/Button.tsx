import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex flex-row items-center justify-center gap-1.5 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50';

    const variantStyles = {
      primary:
        'bg-[var(--color-brand-primary)] text-[var(--color-text-on-accent)] hover:bg-[var(--color-accent-dark)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/20',
      secondary:
        'border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] focus:ring-2 focus:ring-[var(--color-border)]',
      ghost:
        'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-border)]',
      outline:
        'border border-[var(--color-brand-primary)] bg-transparent text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/10 focus:ring-2 focus:ring-[var(--color-brand-primary)]/20',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-4 py-3 text-base',
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
