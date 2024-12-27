import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const OrderInfo = () => {
  return (
    <div className="text-white w-[841px]">
      <h1>Захиалгын мэдээлэл </h1>
      <Card className=" bg-[#131313] border-none px-8 pt-8 pb-6">
        <div className="text-white flex justify-between items-center">
          <h2>Захиалгын дугаар :</h2> <Button className="bg-[#27272A]">Цуцлах</Button>
        </div>
        <Card className="h-[52px] bg-[#131313] border-dashed border-muted-foreground"></Card>
      </Card>
    </div>
  );
};
export default OrderInfo;
