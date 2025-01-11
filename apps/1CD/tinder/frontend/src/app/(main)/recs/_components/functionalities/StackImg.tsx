import { User } from '@/generated';

const StackImgs = ({ cards }: { cards: User[] }) => {
  return (
    <div>
      <div className="relative flex justify-center ">
        {cards?.map((card, index) => (
          <div
            data-cy="stackImgs"
            key={card._id}
            style={{
              width: '375px',
              height: '592px',
              borderRadius: '8px',
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#333',
              backgroundImage: `url(${card.photos[0]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'absolute',
              zIndex: 1000 - index,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};
export default StackImgs;
