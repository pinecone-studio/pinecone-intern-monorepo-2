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
import { Loader2, Star, Trash } from 'lucide-react';
import { UpdateEventPriority } from './UpdateEventPriority';
import { toast } from 'sonner';

type AdminDashboardProps = {
  data: Event[]; // Assuming 'Event' is already defined as a type or interface
  refetch: () => void; // Function that returns void
};
export const AdminDashboard = ({ data, refetch }: AdminDashboardProps) => {
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 10;

  const [deleteEvent, { loading: loadingDelete }] = useDeleteEventMutation({
    onCompleted: () => {
      toast.success('Successfully archived the event');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // if (loading)
  //   return (
  //     <div className="flex h-full items-center justify-center">
  //       <Loader2 className="w-24 h-24 animate-spin text-[#00B7F4]" />
  //     </div>
  //   );

  const getTotalSoldQuantity = ({ ticketType }: { ticketType: TicketType[] }) => {
    return ticketType.reduce((sum, ticket) => {
      const soldQuantity = Number(ticket.soldQuantity);
      const unit = Number(ticket.unitPrice);
      return sum + soldQuantity * unit;
    }, 0);
  };
  // const filterDeletedEvents = filteredData?.filter((event) => event?.priority === 'high' || event?.priority === 'low');

  // const sortedEvents = filterDeletedEvents?.sort((a, b) => {
  //   if (a?.priority === 'Онцлох' && b?.priority !== 'Онцлох') {
  //     return -1;
  //   }
  //   if (b?.priority === 'Онцлох' && a?.priority !== 'Онцлох') {
  //     return 1;
  //   }
  //   return 0;
  // });
  // const totalPages = sortedEvents && sortedEvents.length > 0 ? Math.ceil(sortedEvents.length / itemsPerPage) : 0;
  // const currentPageData = sortedEvents?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                        <p>edit</p>
                        {loadingDelete ? (
<<<<<<< HEAD
                          <Loader2 className="w-4 h-4 animate-spin text-[#00B7F4]" />
=======
                          <span className="loader"></span>
>>>>>>> fab79620 (feat(concert-frontend): delete)
                        ) : (
                          <p onClick={() => handleSubmit(item!._id)}>
                            <Trash className="h-4 w-4" />
                          </p>
                        )}
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
      {/* <AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> */}
    </div>
  );
};
