import { Loader } from '@/components/Loader';

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader />
    </div>
  );
};

export default LoadingScreen;
