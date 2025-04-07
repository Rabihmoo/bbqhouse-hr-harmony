
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CalendarDays, FileText, FileUp } from "lucide-react";
import { DateFilter } from './DateFilter';

interface AttendanceTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  activeCompany: string;
  setActiveCompany: (value: string) => void;
  selectedDate?: Date;
  setSelectedDate?: (date: Date) => void;
}

export const AttendanceTabs = ({
  activeTab,
  setActiveTab,
  activeCompany,
  setActiveCompany
}: AttendanceTabsProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <TabsList>
        <TabsTrigger value="daily" onClick={() => setActiveTab("daily")}>
          <CalendarDays className="h-4 w-4 mr-2" />
          Daily Attendance
        </TabsTrigger>
        <TabsTrigger value="report" onClick={() => setActiveTab("report")}>
          <FileText className="h-4 w-4 mr-2" />
          Attendance Report
        </TabsTrigger>
        <TabsTrigger value="add" onClick={() => setActiveTab("add")}>
          <FileUp className="h-4 w-4 mr-2" />
          Add Attendance
        </TabsTrigger>
      </TabsList>
      
      <div className="flex items-center gap-2">
        <Label htmlFor="company-filter">Filter by company:</Label>
        <Select
          value={activeCompany}
          onValueChange={setActiveCompany}
        >
          <SelectTrigger id="company-filter" className="w-[180px]">
            <SelectValue placeholder="Select company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            <SelectItem value="bbqhouse">BBQHouse LDA</SelectItem>
            <SelectItem value="salt">SALT LDA</SelectItem>
            <SelectItem value="executive">Executive Cleaning LDA</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
