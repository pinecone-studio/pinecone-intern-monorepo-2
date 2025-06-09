"use client"
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import CoverImage from "../../../public/Cover Image.png"
import { Badge } from "@/components/ui/badge"
import { Star } from 'lucide-react';
const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]
const FilteredHotels = () => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    return (
        <div className="h-full flex-1 flex flex-col gap-4">
            <div className="flex gap-2 justify-between">
                <p className="flex items-center text-[15px]">51 properties</p>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[240px] justify-between"
                    >
                        {value
                        ? frameworks.find((framework) => framework.value === value)?.label
                        : "Recommended"}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px] p-0">
                    <Command >
                        <CommandInput placeholder="Recommended" className="h-9" />
                        <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {frameworks.map((framework) => (
                            <CommandItem 
                                key={framework.value}
                                value={framework.value}
                                onSelect={(currentValue) => {
                                setValue(currentValue === value ? "" : currentValue)
                                setOpen(false)
                                }}
                            >
                                {framework.label}
                                <Check
                                className={(
                                    value === framework.value ? "opacity-100" : "opacity-0"
                                )}
                                />
                            </CommandItem>
                            ))}
                        </CommandGroup>
                        </CommandList>
                    </Command>
                    </PopoverContent>
                </Popover>
            </div>
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="border rounded-lg shadow-sm flex">
                    <img src={CoverImage.src} alt="Hotel Cover" className="w-[395px] h-[220px] rounded-lg" />
                    <div className="p-4 h-full flex-1">
                        <div className="w-full h-full flex ">
                          <div className="h-full flex flex-col justify-between">
                            <div className="flex flex-col gap-2">
                              <h1 className="text-[16px] font-semibold">Tokoyo Inn Ulaanbaatar </h1>
                              <div className="flex gap-2">
                                <Star className="w-4 h-4 fill-yellow-500 stroke-yellow-500" />
                                <Star className="w-4 h-4 fill-yellow-500 stroke-yellow-500" />
                                <Star className="w-4 h-4 fill-yellow-500 stroke-yellow-500" />
                                <Star className="w-4 h-4 fill-yellow-500 stroke-yellow-500" />
                                <Star className="w-4 h-4 fill-yellow-500 stroke-yellow-500" />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge
                                className="h-5 min-w-5 rounded-full px-1 bg-[#2563EB]"
                                variant="destructive"
                              >
                              9.9
                              </Badge>
                              <p className="text-[14px]">Excellent</p>
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col justify-end items-end">
                            <p className="text-[12px] text-[#71717A]">Per Night</p>
                            <p className="text-[20px]">150,000$</p>
                            <p className="text-[12px]">210,000$ total</p>
                          </div>
                      </div>
                    </div>
                   </div>
                 ))}
              </div>
            </div>
        </div>
    );
}
export default FilteredHotels;