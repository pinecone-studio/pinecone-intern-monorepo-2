import { useRouter } from 'next/navigation';

export const Header = () => {
  const router = useRouter();
  return (
    <div className="w-auto h-auto p-4 flex inline-flex overflow-hidden gap-4">
      <div>
        <button className="text-sm font-medium font-['GIP'] leading-tight" onClick={() => router.push('/admin/order')}>
          Захиалга
        </button>
      </div>
      <div>
        <button className="text-sm font-medium font-['GIP'] leading-tight" onClick={() => router.push('/admin/category')}>
          Цэс
        </button>
      </div>
      <div>
        <button className="text-sm font-medium font-['GIP'] leading-tight" onClick={() => router.push('/admin/food')}>
          Хоол
        </button>
      </div>
      <div>
        <button className="text-sm font-medium font-['GIP'] leading-tight" onClick={() => router.push('/admin/tables')}>
          Ширээ
        </button>
      </div>
    </div>
  );
};
