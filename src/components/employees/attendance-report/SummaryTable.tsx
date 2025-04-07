
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AttendanceReport, formatTime } from "@/utils/attendanceProcessor";
import { format } from "date-fns";

interface SummaryTableProps {
  reportData: AttendanceReport;
}

export function SummaryTable({ reportData }: SummaryTableProps) {
  return (
    <>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Attendance Summary Report</h3>
        <p className="text-sm text-muted-foreground">
          Generated on {format(new Date(reportData.reportDate), 'dd/MM/yyyy')}
        </p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="text-right">Working Days</TableHead>
            <TableHead className="text-right">Total Hours</TableHead>
            <TableHead className="text-right">Extra Hours</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportData.employeeReports.map((report) => (
            <TableRow key={report.employeeId}>
              <TableCell className="font-medium">{report.employeeName}</TableCell>
              <TableCell>{report.department}</TableCell>
              <TableCell className="text-right">{report.workingDays}</TableCell>
              <TableCell className="text-right">{formatTime(report.totalHours)}</TableCell>
              <TableCell className="text-right">{formatTime(report.extraHours)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
