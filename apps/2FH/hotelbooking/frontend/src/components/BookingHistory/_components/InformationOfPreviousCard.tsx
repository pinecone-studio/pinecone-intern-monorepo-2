type Props = {
  adults: number;
};
export const InformationOfPreviousCard = ({ adults }: Props) => {
  return (
    <div className="py-2 flex gap-2 ">
      {adults && (
        <div className="flex items-center gap-2">
          <div className="p-[3px] rounded-full bg-black w-fit h-fit"></div>
          {adults} adults
        </div>
      )}
    </div>
  );
};

{
  /* <div className="py-2 flex gap-2 ">
      {adults && (
        <div className="flex items-center gap-2">
          <div className="p-[3px] rounded-full bg-black w-fit h-fit"></div>
          {adults} adults
        </div>
      )}
</div> */
}
