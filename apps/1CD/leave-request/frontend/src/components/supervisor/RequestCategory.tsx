'use client';

import * as React from 'react';
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FaPlus } from 'react-icons/fa';
import { useGroupedByStatusRequestLengthQuery } from '@/generated';
import { filterProps } from './RequestHeader';
type Checked = DropdownMenuCheckboxItemProps['checked'];

// eslint-disable-next-line no-unused-vars, complexity
const RequestCategory = ({ onChange, email, filter }: { email: string; filter: filterProps; onChange: (arg0: string[]) => void }) => {
  const filterCopy = { ...filter };
  delete filterCopy.status;
  const { data } = useGroupedByStatusRequestLengthQuery({ variables: { supervisorEmail: email, ...filterCopy } });

  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(false);
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false);
  const [showPanel, setShowPanel] = React.useState<Checked>(false);
  const [isChecked, setIsChecked] = React.useState<string[]>([]);

  const handleCheckedChange = (value: string, isChecked: boolean) => {
    if (isChecked) {
      setIsChecked((prev) => [...prev, value]);
      change(value);
    } else {
      setIsChecked((prev) => prev.filter((item) => item !== value));
      change(value);
    }
  };

  const change = (value: string) => {
    if (isChecked.includes(value)) {
      const filtered = transform([...isChecked, value].filter((ele: string) => ele != value));
      onChange(filtered);
    } else {
      onChange(transform([...isChecked, value]));
    }
  };

  const transform = (elements: string[]) => {
    const result = [];
    for (let i = 0; i < elements.length; i++) {
      if (elements[i] == 'Хүлээгдэж байна') {
        result.push('pending');
        result.push('sent');
      }
      if (elements[i] == 'Татгалзсан') result.push('failed');
      if (elements[i] == 'Баталгаажсан') result.push('success');
    }
    return result;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isChecked.length === 0 ? (
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
                <p key={index} className="bg-[#F4F4F5] rounded-sm px-1 py-[2px] text-xs text-[#09090B] h-5">
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
              <p className="bg-[#F4F4F5] rounded-sm px-1 py-[2px] text-xs text-[#09090B] h-5">3 сонгогдсон</p>
            </div>
          </div>
        )}
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
          <p>{data?.groupedByStatusRequestLength?.find((item) => item._id === 'success')?.res || '0'}</p>
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
          <p>{(Number(data?.groupedByStatusRequestLength?.find((item) => item._id === 'pending')?.res || '0')) + (Number(data?.groupedByStatusRequestLength?.find((item) => item._id === 'sent')?.res || 0))}</p>
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
          <p>{data?.groupedByStatusRequestLength?.find((item) => item._id === 'failed')?.res || '0'}</p>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RequestCategory;
