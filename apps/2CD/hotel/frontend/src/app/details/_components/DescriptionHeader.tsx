'use client';

interface DescriptionHeaderProps {
  hotelName: string;
}

export const DescriptionHeader = ({ hotelName }: DescriptionHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="items-center gap-2">
        <h2 className="text-2xl font-bold">{hotelName}</h2>
      </div>
      <h2 className="flex items-center gap-4 w-[400px] justify-start font-bold">Location</h2>
    </div>
  );
};
