import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Container, Stack } from '@mui/material';
import { useUpdateAttractionMutation } from '@/generated';
import Image from 'next/image';

const InterestedIn = () => {
  const { error } = useUpdateAttractionMutation();

  if (error) {
    return (
      <Container maxWidth="xs">
        <Stack py={8}>Error: {error.message}</Stack>
      </Container>
    );
  }

  return (
    <div className="flex flex-col items-center pt-[80px] min-h-screen justify-between">
      <div className=" flex gap-6 flex-col">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center">
            <Image src="/Vector.png" width={20.28} height={24.02} alt="" />
            <div className="text-[#424242] text-3xl font-semibold">tinder</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-semibold text-2xl">Who are you interested in?</div>
            <div className="text-[#71717A] text-sm">Pick the one that feels right for you!</div>
          </div>
          <Select>
            <SelectTrigger className="w-[400px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Both">Both</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          <button className="bg-[#E11D48E5] w-[64px] h-[36px] rounded-3xl text-white">Next</button>
        </div>
      </div>
      <p className="text-[#71717A] text-sm pb-[24px]">©2024 Tinder</p>
    </div>
  );
};

export default InterestedIn;
