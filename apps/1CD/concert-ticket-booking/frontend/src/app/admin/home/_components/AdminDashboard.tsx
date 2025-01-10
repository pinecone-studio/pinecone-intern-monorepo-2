/* eslint-disable complexity */
/* eslint-disable max-lines */
'use client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Event, TicketType, useDeleteEventMutation } from '@/generated';
import dayjs from 'dayjs';
import { headers } from './AdminDashboardType';
import { Star, Trash } from 'lucide-react';
import { UpdateEventPriority } from './UpdateEventPriority';
import { toast } from 'sonner';
import { AdminPagination } from '@/app/admin/home/_components/AdminDashboardPagination';
import EditingDialog from './EditingDialog';

type AdminDashboardProps = {
  data: Event[];
  refetch: () => void;
  totalPages: number;
};
export const AdminDashboard = ({ data, refetch, totalPages }: AdminDashboardProps) => {
  const [deleteEvent] = useDeleteEventMutation({
    onCompleted: () => {
      toast.success('Тоглолтыг амжилттай архивлалаа.');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const getTotalSoldQuantity = ({ ticketType }: { ticketType: TicketType[] }) => {
    return ticketType.reduce((sum, ticket) => {
      const soldQuantity = Number(ticket.soldQuantity);
      const unit = Number(ticket.unitPrice);
      return sum + soldQuantity * unit;
    }, 0);
  };

  const handleSubmit = async (id: string) => {
    await deleteEvent({
      variables: {
        id,
      },
    });
    refetch();
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
              {data?.length ? (
                data?.map((item, index) => (
                  <TableRow key={index} data-cy={`get-events-${index}`}>
                    <TableCell align="center" className="font-medium">
                      {item?.priority === 'high' && <Star className="w-4 h-4" />}
                    </TableCell>
                    <TableCell>{item?.name}</TableCell>
                    <TableCell align="center">
                      {item?.mainArtists
                        .map((a) => a.name)
                        .slice(0, 3)
                        .join(', ')}
                    </TableCell>
                    <TableCell align="center" className="font-medium">
                      {item?.products.map((product, idx) => {
                        const total = product.ticketType.reduce((sum, ticket) => {
                          return sum + Number(ticket.totalQuantity);
                        }, 0);
                        return <div key={idx}>{total}</div>;
                      })}
                    </TableCell>
                    <TableCell align="center" className="font-medium">
                      {item?.products?.map((product, idx) => {
                        const vipTicket = product.ticketType.find((ticket) => ticket.zoneName === 'VIP');
                        return (
                          vipTicket && (
                            <div key={idx}>
                              {vipTicket.soldQuantity}/{vipTicket.totalQuantity}
                            </div>
                          )
                        );
                      })}
                    </TableCell>
                    <TableCell align="center" className="font-medium">
                      {item?.products?.map((product, idx) => {
                        const regularTicket = product.ticketType.find((ticket) => ticket.zoneName === 'Regular');
                        return (
                          regularTicket && (
                            <div key={idx}>
                              {regularTicket.soldQuantity}/{regularTicket.totalQuantity}
                            </div>
                          )
                        );
                      })}
                    </TableCell>
                    <TableCell align="center" className="font-medium">
                      {item?.products?.map((product, idx) => {
                        const backstageTicket = product.ticketType.find((ticket) => ticket.zoneName === 'Backstage');
                        return (
                          backstageTicket && (
                            <div key={idx}>
                              {backstageTicket.soldQuantity}/{backstageTicket.totalQuantity}
                            </div>
                          )
                        );
                      })}
                    </TableCell>
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
                        <UpdateEventPriority eventId={item!._id} index={index} />

                        <EditingDialog event={item as Event} refetch={refetch} />
                        <p onClick={() => handleSubmit(item!._id)}>
                          <Trash className="h-5 w-5 bg-[#F4F4F5] rounded cursor-pointer p-[2px]" />
                        </p>
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
      <AdminPagination totalPages={totalPages} />
    </div>
  );
};
