import { AlertCircle } from 'lucide-react';
import { StateMessage } from './StateMessage';

interface ErrorStateProps {
  message?: string;
}

export function ErrorState({ message = 'エラーが発生しました' }: ErrorStateProps) {
  return (
    <StateMessage
      icon={<AlertCircle className="h-16 w-16" />}
      iconColor="text-red-500"
      title={message}
      description="しばらくしてから再度お試しください"
    />
  );
}
