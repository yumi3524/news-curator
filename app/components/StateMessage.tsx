import type { ReactNode } from 'react';

interface StateMessageProps {
  icon: ReactNode;
  iconColor?: string;
  title: string;
  description: string;
}

export function StateMessage({
  icon,
  iconColor = 'text-[var(--color-text-tertiary)]',
  title,
  description,
}: StateMessageProps) {
  return (
    <div className="py-16 text-center">
      <div className={`mb-4 flex justify-center ${iconColor}`}>
        {icon}
      </div>
      <h2 className="mb-2 font-[Sora,sans-serif] text-2xl font-bold text-[var(--color-text-primary)]">
        {title}
      </h2>
      <p className="text-base text-[var(--color-text-secondary)]">
        {description}
      </p>
    </div>
  );
}
