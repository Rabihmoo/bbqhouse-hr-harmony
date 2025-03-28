
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCards from "@/components/dashboard/StatsCards";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { 
  departmentColors, 
  employees, 
  leaveRequests, 
  statusColors 
} from "@/lib/data";
import { Calendar, Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface IndexProps {
  onLogout?: () => void;
}

const Index = ({ onLogout }: IndexProps) => {
  const navigate = useNavigate();
  
  // Filter only active employees
  const activeEmployees = employees
    .filter(emp => emp.status === 'Active')
    .slice(0, 5);
  
  // Latest leave requests for dashboard - filter for active employees only
  const activeEmployeeIds = employees
    .filter(emp => emp.status === 'Active' || emp.status === 'On Leave')
    .map(emp => emp.id);
    
  const latestLeaveRequests = leaveRequests
    .filter(req => activeEmployeeIds.includes(req.employeeId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Welcome to BBQHOUSE HR Management"
      onLogout={onLogout}
    >
      <div className="space-y-8">
        <StatsCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Leave Requests */}
          <div className="bg-white dark:bg-black/40 glass rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="bg-bbqred p-2 rounded-lg text-white">
                  <Calendar className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold">Recent Leave Requests</h2>
              </div>
              <Button onClick={() => navigate('/leaves')}>View All</Button>
            </div>
            
            <DataTable
              data={latestLeaveRequests}
              columns={[
                {
                  key: "employeeName",
                  header: "Employee",
                },
                {
                  key: "department",
                  header: "Department",
                  render: (row) => (
                    <div className="flex items-center">
                      <span className={cn("w-2 h-2 rounded-full mr-2", departmentColors[row.department])}></span>
                      {row.department}
                    </div>
                  ),
                },
                {
                  key: "startDate",
                  header: "Start Date",
                },
                {
                  key: "endDate",
                  header: "End Date",
                },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => (
                    <span className={cn("px-2 py-1 rounded-full text-xs text-white", statusColors[row.status])}>
                      {row.status}
                    </span>
                  ),
                },
              ]}
              searchable={false}
              pagination={false}
              onRowClick={(row) => navigate(`/leaves`)}
            />
          </div>
          
          {/* Active Employees */}
          <div className="bg-white dark:bg-black/40 glass rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="bg-bbqred p-2 rounded-lg text-white">
                  <Users className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold">Active Employees</h2>
              </div>
              <Button onClick={() => navigate('/employees')}>View All</Button>
            </div>
            
            <DataTable
              data={activeEmployees}
              columns={[
                {
                  key: "fullName",
                  header: "Name",
                },
                {
                  key: "position",
                  header: "Position",
                },
                {
                  key: "department",
                  header: "Department",
                  render: (row) => (
                    <div className="flex items-center">
                      <span className={cn("w-2 h-2 rounded-full mr-2", departmentColors[row.department])}></span>
                      {row.department}
                    </div>
                  ),
                },
                {
                  key: "remainingLeaves",
                  header: "Remaining Leaves",
                  render: (row) => (
                    <span>
                      {row.remainingLeaves} days
                    </span>
                  ),
                },
              ]}
              searchable={false}
              pagination={false}
              onRowClick={(row) => navigate(`/employees`)}
            />
          </div>
        </div>
        
        {/* Department Summary - Only count active employees */}
        <div className="bg-white dark:bg-black/40 glass rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Department Summary</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6">
            {['Kitchen', 'Sala', 'Bar', 'Cleaning', 'Takeaway'].map((dept) => {
              const activeEmpInDept = employees.filter(emp => 
                emp.department === dept && (emp.status === 'Active' || emp.status === 'On Leave')
              );
              return (
                <div key={dept} className="bg-background/50 rounded-lg p-5 card-hover">
                  <div className="flex justify-between items-start mb-4">
                    <span className={cn("px-2 py-1 rounded-full text-xs text-white", departmentColors[dept])}>
                      {dept}
                    </span>
                    <span className="text-2xl font-bold">{activeEmpInDept.length}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Active: {activeEmpInDept.filter(emp => emp.status === 'Active').length}</p>
                    <p>On Leave: {activeEmpInDept.filter(emp => emp.status === 'On Leave').length}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
