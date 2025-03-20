
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { departmentColors, leaveRequests as leaveRequestsData, statusColors } from "@/lib/data";
import { cn } from "@/lib/utils";
import LeaveRequestForm from "@/components/leaves/LeaveRequestForm";
import { useToast } from "@/hooks/use-toast";

const Leaves = () => {
  const [leaveRequests, setLeaveRequests] = useState(leaveRequestsData);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const { toast } = useToast();

  const handleAddLeaveRequest = (data: any) => {
    const employee = data.employeeId;
    const newLeaveRequest = {
      id: String(leaveRequests.length + 1),
      employeeId: employee.id,
      employeeName: employee.fullName,
      department: employee.department,
      startDate: data.startDate,
      endDate: data.endDate,
      type: data.type,
      status: "Pending",
      reason: data.reason,
      createdAt: new Date().toISOString().split('T')[0],
      documentUrl: data.documentFile ? URL.createObjectURL(data.documentFile) : undefined,
    };
    
    setLeaveRequests([...leaveRequests, newLeaveRequest]);
    toast({
      title: "Leave request submitted",
      description: "The leave request has been submitted successfully.",
    });
  };

  const handleStatusChange = (leaveId: string, newStatus: string) => {
    const updatedLeaveRequests = leaveRequests.map(leave => 
      leave.id === leaveId ? { ...leave, status: newStatus } : leave
    );
    
    setLeaveRequests(updatedLeaveRequests);
    toast({
      title: "Status updated",
      description: `Leave request status changed to ${newStatus}.`,
    });
  };

  return (
    <DashboardLayout 
      title="Leave Management" 
      subtitle="Track and manage employee leave requests"
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Leave Requests</h2>
          <p className="text-muted-foreground">
            Manage employee leave applications and approvals
          </p>
        </div>
        <Button onClick={() => setShowRequestForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Leave Request
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
              key: "actions",
              header: "Actions",
              render: (row) => (
                <div className="flex items-center gap-2">
                  {row.status === "Pending" && (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        className="h-8 bg-green-500 hover:bg-green-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(row.id, "Approved");
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="h-8 bg-red-500 hover:bg-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(row.id, "Rejected");
                        }}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  
                  {row.status === "Approved" && (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 bg-purple-500 hover:bg-purple-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(row.id, "Completed");
                      }}
                    >
                      Mark Completed
                    </Button>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>

      <LeaveRequestForm
        open={showRequestForm}
        onClose={() => setShowRequestForm(false)}
        onSubmit={handleAddLeaveRequest}
      />
    </DashboardLayout>
  );
};

export default Leaves;
