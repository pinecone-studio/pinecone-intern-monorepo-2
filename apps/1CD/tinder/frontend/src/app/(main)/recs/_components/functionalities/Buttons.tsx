import { Button } from '@/components/ui/button';
import { TurnIcon } from '../buttons/Turn';
import { DislikeIcon } from '../buttons/X';
import { StarIcon } from '../buttons/Star';
import { LoveIcon } from '../buttons/Love';
import { LightnignIcon } from '../buttons/Lightning';

const computeButtonStyles = ({ open, isActive, baseStyles, draggingStyles }: { open: boolean; isActive: boolean; baseStyles: string; draggingStyles: string }) => {
  if (!open) return `${baseStyles} opacity-100`;
  return `${baseStyles} ${isActive ? draggingStyles : 'opacity-0'}`;
};

const Buttons = ({ currentPosition, open, swipeLeft, swipeRight }: { currentPosition: { x: number; y: number }; open: boolean; swipeLeft: any; swipeRight: any }) => {
  const isSwipingLeft = currentPosition.x < -30 && currentPosition.y < 100;
  const isSwipingUp = currentPosition.x < 30 && currentPosition.y < 0 && currentPosition.x > -30;
  const isSwipingRight = currentPosition.x > 30 && currentPosition.y < 100;

  const baseButtonStyles = 'group bg-[#505965CC] rounded-full p-0 transform transition-transform duration-300 hover:scale-110 hover:bg-[#484b4ecb] active:scale-75 active:bg-[#e7e744]';

  return (
    <div className="flex items-center gap-2">
      <Button
        className={computeButtonStyles({
          open,
          isActive: false,
          baseStyles: `${baseButtonStyles} w-12 h-12`,
          draggingStyles: '',
        })}
      >
        <TurnIcon />
      </Button>

      <Button
        data-cy='dislikeButton'
        onClick={() => swipeLeft()}
        className={computeButtonStyles({
          open,
          isActive: isSwipingLeft,
          baseStyles: `${baseButtonStyles} w-16 h-16 active:bg-[#ff3399] ease-out`,
          draggingStyles: 'opacity-100 bg-[#ff3399] fill-white duration-400 ease-in transition-colors delay-30 animate-ping ',
        })}
      >
        <DislikeIcon isActive={isSwipingLeft} />
      </Button>

      <Button
        data-cy='starButton'
        className={computeButtonStyles({
          open,
          isActive: isSwipingUp,
          baseStyles: `${baseButtonStyles} w-12 h-12 active:bg-[#3392ff]`,
          draggingStyles: 'opacity-100 bg-[#3392ff] duration-400 ease-in transition-colors delay-30 animate-ping scale-110 ',
        })}
      >
        <StarIcon isActive={isSwipingUp} />
      </Button>

      <Button
       data-cy='likeButton'
        onClick={() => swipeRight()}
        className={computeButtonStyles({
          open,
          isActive: isSwipingRight,
          baseStyles: `${baseButtonStyles} w-16 h-16 active:bg-[#43e443]`,
          draggingStyles: 'opacity-100 bg-[#43e443]  fill-white duration-400 ease-in transition-colors delay-30 animate-ping ',
        })}
      >
        <LoveIcon isActive={isSwipingRight} />
      </Button>

      <Button
        className={computeButtonStyles({
          open,
          isActive: false,
          baseStyles: `${baseButtonStyles} w-12 h-12 active:bg-[#bf00ff]`,
          draggingStyles: '',
        })}
      >
        <LightnignIcon />
      </Button>
    </div>
  );
};

export default Buttons;
