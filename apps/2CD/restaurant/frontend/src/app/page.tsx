'use client';
import { useRouter } from "next/navigation";
// import { useEffect } from "react";

const Page = () => {

  const router = useRouter();

  // useEffect(()=>{
  //   if(typeof window !== 'undefined') {
  //     const qrtoken = localStorage.getItem('qrtoken');
      // if(qrtoken) {
        router.push('/Home');
  //     }
  //   }
  // },[router])

  return (
    <div>
      Loading...
    </div>
  );
};

export default Page;
