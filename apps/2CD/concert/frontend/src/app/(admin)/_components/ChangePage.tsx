import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const ChangePage = (props: { pageName: string }) => {
  const { pageName } = props;
  const pathName = usePathname();
  return (
    <Link href={`/${pageName}`}>
      <p className={`cursor-pointer p-3 border-b-2 ${pathName.includes(pageName) ? 'border-black ' : 'border-transparent '}`}>{pageName.includes('request') ? 'Цуцлах хүсэлт' : 'Тасалбар'}</p>
    </Link>
  );
};
