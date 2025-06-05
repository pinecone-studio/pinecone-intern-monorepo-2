import SvgIcon from './Logo';
import LoadingIcon from './LoadingIcon';
const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen flex-col gap-4">
      <SvgIcon />
      <LoadingIcon className="animate-spin" />
      <p className="text-xl  text-gray-300">Please wait...</p>
    </div>
  );
};

export default Loader;