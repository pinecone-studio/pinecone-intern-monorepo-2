import React from 'react';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';
type BreaCrumbType = {
  link: string;
  Name: string;
};
const BreadCrumb = ({ items }: { items: BreaCrumbType[] }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink className={`${index == items.length - 1 && 'text-[#64748B] text-foreground'}`} href={item.link}>
              {item.Name}
            </BreadcrumbLink>
            {index !== items.length - 1 && <ChevronRight width={16} height={16} />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumb;
