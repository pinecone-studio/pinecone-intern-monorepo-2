import { motion } from 'framer-motion';
import CarouselImg from './Carouselmg';
import { useEffect, useRef, useState } from 'react';
import { User, useSwipeUserMutation } from '@/generated';
import Buttons from './Buttons';

import Like from '../like/Like';
import Dislike from '../like/Dislike';
import Match from '@/components/providers/Match';
const Swiping = ({ cards, swiping, setSwiping, setCards }: { cards: User[]; swiping: User | undefined; setSwiping: (_value: User) => void; setCards: (_value: User[]) => void }) => {
  const [rotate, setRotate] = useState(0);
  const [duration, setDuration] = useState(0.3);
  const [open, setOpen] = useState(false);
  const currentPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMatchOpen, setIsMatchOpen] = useState(false);
  const [likeOpacity, setLikeOpacity] = useState(0);
  const [DisOpacity, setDisOpacity] = useState(0);
  const [swipeUser, { data }] = useSwipeUserMutation();
  const [lastSwipedUserId, setLastSwipedUserId] = useState<string | null>(null);
 
  useEffect(() => {
    if (data?.swipeUser.matched === true) {
      setIsMatchOpen(!isMatchOpen);
    }
  }, [data]);
  const swipeLeft = () => {

    const swipedUserId = swiping?._id || ''; 
    setLastSwipedUserId(swipedUserId);
    swipeUser({
      variables: {
        input: {
          swipedUser: swipedUserId,
          type: 'disliked',
        },
      },
    });
    setDuration(0.5);
    setRotate(-30);
    currentPosition.current = { x: -1500, y: 0 };
    removeTopCard();
    setTimeout(() => {
      resetCardPosition();
    }, 300);
  };
  const swipeRight = () => {
  const swipedUserId = swiping?._id || '';
  setLastSwipedUserId(swipedUserId);
  swipeUser({
    variables: {
      input: {
        swipedUser: swipedUserId, 
        type: 'liked',
      },
    },
  });
    setDuration(0.5);
    setRotate(30);
    currentPosition.current = { x: 1500, y: 0 };
    removeTopCard();
    setTimeout(() => {
      resetCardPosition();
    }, 300);
  };

  const removeTopCard = () => {
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
    console.log(currentPosition.current);
    const rotationAngle = newX / 15;
    setRotate(rotationAngle);
    const DislikedcalculatedOpacity = Math.min(Math.max(-newX / 150, 0), 1);
    setLikeOpacity(DislikedcalculatedOpacity);
    const LikecalculatedOpacity = Math.min(Math.max(newX / 150, 0), 1);
    setDisOpacity(LikecalculatedOpacity);
  };
  const resetCardPosition = () => {
    setDuration(0);
    setLikeOpacity(0);
    setDisOpacity(0);
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
      resetCardPosition();
    }
  };
  return (
    <div>
      <div className="relative h-[560px] flex justify-center" data-cy="swipingImg-2">
        {swiping && (
          <motion.div
            data-cy="swipingImg"
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
              zIndex: cards?.length + 1000,
            }}
          >
            <Dislike opacity={likeOpacity} position={currentPosition.current.x} />
            <Like position={currentPosition.current.x} opacity={DisOpacity} />
            {!open && <CarouselImg swiping={swiping} />}
          </motion.div>
        )}
{isMatchOpen && swiping?._id && <Match isMatchOpen={isMatchOpen} setIsMatchOpen={setIsMatchOpen} swipedUserId={lastSwipedUserId} />}
      </div>
      <div className="absolute left-0 right-0 z-[10000] flex justify-center">
        <Buttons currentPosition={currentPosition.current} open={open} swipeLeft={swipeLeft} swipeRight={swipeRight} />
      </div>
    </div>
  );
};
export default Swiping;
