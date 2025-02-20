'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetRequestsQuery } from '@/generated';
import { TableContainer } from '@mui/material';
import dayjs from 'dayjs';
import { StatusChangeModal } from './_components/ModalStatus';
import { useAuth } from '@/components/providers';

const CancelRequestPage = () => {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useGetRequestsQuery({
    variables: {},
  });

  if (!user || user.role !== 'admin') {
    return (
      <div
        className="flex flex-col items-center justify-center w-full min-h-full bg-black"
        style={{
          background: 'radial-gradient(32.61% 32.62% at 50% 125%, #00B7F4 0%, #0D0D0F 100%)',
        }}
      >
        <p className="text-xl text-center text-white">
          Админ эрхтэй мэйл хаягаар <br /> нэвтэрч цааш үргэлжлүүлнэ үү!
        </p>
      </div>
    );
  }

  if (loading)
    return (
      <p data-cy="loading-text" className="flex w-full min-h-[calc(100vh-24px)] justify-center items-center">
        Loading...
      </p>
    );
  if (error) return <p data-cy="error-text">Error: {error.message}</p>;

  return (
    <div data-cy="cancel-request-page" className="min-h-[calc(100vh-140px)] py-10">
      <div className="container m-auto">
        <div className="flex flex-col items-start">
          <h3 className="text-lg" data-cy="page-title">
            Хүсэлтүүд
          </h3>
          <p className="text-sm text-gray-500" data-cy="page-description">
            Ирсэн цуцлах хүсэлтүүд
          </p>
          <div className="border-t-[1px] border bg-[#E4E4E7] py-6"></div>
        </div>
        <TableContainer component="div" className="overflow-hidden bg-white rounded-lg shadow-lg" data-cy="table-container">
          <Table aria-label="simple table" className="min-w-full" data-cy="request-table">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]" data-cy="table-header-event">
                  Тоглолтын нэр
                </TableHead>
                <TableHead data-cy="table-header-bank-info">Дансны мэдээлэл</TableHead>
                <TableHead data-cy="table-header-owner">Эзэмшигчийн нэр</TableHead>
                <TableHead data-cy="table-header-phone">Утасны дугаар</TableHead>
                <TableHead className="text-right" data-cy="table-header-total-price">
                  Шилжүүлэх дүн
                </TableHead>
                <TableHead className="text-right" data-cy="table-header-created-at">
                  Хүсэлт ирсэн огноо
                </TableHead>
                <TableHead className="text-right" data-cy="table-header-status">
                  Төлөв
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.getRequests.map((item, idx) => (
                <TableRow key={idx} className="border-b hover:bg-gray-50" data-cy="table-row">
                  <TableCell className="font-medium" data-cy="table-cell-event-name">
                    {item.eventId.name}
                  </TableCell>
                  <TableCell data-cy="table-cell-bank-info">
                    {item.bankName}:{item.bankAccount}
                  </TableCell>
                  <TableCell data-cy="table-cell-owner">{item.accountOwner}</TableCell>
                  <TableCell className="text-right" data-cy="table-cell-phone-number">
                    {item.phoneNumber}
                  </TableCell>
                  <TableCell className="text-right" data-cy="table-cell-total-price">
                    {item.totalPrice.toLocaleString()} <span>₮</span>
                  </TableCell>
                  <TableCell className="text-right" data-cy="table-cell-created-at">
                    {dayjs(item.createdAt).format('MM.DD')}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right" data-cy="table-cell-status">
                    <StatusChangeModal idx={idx} status={item.status} name={item.accountOwner} orderId={item.orderId} reqId={item._id} refetch={refetch} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default CancelRequestPage;
