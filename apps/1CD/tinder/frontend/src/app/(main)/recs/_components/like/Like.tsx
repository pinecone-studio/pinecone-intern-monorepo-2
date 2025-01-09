import Image from 'next/image';

const Like = ({ position, opacity }: { position: any; opacity: number }) => {
  return (
    <div>
      {position > 0 && (
         <div className="absolute top-0 left-0 z-[10000]" style={{ opacity: opacity, transition: 'opacity 0.3s ease' }}>
          <Image data-cy='likePic' src={'/like.png'} width={200} height={100} alt="liked" className='-rotate-12' />
        </div>
      )}
    </div>
  );
};
export default Like;
