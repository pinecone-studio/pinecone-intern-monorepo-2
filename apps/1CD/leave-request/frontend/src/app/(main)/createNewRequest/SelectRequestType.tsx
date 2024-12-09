import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const SelectRequestType = () => {
  return (
    <>
      <div className="text-[#000000] text-sm">Ангилал*</div>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Сонгоно уу" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="Чөлөө">Чөлөө</SelectItem>
            <SelectItem value="Цалинтай чөлөө">Цалинтай чөлөө</SelectItem>
            <SelectItem value="Зайнаас ажиллах">Зайнаас ажиллах</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="flex items-center gap-1 justify-end">
        <div className="text-xs text-[#71717A]">Боломжит хугацаа:</div>
        <div className="text-sm font-sans text-[#000000] ">- хоног</div>
      </div>
    </>
  );
};
