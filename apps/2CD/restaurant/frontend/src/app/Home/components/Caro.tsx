import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
const items = [
  { id: 1, label: 'Үндсэн' },
  { id: 2, label: 'Кофе, цай' },
  { id: 3, label: 'Ундаа, ус' },
  { id: 4, label: 'Амттан' },
  { id: 5, label: 'Онцгой' },
];
const Caro = () => {
  return (
    <div>
      <Carousel>
        <CarouselContent>
          {items.slice(0, 4).map((item) => (
            <CarouselItem key={item.id} className="basis-1/4 flex items-center justify-center">
              <button type="button" onClick={() => alert(`Clicked on ${item.label}`)} className="w-auto focus:outline-none">
                <Card>
                  <CardContent className="inline-flex flex-col items-center justify-center px-4 py-2 box-border">
                    <span className="text-sm font-medium text-amber-950 leading-tight whitespace-nowrap">{item.label}</span>
                  </CardContent>
                </Card>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
export default Caro;
