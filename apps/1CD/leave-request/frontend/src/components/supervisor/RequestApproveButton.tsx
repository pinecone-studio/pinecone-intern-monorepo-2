import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import { GoCheck } from 'react-icons/go';

const ApproveButton = () => {
  {
    /* <button className="flex items-center gap-2 rounded-md px-4 py-2 bg-[#18181B] text-[#FAFAFA] text-sm font-medium">
                <GoCheck size={16} />
                Зөвшөөрөх
            </button> */
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 rounded-md px-4 py-2 bg-[#18181B] text-[#FAFAFA] text-sm font-medium">
          {' '}
          <GoCheck size={16} />
          Зөвшөөрөх
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[512px]">
        <DialogHeader>
          <DialogTitle className="text-lg text-[#09090B] font-semibold">Та итгэлтэй байна уу?</DialogTitle>
          <DialogDescription className="text-sm text-[#71717A]">Чөлөөний хүсэлтийг зөвшөөрснөөр тухайн ажилтан руу хүсэлт нь баталгаажсан гэсэн мессеж Teams Chat -аар очно.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="secondary" className="bg-white border-[1px] border-[#E4E4E7] rounded-md px-4 py-2 text-sm text-[#18181B] font-medium">
            Буцах
          </Button>
          <Button type="submit" className="bg-[#18181B] rounded-md px-4 py-2 text-sm text-[#FAFAFA] font-medium">
            Зөвшөөрөх
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveButton;
