// import { Button } from '@/components/ui/button';
// import { DatePickerWithRange } from './DatePicker';

// import { Input } from '@/components/ui/input';
// import { ComboboxDemo } from '../../app/TravelerSelection';
// import { SearchedHotelCards } from './SearchedHotelCards';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// export const SearchResult = () => {
//   return (
//     <>
//       <section data-testid="search-result-section" className="flex mx-auto items-center pl-5 gap-4 mt-20 max-w-[1200px] max-h-28 border-[3px] border-orange-200 rounded-xl">
//         <div className="flex flex-col w-full gap-2 my-4">
//           <p>Dates</p>
//           <DatePickerWithRange />
//         </div>
//         <div className="flex flex-col w-full gap-2 my-4">
//           <p>Travels</p>
//           <ComboboxDemo />
//         </div>
//         <Button className="w-full mr-5 bg-blue-700 mt-7" data-testid="search-hotel-room-btn">
//           Search
//         </Button>
//       </section>
//       <section className="flex justify-center w-full gap-14">
//         <div className="flex flex-col gap-2 mt-12">
//           <p>Search by property name</p>
//           <Input type="email" placeholder="Search" className="w-64" data-testid="search-hotel-by-name-input" />
//         </div>
//         <section className="mt-10">
//           <div className="flex items-center justify-between">
//             <p>51 properties</p>
//             <Select>
//               <SelectTrigger data-testid="filter-select" className="w-80">
//                 <SelectValue placeholder="Recommended" />
//               </SelectTrigger>
//               <SelectContent>
// eslint-disable-next-line no-secrets/no-secrets
//                 <SelectItem value="light">Recommended</SelectItem>
//                 <SelectItem value="dark">Price: Low to High</SelectItem>
//                 <SelectItem value="system">Price: High to Low</SelectItem>
//                 <SelectItem value="star">Star Rating</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <SearchedHotelCards />
//         </section>
//       </section>
//     </>
//   );
// };
