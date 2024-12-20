'use client';
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const TinderSwipe = () => {
  const [cards, setCards] = useState([
    'https://placehold.co/600x800?text=1',
    'https://placehold.co/600x800?text=2',
    'https://placehold.co/600x800?text=3',
    'https://placehold.co/600x800?text=4',
    'https://placehold.co/600x800?text=5',
    'https://placehold.co/600x800?text=6',
  ]);

  const [rotate, setRotate] = useState(0);
  const [swiping, setSwiping] = useState('https://placehold.co/600x800?text=0');
  const currentPosition = useRef({ x: 0, y: 0 });
  const [duration, setDuration] = useState(0.3);

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
            key={card}
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
              backgroundImage: `url(${card})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'absolute',
              zIndex: 1000 - index,
            }}
          ></div>
        ))}

        {swiping && (
          <motion.div
            key={swiping}
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
              backgroundImage: `url(${swiping})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'absolute',
              zIndex: cards.length + 1000,
            }}
          >
            Swipe Me
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

export default TinderSwipe;
