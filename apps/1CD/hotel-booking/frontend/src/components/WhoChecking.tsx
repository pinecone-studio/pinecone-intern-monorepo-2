const WhoChecking = () => {
  return (
    <div data-testid="Who-Checking-Text" className="text-[#09090B] flex flex-col gap-2 max-w-[581px] w-full">
      <div className="text-lg">1. Who’s checking in?</div>
      <div className="text-[#71717A]">
        Please tell us the name of the guest staying at the hotel as it appears on the ID that they’ll present at check-in. If the guest has more than one last name, please enter them all.
      </div>
    </div>
  );
};

export default WhoChecking;
