'use client';
import { useState } from 'react';
import CreateEventModal from './_components/EvenModal';
import { Container } from '@/components/Container';
import { AdminDashboard } from './_components/AdminDashboard';
import { useGetEventsQuery } from '@/generated';
import { useAuth } from '@/components/providers';

const HomePage = () => {
  const { user } = useAuth();

  const { refetch } = useGetEventsQuery();
  const [searchValue] = useState<string>('');
  const [date] = useState<Date | undefined>();
  const [selectedValues] = useState<string[]>([]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex w-full min-h-[calc(100vh-24px)] justify-center items-center">
        <p className="text-center">
          Уучлаарай танд нэвтрэх <br /> эрх байхгүй байна.
        </p>
      </div>
    );
  }

  return (
    <Container>
      <div data-testid="Admin-Dash" className="admin-dash min-h-[calc(100vh-140px)] py-9">
        <div className="flex justify-between w-full text-center text-black h-fit">
          <div className="flex flex-col items-start gap-[1px ]">
            <h3 className="text-lg">Тасалбар</h3>
            <p className="text-sm text-[#71717A]">Идэвхитэй зарагдаж буй тасалбарууд</p>
          </div>
          <CreateEventModal refetch={refetch} />
        </div>
        <div className="border-t-[1px] my-6"></div>
        <p>Admin searcher coming </p>

        <AdminDashboard searchValue={searchValue} selectedValues={selectedValues} date={date} />
      </div>
    </Container>
  );
};

export default HomePage;
