
import React from 'react';
import { DataTable } from "@/components/ui/data-table";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AttendanceRecord } from '@/types/attendance';

interface AttendanceTableProps {
  filteredDailyRecords: AttendanceRecord[];
  onEditRecord: (record: AttendanceRecord) => void;
}

export const AttendanceTable = ({
  filteredDailyRecords,
  onEditRecord
}: AttendanceTableProps) => {
  return (
    <DataTable
      data={filteredDailyRecords}
      columns={[
        {
          key: "employeeName",
          header: "Employee",
          render: (row) => (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              {row.employeeName}
            </div>
          ),
        },
        {
          key: "clockIn",
          header: "Clock In",
          render: (row) => (
            <div>
              {row.status === 'absent' ? (
                <span className="text-red-500">Absent</span>
              ) : (
                row.clockIn
              )}
            </div>
          ),
        },
        {
          key: "clockOut",
          header: "Clock Out",
          render: (row) => (
            <div>
              {row.status === 'absent' ? (
                <span>-</span>
              ) : (
                row.clockOut
              )}
            </div>
          ),
        },
        {
          key: "totalHours",
          header: "Total Hours",
          render: (row) => (
            <div>
              {row.status === 'absent' ? (
                <span>0</span>
              ) : (
                `${row.totalHours} hrs`
              )}
            </div>
          ),
        },
        {
          key: "status",
          header: "Status",
          render: (row) => (
            <div className={cn(
              "px-2 py-1 rounded-full text-xs inline-block",
              row.status === 'present' ? "bg-green-100 text-green-800" :
              row.status === 'absent' ? "bg-red-100 text-red-800" :
              row.status === 'late' ? "bg-amber-100 text-amber-800" :
              "bg-blue-100 text-blue-800"
            )}>
              <span className="capitalize">{row.status}</span>
            </div>
          ),
        },
        {
          key: "notes",
          header: "Notes",
          render: (row) => (
            <div>
              {row.notes || "-"}
            </div>
          ),
        },
        {
          key: "actions",
          header: "",
          render: (row) => (
            <Button 
              variant="outline" 
              size="sm"
              className="h-8"
              onClick={() => onEditRecord(row)}
            >
              Edit
            </Button>
          ),
        },
      ]}
      searchable
      pagination
    />
  );
};
