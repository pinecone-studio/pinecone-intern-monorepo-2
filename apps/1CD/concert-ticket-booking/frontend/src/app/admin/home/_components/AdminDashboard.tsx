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

type AdminDashboardComponent = {
  searchValue: string;
  selectedValues: string[];
  date: Date | undefined;
  priority: string;
};
export const AdminDashboard = ({ searchValue, selectedValues, date }: AdminDashboardComponent) => {
  const { data, loading } = useGetEventsQuery();
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

    return true;
  });

  const getTotalSoldQuantity = ({ ticketType }: { ticketType: TicketType[] }) => {
    return ticketType.reduce((sum, ticket) => {
      const soldQuantity = Number(ticket.soldQuantity);
      const unit = Number(ticket.unitPrice);
      return sum + soldQuantity * unit;
    }, 0);
  };

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
              {filteredData?.length ? (
                filteredData?.map((item, index) => (
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
                        <p>special</p>
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
      <p>Dashboard pagination components coming</p>
    </div>
  );
};
