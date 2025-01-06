'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const NavbarEle = ({
  NavBar,
}: {
  NavBar: {
    label: string;
    value: string;
  }[];
}) => {
  const pathname = usePathname();

 
  return (
    <nav className="md:flex gap-6 text-sm font-medium text-[#09090B]">
      {NavBar.map((item) => (
        <Link
          key={item.value}
          href={`/${item.value}`}
          className={`px-3 py-2 pb-3.5 ${
            pathname.includes(item.value) ? 'border-b-[1px] border-[#09090B]' : ''
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
