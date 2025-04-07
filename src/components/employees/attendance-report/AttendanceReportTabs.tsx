
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SummaryReportContent } from "./SummaryReportContent";
import { IndividualReportContent } from "./IndividualReportContent";
import { AttendanceReport } from "@/utils/attendanceProcessor";

interface AttendanceReportTabsProps {
  currentView: "summary" | "individual";
  setCurrentView: (view: "summary" | "individual") => void;
  reportData: AttendanceReport;
  selectedEmployee: string;
  setSelectedEmployee: (value: string) => void;
  companyName: string;
  month: string;
  year: string;
}

export function AttendanceReportTabs({
  currentView,
  setCurrentView,
  reportData,
  selectedEmployee,
  setSelectedEmployee,
  companyName,
  month,
  year
}: AttendanceReportTabsProps) {
  return (
    <Tabs defaultValue={currentView} value={currentView} onValueChange={(value) => setCurrentView(value as "summary" | "individual")}>
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="summary">Summary Report</TabsTrigger>
        <TabsTrigger value="individual">Individual Declarations</TabsTrigger>
      </TabsList>
      
      <TabsContent value="summary" className="space-y-6">
        <SummaryReportContent reportData={reportData} />
      </TabsContent>
      
      <TabsContent value="individual" className="space-y-6">
        <IndividualReportContent
          reportData={reportData}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          companyName={companyName}
          month={month}
          year={year}
        />
      </TabsContent>
    </Tabs>
  );
}
