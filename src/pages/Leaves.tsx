
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, FileText, Clock } from "lucide-react";
import { useEmployeeData } from "@/hooks/use-employee-data";
import { LeaveRecord } from "@/types/notification";

// Import the new components
import LeaveRequests from '@/components/leaves/LeaveRequests';
import LeaveAllowances from '@/components/leaves/LeaveAllowances';
import NewLeaveRequest from '@/components/leaves/NewLeaveRequest';
import CompanyFilter from '@/components/leaves/CompanyFilter';

interface LeavesProps {
  onLogout?: () => void;
}

const Leaves = ({ onLogout }: LeavesProps) => {
  const [activeTab, setActiveTab] = useState("requests");
  const [activeCompany, setActiveCompany] = useState<string>("all");
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const { employees } = useEmployeeData();
  
  // Load leave data
  useEffect(() => {
    const loadLeaveData = () => {
      // Check if we have stored leave records
      const storedLeaveRecords = localStorage.getItem('bbq-leave-records');
      if (storedLeaveRecords) {
        setLeaveRecords(JSON.parse(storedLeaveRecords));
      } else {
        // Generate some sample leave records if none exist
        const sampleRecords: LeaveRecord[] = [];
        
        employees.forEach(employee => {
          if (employee.status === 'Active') {
            // Create a random completed leave for each active employee
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 3));
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1);
            
            sampleRecords.push({
              id: `leave-${employee.id}-${Date.now()}`,
              employeeId: employee.id,
              employeeName: employee.fullName,
              startDate: new Date(startDate).toISOString().split('T')[0],
              endDate: new Date(endDate).toISOString().split('T')[0],
              days: Math.floor(Math.random() * 5) + 1,
              type: "annual",
              status: "completed",
              year: new Date().getFullYear(),
              notes: "Annual leave"
            });
          }
        });
        
        setLeaveRecords(sampleRecords);
        localStorage.setItem('bbq-leave-records', JSON.stringify(sampleRecords));
      }
    };
    
    loadLeaveData();
  }, [employees]);
  
  // Filter leave records by company
  const filteredLeaveRecords = activeCompany === 'all' 
    ? leaveRecords 
    : leaveRecords.filter(record => {
        const employee = employees.find(emp => emp.id === record.employeeId);
        return employee?.company?.toLowerCase().includes(activeCompany);
      });

  return (
    <DashboardLayout 
      title="Leaves" 
      subtitle="Manage employee leave requests"
      onLogout={onLogout}
    >
      <div className="space-y-6">
        <Tabs defaultValue="requests" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <TabsList>
              <TabsTrigger value="requests">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Leave Requests
              </TabsTrigger>
              <TabsTrigger value="allowances">
                <FileText className="h-4 w-4 mr-2" />
                Leave Allowances
              </TabsTrigger>
              <TabsTrigger value="new">
                <Clock className="h-4 w-4 mr-2" />
                New Request
              </TabsTrigger>
            </TabsList>
            
            <CompanyFilter 
              activeCompany={activeCompany} 
              onCompanyChange={setActiveCompany} 
            />
          </div>
          
          <TabsContent value="requests" className="mt-0 space-y-6">
            <LeaveRequests 
              leaveRecords={leaveRecords}
              setLeaveRecords={setLeaveRecords}
              filteredLeaveRecords={filteredLeaveRecords}
            />
          </TabsContent>
          
          <TabsContent value="allowances" className="mt-0 space-y-6">
            <LeaveAllowances 
              employees={employees}
              activeCompany={activeCompany}
            />
          </TabsContent>
          
          <TabsContent value="new" className="mt-0 space-y-6">
            <NewLeaveRequest 
              employees={employees}
              leaveRecords={leaveRecords}
              setLeaveRecords={setLeaveRecords}
              onSuccess={() => setActiveTab("requests")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Leaves;
