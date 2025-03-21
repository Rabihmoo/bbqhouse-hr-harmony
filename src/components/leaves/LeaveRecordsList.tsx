
import { DataTable } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";
import { departmentColors } from "@/lib/data";
import { format, parseISO } from "date-fns";
import { LeaveRecord } from "@/types/notification";

interface LeaveRecordsListProps {
  records: LeaveRecord[];
}

const LeaveRecordsList = ({ records }: LeaveRecordsListProps) => {
  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Leave Records</h2>
      
      {sortedRecords.length === 0 ? (
        <div className="bg-white dark:bg-black/40 rounded-lg p-6 text-center">
          <p className="text-muted-foreground">No leave records found.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-black/40 glass rounded-xl shadow-sm overflow-hidden">
          <DataTable
            data={sortedRecords}
            columns={[
              {
                key: "employeeName",
                header: "Employee",
              },
              {
                key: "year",
                header: "Year",
                render: (row) => (
                  <span className="font-medium">{row.year}</span>
                ),
              },
              {
                key: "type",
                header: "Type",
                render: (row) => (
                  <span className="capitalize">{row.type}</span>
                ),
              },
              {
                key: "startDate",
                header: "Period",
                render: (row) => (
                  <span>
                    {format(parseISO(row.startDate), "dd/MM/yyyy")} - {format(parseISO(row.endDate), "dd/MM/yyyy")}
                  </span>
                ),
              },
              {
                key: "days",
                header: "Days",
                render: (row) => (
                  <span className="font-medium">{row.days}</span>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (row) => (
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs text-white",
                    row.status === 'completed' ? "bg-green-500" : "bg-blue-500"
                  )}>
                    {row.status === 'completed' ? "Completed" : "Scheduled"}
                  </span>
                ),
              },
              {
                key: "notes",
                header: "Notes",
                render: (row) => (
                  <span className="text-sm text-muted-foreground">{row.notes || "-"}</span>
                ),
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default LeaveRecordsList;
