import Swiper from './_components/functionalities/Swiper';
import Header from './_components/heaeder/Header';

const TinderSwipe = () => {
  return (
    <div className=''>
      <Header />
      <Swiper />
      <div className="mx-auto text-sm text-white/60" data-cy="footer-text">
        © Copyright 2024
      </div>
    </div>
  );
};
export default TinderSwipe;
