'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useGetAllUsersWithLatestStoriesQuery } from '@/generated';
import StoryCarouselCard from '@/app/(main)/_components/story/StoryCarouselCard';

const StoryPage = () => {
  const { data: latestStories } = useGetAllUsersWithLatestStoriesQuery();
  // const { data: userStories } = useGetFollowingUserStoriesQuery({
  //   variables: {
  //     user: '677cd0961ea6ef24a9a17418',
  //   },
  // });

  const allStories = latestStories?.getAllUsersWithLatestStories.map((data) => ({
    user: data.user,
    stories: data.stories,
    _id: data._id,
  }));

  // const [progress, setProgress] = useState(0);

  // useEffect(() => {
  //   let progress = 0;
  //   const interval = setInterval(() => {
  //     progress += 0.8;
  //     setProgress(progress);
  //     if (progress >= 100) {
  //       clearInterval(interval);
  //     }
  //   }, 100);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="bg-[#18181B] h-screen flex items-center relative">
      <div className="absolute top-0 w-full p-6">
        <img src="https://umamiharstad.no/wp-content/uploads/2018/09/instagram-font-logo-white-png.png" className="w-[103px] h-[29px]" />
      </div>
      {/* <div className="flex items-center justify-center gap-8 px-11"> */}
      <Swiper
        className="flex mySwiper"
        slidesPerView={4}
        pagination={{ clickable: true }}
        // autoplay={{ delay: 2500, disableOnInteraction: false }}
        navigation={true}
        modules={[Autoplay, Navigation]}
        style={{ marginLeft: '100px' }}
      >
        {allStories?.flatMap((story, i) => (
          <SwiperSlide key={i} className="p-4 transition-transform duration-300 hover:scale-105">
            <StoryCarouselCard storyImg={story.stories.map((img) => img.image)} user={story.user} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* <StorySection /> */}
      {/* </div> */}
      {/* <BigStoryCard progress={progress} allStories={allStories} /> */}
    </div>
  );
};

export default StoryPage;
