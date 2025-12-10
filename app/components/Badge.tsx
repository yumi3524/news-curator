import { ReactNode } from 'react';

export interface BadgeProps {
  icon?: ReactNode;
  label: string | number;
  variant?: 'default' | 'primary' | 'muted';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  icon,
  label,
  variant = 'default',
  size = 'sm',
  className = '',
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center gap-1.5';

  const variantStyles = {
    default: 'text-[var(--color-text-tertiary)]',
    primary: 'text-[var(--color-brand-primary)]',
    muted: 'text-[var(--color-featured-text)]/85',
  };

  const sizeStyles = {
    sm: 'text-[13px]',
    md: 'text-sm',
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
