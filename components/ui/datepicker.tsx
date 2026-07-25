"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Field, FieldLabel } from "@/components/ui/field"

interface DatePickerProps {
  label: string;
  name: string;
  isInvalid: boolean;
  isSuccess: boolean;
  dateValue: Date | undefined;
  onChange: (date: Date | undefined) => void;
}
export function DatePicker({ label, name, isInvalid, isSuccess, dateValue, onChange }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const selectDate = (date: Date | undefined) => {
    setOpen(false)
    onChange(date)
  }

  return (
    <Field className="mx-auto w-full">
      <FieldLabel htmlFor="date">{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={name}
            size="xl"
            className="justify-start font-normal"
          >
            {dateValue ? dateValue.toLocaleDateString() : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            defaultMonth={dateValue}
            captionLayout="dropdown"
            onSelect={selectDate}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
