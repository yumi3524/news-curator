import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
}

export function ErrorState({ message = 'エラーが発生しました' }: ErrorStateProps) {
  return (
    <div className="py-16 text-center">
      <div className="mb-4 flex justify-center text-red-500">
        <AlertCircle className="h-16 w-16" />
      </div>
      <h2 className="mb-2 font-[Sora,sans-serif] text-2xl font-bold text-[var(--color-text-primary)]">
        {message}
      </h2>
      <p className="text-base text-[var(--color-text-secondary)]">
        しばらくしてから再度お試しください
      </p>
    </div>
  );
}
