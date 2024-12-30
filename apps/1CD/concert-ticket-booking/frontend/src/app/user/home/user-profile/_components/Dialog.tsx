import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Order, useCancelTicketMutation } from '@/generated';

const DialogComponent = ({ open, onClose, order }: { open: boolean; onClose: () => void; order: Order }) => {
  const orderId = order._id;
  const [bank, setBank] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [ownerName, setOwnerName] = useState<string>('');

  const [createRequest, { data, loading, error }] = useCancelTicketMutation();

  const handleSubmit = async () => {
    await createRequest({
      variables: {
        input: {
          orderId,
          bankDatas: { bankName: bank, bankAccount: accountNumber, accountOwner: ownerName, phoneNumber: phoneNumber },
        },
      },
    });
    console.log({ bank, accountNumber, phoneNumber, ownerName });
    onClose(); // Close dialog after submitting
  };

  return (
    <Dialog open={open} data-cy="dialog-component">
      <DialogContent onClose={onClose} data-cy="dialog-content">
        <DialogHeader data-cy="dialog-header">
          <DialogTitle data-cy="dialog-title">Тасалбар цуцлах</DialogTitle>
          <DialogDescription data-cy="dialog-description">{order._id} тасалбараа цуцлахдаа итгэлтэй байна уу?</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="w-full flex items-center justify-end gap-4" data-cy="select-bank">
            <div className="text-right">Банк</div>
            <Select data-cy="bank-select" value={bank} onValueChange={setBank}>
              <SelectTrigger className="w-[318px]" data-cy="bank-select-trigger">
                <SelectValue placeholder="Сонгох" data-cy="bank-select-value" />
              </SelectTrigger>
              <SelectContent className="w-full" data-cy="bank-select-content">
                <SelectItem value="golomt" data-cy="select-item-golomt">
                  Голомт
                </SelectItem>
                <SelectItem value="khaan" data-cy="select-item-khaan">
                  Хаан
                </SelectItem>
                <SelectItem value="tdb" data-cy="select-item-tdb">
                  TDB
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full flex items-center justify-end gap-4" data-cy="account-number">
            <div>Дансны №</div>
            <Input type="text" placeholder="Дансны дугаар" className="w-[318px]" data-cy="input-account-number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
          </div>
          <div className="w-full flex items-center justify-end gap-4" data-cy="phone-number">
            <div>Утасны №</div>
            <Input type="text" placeholder="Утасны дугаар" className="w-[318px]" data-cy="input-phone-number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>
          <div className="w-full flex items-center justify-end gap-4" data-cy="owner-name">
            <div>Нэр</div>
            <Input type="text" placeholder="Эзэмшигчийн нэр" className="w-[318px]" data-cy="input-owner-name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
          </div>
        </div>
        <DialogFooter data-cy="dialog-footer">
          <Button type="submit" onClick={handleSubmit} data-cy="submit-cancel-request">
            Цуцлах хүсэлт илгээх
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogComponent;
