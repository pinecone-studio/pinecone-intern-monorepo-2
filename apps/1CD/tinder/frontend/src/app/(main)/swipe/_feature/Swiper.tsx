'use client';
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import CarouselImg from './page';


const Swiper= () => {
  const [cards, setCards] = useState([
   
    ['https://placehold.co/600x800?text=2A', 'https://placehold.co/600x800?text=2B', 'https://placehold.co/600x800?text=2C'],
    ['https://placehold.co/600x800?text=3A', 'https://placehold.co/600x800?text=3B', 'https://placehold.co/600x800?text=3C'],
    ['https://placehold.co/600x800?text=4A', 'https://placehold.co/600x800?text=4B', 'https://placehold.co/600x800?text=4C'],
    ['https://placehold.co/600x800?text=5A', 'https://placehold.co/600x800?text=5B', 'https://placehold.co/600x800?text=5C'],
    ['https://placehold.co/600x800?text=6A', 'https://placehold.co/600x800?text=6B', 'https://placehold.co/600x800?text=6C'],
    ['https://placehold.co/600x800?text=7A', 'https://placehold.co/600x800?text=7B', 'https://placehold.co/600x800?text=7C'],
  ]);

  const [rotate, setRotate] = useState(0);
  const [swiping, setSwiping] = useState( ['https://placehold.co/600x800?text=1A', 'https://placehold.co/600x800?text=1B', 'https://placehold.co/600x800?text=1C'],);
  const currentPosition = useRef({ x: 0, y: 0 });
  const [duration, setDuration] = useState(0.3);
  const[open,setOpen]=useState(false);

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
    setTimeout(() => {
      setSwiping(cards[0]);
      setTimeout(() => {
        cards.shift();
        setCards(cards);
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
    <div>
      <div className="relative flex justify-center mt-4 ">
        {cards.map((card, index) => (
          <div
            key={card[0]}
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
              backgroundImage: `url(${card[0]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'absolute',
              zIndex: 1000 - index,
            }}
          ></div>
        ))}

        {swiping && (
          <motion.div
            key={swiping[0]}
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
              backgroundImage: `url(${swiping[0]})`,
              position: 'absolute',
              zIndex: cards.length + 1000,
            }}
          >
            {!open && <CarouselImg swiping={swiping}/>}
            
          </motion.div>
        )}
      </div>
      <div className="absolute flex justify-center">
        <Button onClick={() => swipeLeft()}>Dislike</Button>
        <Button onClick={() => swipeRight()}>Like</Button>
      </div>
    </div>
  );
};

export default Swiper;
