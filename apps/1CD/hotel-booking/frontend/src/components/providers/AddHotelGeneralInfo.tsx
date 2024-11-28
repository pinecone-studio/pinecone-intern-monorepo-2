import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type AddHotelGeneralInfoType = {
  open: boolean;
  setOpen: (_value: boolean) => void;
};
const AddHotelGeneralInfo = ({ open, setOpen }: AddHotelGeneralInfoType) => {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-[626px] w-full">
        <div className="text-[#09090B]">
          <div className="pb-6 text-base">General Info</div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-sm">
              <div>Name</div>
              <div>
                <Input />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div>Type</div>
              <div>
                <Input />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div>Price per night</div>
              <div>
                <Input />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div>Room information</div>
              <div>
                <Textarea />
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <div>
              <Button onClick={() => setOpen(false)} className="bg-[#FFFFFF] hover:bg-slate-100 active:bg-slate-200 text-black">
                Cancel
              </Button>
            </div>
            <div>
              <Button className="text-white bg-[#2563EB] hover:bg-blue-400 active:bg-blue-300">Save</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AddHotelGeneralInfo;
