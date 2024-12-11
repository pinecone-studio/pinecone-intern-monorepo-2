"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "../../../../../../../libs/shadcn/src/lib/utils"
import { Button } from "../../../../../../../libs/shadcn/src/lib/ui/button"
import { Calendar } from "../../../../../../../libs/shadcn/src/lib/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../../../libs/shadcn/src/lib/ui/popover"
import { FormikProps } from "formik"
import { RequestFormValues } from "@/app/(main)/createNewRequest/CreateNewRequest"

export const DatePickerDemo = ({formik} : {formik: FormikProps<RequestFormValues>}) => {
  const {requestDate} = formik.values
  const today = new Date()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-between text-left font-normal",
            !requestDate && "text-muted-foreground"
          )}
        >
         
          {requestDate ? format(requestDate, "P") : format(today, 'P')}
          <CalendarIcon size={16}/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={requestDate}
          onSelect={(e) => formik.setFieldValue("requestDate", e)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
