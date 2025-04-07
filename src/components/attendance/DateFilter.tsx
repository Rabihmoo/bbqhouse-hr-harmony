
import React from 'react';
import { Button } from "@/components/ui/button";
import { format, subDays, addDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DateFilterProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const DateFilter = ({ selectedDate, setSelectedDate }: DateFilterProps) => {
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {format(selectedDate, "PPP")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Button 
        variant="outline" 
        onClick={() => setSelectedDate(subDays(selectedDate, 1))}
      >
        Previous
      </Button>
      <Button 
        variant="outline" 
        onClick={() => setSelectedDate(addDays(selectedDate, 1))}
      >
        Next
      </Button>
    </div>
  );
};
