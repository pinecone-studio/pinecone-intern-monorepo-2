import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Order } from '@/generated';

const DialogComponent = ({ open, onClose, order }: { open: boolean; onClose: () => void; order: Order }) => {
  return (
    <Dialog open={open}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Тасалбар цуцлах</DialogTitle>
          <DialogDescription>{order._id} тасалбараа цуцлахдаа итгэлтэй байна уу?</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 ">
          <div className="w-full flex items-center justify-end gap-4">
            <div className="text-right">Банк</div>
            <Select>
              <SelectTrigger className="w-[318px]">
                <SelectValue placeholder="Сонгох" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="golomt">Голомт</SelectItem>
                <SelectItem value="khaan">Хаан</SelectItem>
                <SelectItem value="tdb">TDB</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full flex items-center justify-end gap-4">
            <div>Дансны №</div>
            <Input type="text" placeholder="Дансны дугаар" className="w-[318px]" />
          </div>
          <div className="w-full flex items-center justify-end gap-4">
            <div>Утасны №</div>
            <Input type="text" placeholder="Утасны дугаар" className="w-[318px]" />
          </div>
          <div className="w-full flex items-center justify-end gap-4">
            <div>Нэр</div>
            <Input type="text" placeholder="Эзэмшигчийн нэр" className="w-[318px]" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onClose}>
            Цуцлах хүсэлт илгээх
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DialogComponent;
