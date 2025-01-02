/* eslint-disable complexity */
'use client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TicketType, useGetEventsQuery } from '@/generated';
import dayjs from 'dayjs';
import { headers } from './AdminDashboardType';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { AdminPagination } from '@/components/AdminDashboardPagination';
import { UpdateEventPriority } from '@/app/admin/home/_components/UpdateEventPriority';

type AdminDashboardComponent = {
  searchValue: string;
  selectedValues: string[];
  date: Date | undefined;
  priority: string;
};
export const AdminDashboard = ({ searchValue, selectedValues, date, priority }: AdminDashboardComponent) => {
  const { data, loading } = useGetEventsQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  if (loading) return <div>Loading...</div>;
  const filteredData = data?.getEvents?.filter((item) => {
    const lowerCaseSearchValue = searchValue.toLowerCase();
    const lowerCasedate = date;
    const lowerCaseSelectedValues = selectedValues.map((value) => value.toLowerCase());
    if (lowerCasedate) {
      return item?.scheduledDays.some((eventtime) => {
        const eventDate = new Date(eventtime);
        return eventDate.getDate() === lowerCasedate.getDate() && eventDate.getMonth() === lowerCasedate.getMonth() && eventDate.getFullYear() === lowerCasedate.getFullYear();
      });
    }
    if (lowerCaseSelectedValues.length > 0) {
      return item?.mainArtists.some((artist) => lowerCaseSelectedValues.includes(artist.name.toLowerCase()));
    }
    if (lowerCaseSearchValue) {
      return item?.name.toLowerCase().includes(lowerCaseSearchValue);
    }
    if (priority) {
      return item?.priority?.toLowerCase() === priority.toLowerCase();
    }
    return true;
  });

  const getTotalSoldQuantity = ({ ticketType }: { ticketType: TicketType[] }) => {
    return ticketType.reduce((sum, ticket) => {
      const soldQuantity = Number(ticket.soldQuantity);
      const unit = Number(ticket.unitPrice);
      return sum + soldQuantity * unit;
    }, 0);
  };
  const filterDeletedEvents = filteredData?.filter((event) => event?.priority === 'high' || event?.priority === 'low');

  const sortedEvents = filterDeletedEvents?.sort((a, b) => {
    if (a?.priority === 'Онцлох' && b?.priority !== 'Онцлох') {
      return -1;
    }
    if (b?.priority === 'Онцлох' && a?.priority !== 'Онцлох') {
      return 1;
    }
    return 0;
  });
  const totalPages = sortedEvents && sortedEvents.length > 0 ? Math.ceil(sortedEvents.length / itemsPerPage) : 0;
  const currentPageData = sortedEvents?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col gap-6 mt-9">
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 600 }} aria-label="simple table">
            <TableHead>
              <TableRow className="text-[#71717A] text-[14px]" data-testid={`get-rows`}>
                {headers.map((header, index) => (
                  <TableCell data-cy="table-header" key={index} align={header.align}>
                    {header.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {currentPageData?.length ? (
                currentPageData?.map((item, index) => (
                  <TableRow key={index} data-cy={`get-events-${index}`}>
                    <TableCell align="center" className="font-medium">
                      {item?.priority === 'high' && <Star className="w-4 h-4" />}
                    </TableCell>
                    <TableCell>{item?.name}</TableCell>
                    <TableCell align="center">
                      {item?.mainArtists
                        .map((a) => a.name)
                        .slice(0, 2)
                        .join(', ')}
                    </TableCell>
                    <TableCell align="center" className="font-medium">
                      {item && Number(item?.products[0].ticketType[0].totalQuantity) + Number(item?.products[0].ticketType[1].totalQuantity) + Number(item?.products[0].ticketType[2].totalQuantity)}
                    </TableCell>
                    <TableCell align="center" className="font-medium">
                      {item?.products.map((q) => q.ticketType[0].soldQuantity)}
                    </TableCell>
                    <TableCell align="center">{item?.products.map((q) => q.ticketType[1].soldQuantity)}</TableCell>
                    <TableCell align="center">{item?.products.map((q) => q.ticketType[2].soldQuantity)}</TableCell>
                    <TableCell align="center" className="flex flex-col">
                      {item?.scheduledDays.map((date, index) => (
                        <span key={index} className="flex">
                          {dayjs(date).format('MM-DD')}
                        </span>
                      ))}
                    </TableCell>

                    <TableCell align="center">
                      {item && item.products.map((data, index) => <div key={index}>{data.ticketType && <div>{getTotalSoldQuantity({ ticketType: data.ticketType })} ₮</div>}</div>)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <UpdateEventPriority eventId={item!._id} index={index}/>
                        <p>edit</p>
                        <p>delete</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <p className="text-[#A1A1AA] text-2xl">Хайлтад тохирох үр дүн олдсонгүй.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};
