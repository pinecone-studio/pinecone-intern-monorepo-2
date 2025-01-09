const DisplayTugrug = ({ tugrug }: { tugrug: number | undefined }) => {
  if (!tugrug) return null;
  return (
    <div datatest-id="Display-Tugrug" className="text-xl font-medium text-[#09090B]">
      {tugrug?.toLocaleString()} ₮
    </div>
  );
};
export default DisplayTugrug;
