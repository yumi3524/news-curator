import { ButtonHTMLAttributes } from 'react';

export interface TagProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  label: string;
  variant?: 'default' | 'selected' | 'featured' | 'outline';
  size?: 'sm' | 'md';
  count?: number;
  isClickable?: boolean;
}

export function Tag({
  label,
  variant = 'default',
  size = 'md',
  count,
  isClickable = true,
  onClick,
  disabled = false,
  className = '',
  ...props
}: TagProps) {
  const baseStyles =
    'inline-flex items-center gap-2 rounded font-semibold transition-all whitespace-nowrap';

  const variantStyles = {
    default:
      'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-brand-primary)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-1',
    selected:
      'border border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] text-[var(--color-text-on-accent)] shadow-sm',
    featured:
      'bg-white/10 text-[var(--color-featured-text)] backdrop-blur-[10px] hover:bg-white/20 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-1',
    outline:
      'border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:border-[var(--color-brand-primary)] hover:shadow-sm',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed'
    : isClickable
      ? 'cursor-pointer'
      : 'cursor-default';

  // クリック可能な場合はbutton、そうでない場合はspan
  const Component = isClickable && onClick ? 'button' : 'span';

  return (
    <Component
      onClick={isClickable && !disabled ? onClick : undefined}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      type={Component === 'button' ? 'button' : undefined}
      {...(Component === 'button' ? props : {})}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`rounded-[10px] px-2 py-0.5 text-xs font-semibold ${variant === 'selected'
              ? 'bg-white/25'
              : 'bg-black/[0.08] dark:bg-white/[0.10]'
            }`}
        >
          {count}
        </span>
      )}
    </Component>
  );
}
