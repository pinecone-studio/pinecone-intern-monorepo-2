import { motion } from 'framer-motion';
import CarouselImg from './Carouselmg';
import { useRef, useState } from 'react';
import { User } from '@/generated';

const Swiping = ({ cards, swiping, setSwiping, setCards }: { cards: User[]; swiping: User | undefined; setSwiping: (_value: User) => void; setCards: (_value: User[]) => void }) => {
  const [rotate, setRotate] = useState(0);
  const [duration, setDuration] = useState(0.3);
  const [open, setOpen] = useState(false);
  const currentPosition = useRef({ x: 0, y: 0 });

  const swipeLeft = () => {
    setDuration(0.5);
    setRotate(-30);
    currentPosition.current = { x: -1500, y: 0 };
    removeTopCard();
    setTimeout(() => {
      resetCardPosition();
    }, 300);
  };

  const swipeRight = () => {
    setDuration(0.5);
    setRotate(30);
    currentPosition.current = { x: 1500, y: 0 };
    removeTopCard();
    setTimeout(() => {
      resetCardPosition();
    }, 300);
  };

  const removeTopCard = () => {
    if (!cards) return;
    setTimeout(() => {
      setSwiping(cards?.[0]);
      setTimeout(() => {
        const updatedCards = cards.slice(1);
        setCards(updatedCards);
      }, 300);
    }, 299);
  };
  const handleDrag = (event: any, info: any) => {
    setOpen(true);
    const newX = currentPosition.current.x + info.delta.x;
    const newY = currentPosition.current.y + info.delta.y;
    currentPosition.current = { x: newX, y: newY };
    const rotationAngle = newX / 15;
    setRotate(rotationAngle);
  };
  const resetCardPosition = () => {
    setDuration(0);
    currentPosition.current = { x: 0, y: 0 };
    setRotate(0);
  };

  const handleDragEnd = () => {
    setOpen(!open);
    if (currentPosition.current.x > 150) {
      swipeRight();
    } else if (currentPosition.current.x < -150) {
      swipeLeft();
    } else {
      console.log(currentPosition.current.x);
      resetCardPosition();
    }
  };
  return (
    <div >
      <div className="relative flex justify-center">
        {swiping && (
          <motion.div
            key={swiping._id}
            drag
            onDrag={handleDrag}
            dragSnapToOrigin
            dragMomentum={false}
            dragTransition={{ bounceStiffness: 800, bounceDamping: 20 }}
            onDragEnd={handleDragEnd}
            animate={{
              x: currentPosition.current.x,
              y: currentPosition.current.y,
              rotate: rotate,
            }}
            initial={{ x: 0, y: 0 }}
            transition={{ type: 'spring', duration: duration }}
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
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundImage: `url(${swiping.photos[0]})`,
              position: 'absolute',
              zIndex: cards?.length ? cards?.length + 1000 : 1000,
            }}
          >
            {!open && <CarouselImg swiping={swiping} />}
          </motion.div>
        )}
      </div>
    </div>
  );
};
export default Swiping;
