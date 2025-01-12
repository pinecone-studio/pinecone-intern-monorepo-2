'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Fragment, useMemo } from 'react';
import { capitalize } from 'src/utils/capitalize';
import { CreateProjectButton } from './CreateProjectButton';

type Params = {
  project?: string;
  env?: string;
};

export const Header = () => {
  const params = useParams<Params>();

  const list = useMemo(() => {
    const list = [];

    if (params.project) {
      list.push({
        label: params.project,
        href: `/projects/${params.project}`,
      });
    }

    if (params.env) {
      list.push({
        label: params.env,
        href: `/projects/${params.project}/${params.env}`,
      });
    }

    return list;
  }, [params.project, params.env]);

  return (
    <div className="flex items-center justify-between">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {list.length === 0 ? (
              <BreadcrumbPage className="flex items-center gap-4 text-xl font-semibold">
                Projects <CreateProjectButton />
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink className="text-xl font-semibold">
                <Link href="/">Projects</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>

          {list.map((item, index) => (
            <Fragment key={item.label}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === list.length - 1 ? (
                  <BreadcrumbPage className="text-xl font-semibold">{capitalize(item.label)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink className="text-xl font-semibold">
                    <Link href={`/${item.label}`}>{capitalize(item.label)}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
