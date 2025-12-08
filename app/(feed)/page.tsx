import { NewsCurator } from '@/app/components/NewsCurator';
import { ThemeSwitcher } from '@/app/components/ThemeSwitcher';

export default function FeedPage() {
  return (
    <>
      <ThemeSwitcher />
      <NewsCurator />
    </>
  );
}
