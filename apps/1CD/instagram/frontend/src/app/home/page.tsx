import { UserBar } from '@/components/header/UserBar';
import { PostCard } from '@/components/post/PostCard';

const Page = () => {
  return (
    <>
      <div className="flex items-start justify-center w-full gap-20 md:pl-[276px] md:pr-[356px] px-10  ">
        <div className="w-2/3">
          <PostCard />
        </div>

        <UserBar />
      </div>
    </>
  );
};

export default Page;
