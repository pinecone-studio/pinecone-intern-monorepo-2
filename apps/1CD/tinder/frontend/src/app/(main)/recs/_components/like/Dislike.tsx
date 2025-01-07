import Image from 'next/image';
const Dislike = ({ opacity, position }: { opacity: number; position: number }) => {
  return (
    <div>
      {position < 0 && (
        <div className="absolute top-12 right-2 z-[10000]" style={{ opacity: opacity, transition: 'opacity 0.3s ease' }}>
          <Image data-cy='dislikePic' src={'/no.svg'} width={140} height={80} alt="disliked" className="rotate-45" />
        </div>
      )}
    </div>
  );
};
export default Dislike;
