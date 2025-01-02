import { UserBar } from '@/components/header/UserBar';
import { PostCard } from '@/components/post/PostCard';

const Page = () => {
  return (
    <>
      <div className="flex flex-col items-start justify-between w-full gap-6 px-6 lg:flex-row lg:gap-20 lg:justify-end sm:px-10 ">
        <div className="w-full lg:w-[40vw]">
          <PostCard />
        </div>

        <UserBar />
      </div>
    </>
  );
};

export default Page;
