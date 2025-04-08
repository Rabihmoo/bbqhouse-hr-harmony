
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import AttendanceUploader from '@/components/employees/AttendanceUploader';
import { DailyAttendanceTab } from '@/components/attendance/DailyAttendanceTab';
import { AttendanceReportTab } from '@/components/attendance/AttendanceReportTab';
import { AddAttendanceTab } from '@/components/attendance/AddAttendanceTab';
import { AttendanceTabs } from '@/components/attendance/AttendanceTabs';
import { MonthlyHistoryTab } from '@/components/attendance/MonthlyHistoryTab';
import { useAttendanceState } from '@/hooks/use-attendance-state';

interface AttendanceProps {
  onLogout?: () => void;
}

const Attendance = ({ onLogout }: AttendanceProps) => {
  const {
    activeTab,
    setActiveTab,
    activeCompany,
    setActiveCompany,
    selectedDate,
    setSelectedDate,
    attendanceRecords,
    newAttendance,
    setNewAttendance,
    filteredDailyRecords,
    employeesWithoutAttendance,
    handleSubmitAttendance,
    employees
  } = useAttendanceState();
  
  return (
    <DashboardLayout 
      title="Attendance" 
      subtitle="Track and manage employee attendance"
      onLogout={onLogout}
    >
      <div className="space-y-6">
        <AttendanceUploader 
          onFileUploaded={(data) => {
            if (data && data.employeeReports) {
              toast.success("Attendance data processed successfully");
            }
          }}
        />
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <AttendanceTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            activeCompany={activeCompany} 
            setActiveCompany={setActiveCompany} 
          />
          
          <TabsContent value="daily" className="mt-0 space-y-6">
            <DailyAttendanceTab 
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              filteredDailyRecords={filteredDailyRecords}
              employeesWithoutAttendance={employeesWithoutAttendance}
              setActiveTab={setActiveTab}
              setNewAttendance={setNewAttendance}
            />
          </TabsContent>
          
          <TabsContent value="report" className="mt-0 space-y-6">
            <AttendanceReportTab 
              attendanceRecords={attendanceRecords} 
              activeCompany={activeCompany} 
              employees={employees} 
            />
          </TabsContent>
          
          <TabsContent value="add" className="mt-0 space-y-6">
            <AddAttendanceTab 
              newAttendance={newAttendance}
              setNewAttendance={setNewAttendance}
              employees={employees}
              activeCompany={activeCompany}
              handleSubmitAttendance={handleSubmitAttendance}
            />
          </TabsContent>
          
          <TabsContent value="history" className="mt-0 space-y-6">
            <MonthlyHistoryTab activeCompany={activeCompany} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
