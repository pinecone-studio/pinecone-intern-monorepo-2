export const BackgroundGradients = () => {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-black/60 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-black/60 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-screen h-screen bg-gradient-to-br from-black/40 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-screen h-screen bg-gradient-to-bl from-black/40 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-screen h-screen bg-gradient-to-tr from-black/40 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-screen h-screen bg-gradient-to-tl from-black/40 to-transparent pointer-events-none"></div>
    </>
  );
};
