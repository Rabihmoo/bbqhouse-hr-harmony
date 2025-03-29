
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Check, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeaveRecord } from "@/types/notification";
import { toast } from "sonner";

interface LeaveRequestsProps {
  leaveRecords: LeaveRecord[];
  setLeaveRecords: React.Dispatch<React.SetStateAction<LeaveRecord[]>>;
  filteredLeaveRecords: LeaveRecord[];
}

const LeaveRequests = ({ leaveRecords, setLeaveRecords, filteredLeaveRecords }: LeaveRequestsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={filteredLeaveRecords}
          columns={[
            {
              key: "employeeName",
              header: "Employee",
            },
            {
              key: "type",
              header: "Leave Type",
              render: (row) => (
                <span className="capitalize">{row.type}</span>
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
              key: "days",
              header: "Days",
              render: (row) => (
                <span>{row.days} {row.days === 1 ? 'day' : 'days'}</span>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (row) => (
                <div className="flex items-center">
                  {row.status === "completed" ? (
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <Clock className="h-4 w-4 text-amber-500 mr-2" />
                  )}
                  <span className="capitalize">{row.status}</span>
                </div>
              ),
            },
            {
              key: "actions",
              header: "",
              render: (row) => (
                <div className="flex items-center space-x-2">
                  {row.status === "scheduled" && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center h-8 px-2 text-green-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updatedRecords = leaveRecords.map(rec =>
                            rec.id === row.id ? { ...rec, status: "completed" as const } : rec
                          );
                          setLeaveRecords(updatedRecords);
                          localStorage.setItem('bbq-leave-records', JSON.stringify(updatedRecords));
                          toast.success("Leave status updated to completed");
                        }}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        <span className="sr-only sm:not-sr-only sm:inline-block">Complete</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center h-8 px-2 text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updatedRecords = leaveRecords.filter(rec => rec.id !== row.id);
                          setLeaveRecords(updatedRecords);
                          localStorage.setItem('bbq-leave-records', JSON.stringify(updatedRecords));
                          toast.success("Leave request deleted");
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        <span className="sr-only sm:not-sr-only sm:inline-block">Cancel</span>
                      </Button>
                    </>
                  )}
                </div>
              ),
            },
          ]}
          searchable
          pagination
        />
      </CardContent>
    </Card>
  );
};

export default LeaveRequests;
