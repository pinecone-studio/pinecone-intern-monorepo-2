'use client';
import React from 'react';
import Link from 'next/link';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FiHome } from 'react-icons/fi';

import { CiSearch } from 'react-icons/ci';
import { FaRegHeart } from 'react-icons/fa';

export const MenuBar = () => {
  const items = [
    {
      name: 'Home',
      icon: <FiHome />,
      href: '/',
    },
    {
      name: 'Search',
      icon: <CiSearch />,
      href: '/',
    },
    {
      name: 'Notifications',
      icon: <FaRegHeart />,
      href: '/',
    },
    {
      name: 'Notifications',
      icon: <FaRegHeart />,
      href: '/',
    },
    {
      name: 'Notifications',
      icon: <FaRegHeart />,
      href: '/',
    },
  ];

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      <TooltipProvider>
        {items.map((item, index) => {
          return (
            item.href && (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link href={item.href} className={'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'}>
                    <p>{item.icon}</p>
                    <p>{item.name}</p>
                  </Link>
                </TooltipTrigger>
              </Tooltip>
            )
          );
        })}
      </TooltipProvider>
    </nav>
  );
};
