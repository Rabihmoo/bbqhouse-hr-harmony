
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { leaveRequests as leaveRequestsData, departmentColors, statusColors } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LeaveRequest, LeaveStatus } from "@/lib/data";

const Leaves = () => {
  const [leaveRequests, setLeaveRequests] = useState(leaveRequestsData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLeaveRequest, setEditingLeaveRequest] = useState<LeaveRequest | null>(null);
  const { toast } = useToast();

  const handleAddLeaveRequest = (data: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>) => {
    const newLeaveRequest: LeaveRequest = {
      ...data,
      id: String(leaveRequests.length + 1),
      status: 'Pending' as LeaveStatus,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setLeaveRequests([...leaveRequests, newLeaveRequest]);
    toast({
      title: "Leave request added",
      description: `Leave request has been successfully submitted.`,
    });
  };

  const handleUpdateStatus = (id: string, newStatus: LeaveStatus) => {
    const updatedLeaveRequests = leaveRequests.map(request => 
      request.id === id ? { ...request, status: newStatus } : request
    );
    
    setLeaveRequests(updatedLeaveRequests);
    toast({
      title: "Status updated",
      description: `Leave request status has been updated to ${newStatus}.`,
    });
  };

  return (
    <DashboardLayout title="Leave Management" subtitle="Manage employee leave requests">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Leave Requests</h2>
          <p className="text-muted-foreground">
            Total {leaveRequests.length} leave requests
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      <div className="bg-white dark:bg-black/40 glass rounded-xl shadow-sm overflow-hidden">
        <DataTable
          data={leaveRequests}
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
              key: "type",
              header: "Leave Type",
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
            {
              key: "createdAt",
              header: "Request Date",
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
};

export default Leaves;
