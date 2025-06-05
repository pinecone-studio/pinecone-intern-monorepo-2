'use client';
import { Container } from '@mui/material';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RequestStatus, useGetAllRequestQuery, useUpdateRequestMutation } from '@/generated';
import { UpdateCancelReqModal } from './_components/UpdateCancelReqModal';

const Page = () => {
  const { data, refetch } = useGetAllRequestQuery();
  const [updateReq] = useUpdateRequestMutation({
    onCompleted: () => {
      toast('Амжилттай шинэчлэгдлээ');
    },
    onError: () => {
      toast('Алдаа гарлаа');
    },
  });

  const handleUpdateReq = async (id: string) => {
    await updateReq({
      variables: {
        input: {
          id,
        },
      },
    });
    await refetch();
  };

  return (
    <Container className="py-10" maxWidth="lg">
      <p className="text-lg">Хүсэлтүүд</p>
      <p className="opacity-50 text-sm">Ирсэн цуцлах хүсэлтүүд</p>

      <Table className="bg-white border rounded-md mt-5">
        <TableHeader>
          <TableRow>
            <TableHead>Тоглолтын нэр</TableHead>
            <TableHead>Дансны мэдээлэл</TableHead>
            <TableHead>Эзэмшигчийн нэр</TableHead>
            <TableHead className="text-right">Шилжүүлэх дүн</TableHead>
            <TableHead className="text-right">Хүсэлт ирсэн огноо</TableHead>
            <TableHead className="text-right">Төлөв</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.getAllRequests?.map((request) => {
            const date = format(new Date(request.createdAt), 'MM/dd');
            return (
              <TableRow key={request.id}>
                <TableCell className="font-bold">{request.booking?.concert?.title}</TableCell>
                <TableCell>
                  {request.bank}:{request.bankAccount}
                </TableCell>
                <TableCell>{request.name}</TableCell>
                <TableCell className="text-right">{request.id.toLocaleString()}</TableCell>
                <TableCell className="text-right">{date}</TableCell>
                <TableCell className="text-right" data-testid="reqStatus">
                  {request.status === RequestStatus.Pending ? <UpdateCancelReqModal name={request.name} onclick={() => handleUpdateReq(request.id)} /> : <Badge variant="secondary">шилжүүлсэн</Badge>}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          {data?.getAllRequests?.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                Хүсэлт байхгүй байна
              </TableCell>
            </TableRow>
          )}
        </TableFooter>
      </Table>
    </Container>
  );
};

export default Page;
