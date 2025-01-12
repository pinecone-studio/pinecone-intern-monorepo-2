// 'use client';

// import { BuySteps, CartCard, CartCardDisable, Payment, ShippingInfo } from '@/components';
// import { useData } from '@/components/utils/dataProvider';
// import { api } from '@/lib/axios';
// import { AxiosError } from 'axios';
// import { useEffect, useState } from 'react';
// import { toast } from 'sonner';

// interface ProductType {
//   _id: string;
//   name: string;
//   price: number;
//   salePercent: number;
//   description: string;
//   qty: {
//     free?: number;
//     s?: number;
//     m?: number;
//     l?: number;
//     xl?: number;
//     '2xl'?: number;
//     '3xl'?: number;
//   };
//   images: string[];
// }
// export default function Buy() {
//   const { cartProduct } = useData();
//   const [step, setStep] = useState<number>(1);
//   const [products, setProducts] = useState<ProductType[]>([]);
//   const [totalPrice, setTotalPrice] = useState<number>(0);
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const productIds = cartProduct.map((item) => item.product);
//         const uniqueIds = Array.from(new Set(productIds)); // Remove duplicates

//         // Fetch all products in parallel
//         const responses = await Promise.all(uniqueIds.map((id) => api.get(`/product/${id}`)));

//         const fetchedProducts = responses.map((res) => res.data.product as ProductType);
//         setProducts(fetchedProducts);
//       } catch (err: unknown) {
//         console.error(err);
//         if (err instanceof AxiosError) {
//           toast.error(err.response?.data?.message || 'Failed to fetch products.');
//         } else {
//           toast.error('An unknown error occurred.');
//         }
//       }
//     };

//     if (cartProduct.length > 0) {
//       fetchProducts();
//     } else {
//       setProducts([]);
//       setTotalPrice(0);
//     }
//   }, [cartProduct]);

//   useEffect(() => {
//     let total = 0;
//     cartProduct.forEach((cartItem) => {
//       const product = products.find((p) => p._id === cartItem.product);
//       if (product) {
//         let price = product.price;
//         if (product.salePercent) {
//           price = price - (price * product.salePercent) / 100;
//         }
//         total += price * cartItem.quantity;
//       }
//     });
//     setTotalPrice(total);
//   }, [products, cartProduct]);

//   const stringPrice = () => {
//     return totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'") + '₮';
//   };

//   return (
//     <div className="space-y-12">
//       <BuySteps step={step} />
//       {step === 1 && (
//         <div className="border max-w-[638px] m-auto bg-gray-50 rounded-2xl p-8 space-y-4">
//           <div className="font-bold text-xl">
//             1. Сагс <span className="text-gray-400 font-normal">({cartProduct.length})</span>
//           </div>
//           {cartProduct.map((product, i) => (
//             <CartCard key={i} id={product.product} quantity={product.quantity} size={product.size} />
//           ))}
//           <div className="flex justify-between">
//             <p>Нийт төлөх дүн:</p>
//             <p className="font-bold text-xl">{stringPrice()}</p>
//           </div>
//           <div className="text-end pt-12">
//             <button onClick={() => setStep(2)} className="text-white bg-blue-600 px-9 py-2 rounded-full text-sm">
//               Худалдан авах
//             </button>
//           </div>
//         </div>
//       )}
//       {step === 2 && (
//         <div className="flex gap-5 m-auto w-fit">
//           <div className="bg-gray-50 border min-w-[333px] rounded-2xl py-8 px-6 space-y-4">
//             <div className="font-bold text-lg">
//               Сагс <span className="text-gray-400 font-normal">({cartProduct.length})</span>
//             </div>
//             {cartProduct.map((product, i) => (
//               <CartCardDisable key={i} id={product.product} quantity={product.quantity} size={product.size} />
//             ))}
//             <div className="border-t border-dashed"></div>
//             <div className="flex justify-between">
//               <p>Нийт төлөх дүн:</p>
//               <p className="font-bold text-lg">{stringPrice()}</p>
//             </div>
//           </div>
//           <ShippingInfo setStep={setStep} totalPrice={totalPrice} />
//         </div>
//       )}
//       {step === 3 && (
//         <div className="w-[687px] m-auto bg-gray-50 rounded-2xl p-8 border space-y-4">
//           <div className="font-bold text-xl">3. Төлбөр төлөлт</div>
//           <Payment />
//           <button type="button" onClick={() => setStep(2)} className="bg-white border px-9 py-2 rounded-full text-sm">
//             Буцах
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

const Page = () => {
  return <div>hello world</div>;
};

export default Page;
