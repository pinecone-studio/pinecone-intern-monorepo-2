"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { LuCirclePlus } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";

type Checked = DropdownMenuCheckboxItemProps["checked"];

const RequestCategory = () => {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false);
  const [showPanel, setShowPanel] = React.useState<Checked>(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-sm font-medium text-[#18181B]">
        <FaPlus className="mr-2" size={16}/>
          Төлөв
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={setShowStatusBar}
          className="flex justify-between text-sm text-[#09090B]"
        >
          <p>Баталгаажсан</p>
          <p>21</p>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showActivityBar}
          onCheckedChange={setShowActivityBar}
          // disabled
          className="flex justify-between text-sm text-[#09090B]"
        >
          <p>Хүлээгдэж байна</p>
          <p>21</p>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showPanel}
          onCheckedChange={setShowPanel}
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
