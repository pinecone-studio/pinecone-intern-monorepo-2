/* eslint-disable @next/next/no-img-element */

const items = [
  { id: 1, name: 'Taco', image: 'image.png', price: '15.6k' },
  { id: 2, name: 'Taco', image: 'image.png', price: '15.6k' },
  { id: 3, name: 'Taco', image: 'image.png', price: '15.6k' },
  { id: 4, name: 'Taco', image: 'image.png', price: '15.6k' },
];

const HomeContainer = () => {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-4 py-6">
      {items.map((item) => (
        <div key={item.id}>
          <div className="relative rounded-xl overflow-hidden group">
            <img src={item.image} alt={item.name} className="w-full h-auto object-cover rounded-xl" />
          </div>

          <p className="text-gray-800 text-lg mt-2">{item.name}</p>
          <p className="font-bold text-xl">{item.price}</p>
        </div>
      ))}
    </div>
  );
};

export default HomeContainer;
