'use client';

import { Container } from '@/components/Container';
// import { useAuth } from '@/components/providers';
// import { useGetRequestsQuery } from '@/generated';

const ArtistPage = () => {
//   const { user } = useAuth();
//   const { data, loading, error } = useGetRequestsQuery({
//     variables: {},
//   });

//   if (!user || user.role !== 'admin') {
//     return (
//       <div
//         className="flex flex-col items-center justify-center w-full min-h-full bg-black"
//         style={{
//           background: 'radial-gradient(32.61% 32.62% at 50% 125%, #00B7F4 0%, #0D0D0F 100%)',
//         }}
//       >
//         <p className="text-xl text-center text-white">
//           Админ эрхтэй мэйл хаягаар <br /> нэвтэрч цааш үргэлжлүүлнэ үү!
//         </p>
//       </div>
//     );
//   }

//   if (loading)
//     return (
//       <p data-cy="loading-text" className="flex w-full min-h-[calc(100vh-24px)] justify-center items-center">
//         Loading...
//       </p>
//     );
//   if (error) return <p data-cy="error-text">Error: {error.message}</p>;
  return (
    <Container>
      <div data-cy="Artist-Components" className="min-h-[calc(100vh-140px)] py-9">
        <div className="flex flex-col gap-[1px]">
          <h3 className="text-lg">Артист</h3>
          <p className="text-sm text-[#71717A]">Бүх артистийн мэдээлэл</p>
        </div>
        <div className="border-t-[1px] my-6"></div>
        <div>artist component</div>
      </div>
    </Container>
  );
};

export default ArtistPage;
