
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanySelector } from "../employees/form/CompanySelector";

export interface AttendanceTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeCompany: string | null;
  setActiveCompany: (company: string | null) => void;
}

export function AttendanceTabs({
  activeTab,
  setActiveTab,
  activeCompany,
  setActiveCompany
}: AttendanceTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3">
      <TabsList className="mb-2 sm:mb-0">
        <TabsTrigger value="daily">Daily Attendance</TabsTrigger>
        <TabsTrigger value="report">Attendance Report</TabsTrigger>
        <TabsTrigger value="add">Add Attendance</TabsTrigger>
        <TabsTrigger value="history">Monthly History</TabsTrigger>
      </TabsList>
      
      <CompanySelector 
        label=""
        value={activeCompany || ''}
        onChange={(value) => setActiveCompany(value || null)}
        className="min-w-[200px]"
      />
    </div>
  );
}
