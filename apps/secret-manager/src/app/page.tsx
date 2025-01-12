'use client';

import { MouseEventHandler, useEffect, useState } from 'react';
import { capitalize } from 'src/utils/capitalize';
import { Table, TableBody, TableCell, TableFooter, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Trash } from 'lucide-react';
import { useConfirmation } from './_components/ConfirmationProvider';
import { useRefresh } from './_components/RefreshProvider';

export type Project = {
  _id: string;
  groupName: string;
  createdAt: string;
  updatedAt: string;
  secrets: {
    test: Record<string, string>;
    prod: Record<string, string>;
    dev: Record<string, string>;
  };
};

const Page = () => {
  const router = useRouter();

  const { confirm } = useConfirmation();
  const { refreshId } = useRefresh();

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(1);

  const handleClick = (id: string) => () => {
    router.push(`/${id}`);
  };

  const handleDelete = (name: string) => async () => {
    await fetch(`/api/groups/${name}`, {
      method: 'DELETE',
    });

    setProjects((prev) => prev.filter((project) => project.groupName !== name));
  };

  const handleDeleteClick: (_name: string) => MouseEventHandler<HTMLButtonElement> = (name: string) => (e) => {
    e.stopPropagation();

    confirm({
      message: 'Are you sure you want to delete this project?',
      fn: handleDelete(name),
    });
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);

      const response = await fetch('/api/groups');

      const data = await response.json();

      setProjects(data);

      setLoading(false);
    };

    fetchProjects();
  }, [refreshId]);

  if (loading)
    return (
      <div className="flex justify-center items-center w-full h-[300px]">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <Table>
      <TableBody>
        {projects.slice((page - 1) * 10, page * 10).map((project) => (
          <TableRow key={project._id} className="cursor-pointer" onClick={handleClick(project.groupName)}>
            <TableCell>
              <div className="flex items-center gap-4">
                <p className="flex-1">{capitalize(project.groupName)}</p>

                <Button variant="outline" className="p-1 h-fit" onClick={handleDeleteClick(project.groupName)}>
                  <Trash size={14} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      <TableFooter className="pt-6 bg-transparent">
        <Pagination className="flex justify-end pt-6">
          <PaginationContent>
            <PaginationItem className="cursor-pointer">
              <PaginationPrevious />
            </PaginationItem>
            {Array.from({ length: Math.ceil(projects.length / 10) }).map((_, index) => (
              <PaginationItem key={index} className="cursor-pointer">
                <PaginationLink isActive={page === index + 1} onClick={() => setPage(index + 1)}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem className="cursor-pointer">
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </TableFooter>
    </Table>
  );
};

export default Page;
