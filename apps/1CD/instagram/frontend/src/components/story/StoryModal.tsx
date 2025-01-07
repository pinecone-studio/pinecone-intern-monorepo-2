// import { useStory } from '@/components/providers/StoryProvider';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';

// const StoryModal = ({ onClose }: { onClose: () => void }) => {
//   const { selectedUserStories } = useStory();

//   if (!selectedUserStories) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
//       <div className="bg-[#18181B] p-4 rounded-lg relative w-[90%] max-w-[600px]">
//         <button className="absolute text-xl text-white top-2 right-2" onClick={onClose}>
//           ×
//         </button>
//         <Swiper slidesPerView={1} className="w-full">
//           {selectedUserStories.map((story, i) => (
//             <SwiperSlide key={i}>
//               <div
//                 className="h-[400px] w-full bg-cover bg-center"
//                 style={{
//                   backgroundImage: `url(${story.image || '/images/default-story.jpg'})`,
//                 }}
//               ></div>
//               <div className="mt-4 text-white">
//                 <p>{story.description}</p>
//                 <p className="text-sm text-gray-400">{new Date(story.createdAt!).toLocaleString()}</p>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// };

// export default StoryModal;
