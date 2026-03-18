import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClose?: () => void;
  children: ReactNode;
  actions?: ReactNode;
}

export function Modal({
  icon,
  title,
  description,
  onClose,
  children,
  actions,
}: ModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-[var(--color-bg-primary)] p-6 shadow-2xl animate-[slideIn_0.3s_ease-out] md:p-8">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-brand-primary)]/10">
                {icon}
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                {title}
              </h2>
            </div>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              {description}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]"
              aria-label="閉じる"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        {children}

        {actions && <div className="flex gap-3">{actions}</div>}
      </div>
    </div>
  );
}
