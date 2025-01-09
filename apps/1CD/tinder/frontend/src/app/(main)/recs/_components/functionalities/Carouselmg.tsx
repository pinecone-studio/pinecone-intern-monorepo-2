import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { User } from '@/generated';
import { Blocks } from 'lucide-react';
import Image from 'next/image';

const CarouselImg = ({ swiping }: { swiping: User }) => {
 
  
  return (
    <div className="relative ">
      <Carousel className="w-[375px] h-[750px] ">
        <CarouselContent className="relative mt-20 ml-0 " data-cy="carousel">
          {swiping.photos.map((oneUser, index) => (
            <CarouselItem key={index} className="pl-0 ">
              <div className="relative pt-0 pl-0">
                <Image src={oneUser} width={400} height={600} alt="img" className="w-[375px] h-[592px] object-cover rounded-lg shadow-lg" />
                <div className="absolute px-6 bottom-16">
                  {index === 0 && (
                    <div className="flex items-center gap-2">
                      <div className="text-4xl font-extrabold text-[#FFFFFF]" data-cy='name On first Slide'>{swiping.name}</div>
                      <div className="text-3xl font-light text-[#FFFFFF]" data-cy='age On first Slide'>{swiping.age}</div>
                    </div>
                  )}
                  {index !== 0 && (
                    <div>
                      <div className="text-3xl text-[#FFFFFF]" data-cy="secondName">{swiping.name}</div>
                      <div className="flex gap-2 text-sm font-semibold text-[#FFFFFF]">
                        <Blocks color="white" size={20} />
                        Interests
                      </div>
                      <div className="flex gap-1" data-cy="interests">
                        {swiping.interests.map((interest,index) => (
                          <div key={interest}>
                            <Button className={`h-6 px-3 text-[#FFFFFF] rounded-full bg-[#505965CC] font-light hover:bg-[#e01090] ${index===0 ? ('bg-[#e01090]'):'' }`}>{interest}</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        

        <CarouselPrevious className="absolute left-0 bg-[#94999f8e] border-[#505965CC] hover:bg-[#696c6fb7]" />
        <CarouselNext className="absolute right-0  bg-[#94999f7d] border-[#505965CC] hover:bg-[#696c6fb7]" data-cy="nextButton"/>
      </Carousel>
    </div>
  );
};
export default CarouselImg;
