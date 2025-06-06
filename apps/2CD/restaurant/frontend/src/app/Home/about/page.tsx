'use client';

import React from 'react';
import Image from 'next/image';

const AboutUs = () => {
  return (
    <div className="bg-white min-h-screen p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-amber-900 mb-6">Бидний тухай</h2>

      <div className="flex justify-center mb-6">
        <div className="rounded-xl overflow-hidden w-[300px] h-[200px] shadow">
          <Image src="/img/elegant.png" alt="Restaurant Interior" width={300} height={200} className="object-cover w-full h-full" />
        </div>
      </div>

      <div className="space-y-6 text-[15px] text-gray-800 leading-relaxed">
        <p>
          Манай Мексик хоолны газар нь Мексикийн баялаг соёл, амттай хоолны урлагийг Монголд хүргэх зорилгоор үүсгэн байгуулагдсан. Бид амт чанартай, цэвэр, шинэхэн түүхий эдээр бэлтгэсэн уламжлалт
          Мексик хоолнуудыг та бүхэнд хүргэж байна.
        </p>

        <p>
          Манай хоолны цэсэнд алдартай тако, буррито, начос зэрэг Мексикийн үндсэн хоолнууд багтсан бөгөөд, бид Мексикийн жинхэнэ амтыг танд мэдрүүлэхийн тулд жор болон бэлтгэлийн арга технологид маш
          их анхаарал хандуулдаг. Хамгийн амттай, анхилуун үнэрт халуун ногоотой, шорвог амт нь таныг Мексикийн соёлоор аялж байгаа мэт сэтгэгдэл төрүүлэх болно.
        </p>

        <p>
          Бидний зорилго бол үйлчлүүлэгчдэдээ зөвхөн амттай хоолоор үйлчлэхээс гадна тэдний халуун дулаан, гэр бүл шигээ орчинд та тухтай байлгах юм. Танд Мексикийн амттай хоол, хөгжилтэй уур амьсгал
          болон манай найрсаг үйлчилгээ мартагдашгүй өдөр бүрийг хичээнгүйлэн бэлэглэнэ.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
