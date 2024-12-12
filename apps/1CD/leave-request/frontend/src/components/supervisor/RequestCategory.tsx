'use client';

import * as React from 'react';
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FaPlus } from 'react-icons/fa';

type Checked = DropdownMenuCheckboxItemProps['checked'];

const RequestCategory = () => {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(false);
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false);
  const [showPanel, setShowPanel] = React.useState<Checked>(false);
  const [isChecked, setIsChecked] = React.useState<string[]>([]); // Array to store checked categories

  console.log(isChecked);

  const handleCheckedChange = (value: string, isChecked: boolean) => {
    if (isChecked) {
      // Add category to isChecked array if it is checked
      setIsChecked((prev) => [...prev, value]);
    } else {
      // Remove category from isChecked array if it is unchecked
      setIsChecked((prev) => prev.filter((item) => item !== value));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      {
  isChecked.length === 0 ? (
    <div className="flex">
      <Button variant="outline" className="text-sm font-medium text-[#18181B]">
        <FaPlus className="mr-2" size={16} />
        Төлөв
      </Button>
    </div>
  ) : isChecked.length < 3 ? (
    <div className="flex">
      <Button variant="outline" className="text-sm font-medium text-[#18181B] border-r-0 rounded-r-none">
        <FaPlus className="mr-2" size={16} />
        Төлөв
      </Button>
      <div className="flex pl-2 gap-1 bg-white items-center pr-4 border-[1px] rounded-r-md">
        {isChecked.map((cat, index) => (
          <p
            key={index}
            className="bg-[#F4F4F5] rounded-sm px-1 py-[2px] text-xs text-[#09090B] h-5"
          >
            {cat}
          </p>
        ))}
      </div>
    </div>
  ) : (
    <div className="flex">
      <Button variant="outline" className="text-sm font-medium text-[#18181B] border-r-0 rounded-r-none">
        <FaPlus className="mr-2" size={16} />
        Төлөв
      </Button>
      <div className="flex pl-2 gap-1 bg-white items-center pr-4 border-[1px] rounded-r-md">
        <p className="bg-[#F4F4F5] rounded-sm px-1 py-[2px] text-xs text-[#09090B] h-5">
          3 сонгогдсон
        </p>
      </div>
    </div>
  )
}

      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={(checked) => {
            setShowStatusBar(checked);
            handleCheckedChange('Баталгаажсан', checked);
          }}
          className="flex justify-between text-sm text-[#09090B]"
        >
          <p>Баталгаажсан</p>
          <p>21</p>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showActivityBar}
          onCheckedChange={(checked) => {
            setShowActivityBar(checked);
            handleCheckedChange('Хүлээгдэж байна', checked);
          }}
          className="flex justify-between text-sm text-[#09090B]"
        >
          <p>Хүлээгдэж байна</p>
          <p>21</p>
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={showPanel}
          onCheckedChange={(checked) => {
            setShowPanel(checked);
            handleCheckedChange('Татгалзсан', checked);
          }}
          className="flex justify-between text-sm text-[#09090B]"
        >
          <p>Татгалзсан</p>
          <p>28</p>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RequestCategory;
