import { Inbox } from 'lucide-react';
import { StateMessage } from './StateMessage';

export function EmptyState() {
  return (
    <StateMessage
      icon={<Inbox className="h-16 w-16" />}
      title="記事が見つかりませんでした"
      description="フィルタ条件を変更してみてください"
    />
  );
}
