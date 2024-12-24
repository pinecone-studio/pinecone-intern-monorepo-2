

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { User } from "@/generated";
import Image from "next/image";

const CarouselImg = ({ swiping}:{swiping:User}) => {
  return (
    <div className="relative group">
      <Carousel className="w-[375px] h-[592px] ">
      <CarouselContent className="mt-0 ml-0">
        {swiping.photos.slice(0,3).map((oneUser, index) => (
          <CarouselItem key={index} className="pt-0 pl-0" >
            <div className="pt-0 pl-0 ">
                  <Image src={oneUser} width={400} height={600} alt='img' className="w-[375px] h-[592px] object-cover rounded-lg shadow-lg"/>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0"/>
      <CarouselNext className="absolute right-0"/>
    </Carousel>
    </div>
  );
};
export default CarouselImg;
