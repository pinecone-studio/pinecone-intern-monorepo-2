import { Skeleton } from '@/components/ui/skeleton';
const SkeletonCard = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="w-full aspect-video  bg-slate-600" />
      <div className="space-y-2 h-[150px] flex flex-col items-center">
        <Skeleton className="h-2 w-[80%]  bg-slate-600" />
        <Skeleton className="h-2 w-[80%]  bg-slate-600" />
        <Skeleton className="h-2 w-[80%]  bg-slate-600" />
        <Skeleton className="h-2 w-[80%]  bg-slate-600" />
      </div>
    </div>
  );
};
export default SkeletonCard;
