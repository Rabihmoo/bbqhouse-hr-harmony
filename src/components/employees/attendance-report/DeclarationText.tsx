
import { formatTime } from "@/utils/attendance/timeCalculations";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { generateDeclarationText, generateSignatureText } from "@/utils/attendance/declarationGenerator";

interface DeclarationTextProps {
  employeeName: string;
  biNumber: string;
  companyName: string;
  month: string;
  year: string;
  attendanceRecords: {
    date: string;
    clockIn: string;
    clockOut: string;
    workTime: string;
    extraHours: string;
  }[];
  totalHours: number;
  extraHours: number;
  workingDays: number;
}

export function DeclarationText({
  employeeName,
  biNumber,
  companyName,
  month,
  year,
  attendanceRecords,
  totalHours,
  extraHours,
  workingDays
}: DeclarationTextProps) {
  return (
    <div className="border rounded-lg p-6 space-y-6 print:border-none print:p-0">
      <div className="text-center mb-4 space-y-4">
        <div className="text-left whitespace-pre-line">
          {generateDeclarationText(employeeName, biNumber, companyName, month, year)}
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Clock In</TableHead>
            <TableHead>Clock Out</TableHead>
            <TableHead>Work Time</TableHead>
            <TableHead>Extra Hours</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceRecords.map((record, idx) => (
            <TableRow key={idx}>
              <TableCell>{employeeName}</TableCell>
              <TableCell>{record.date}</TableCell>
              <TableCell>{record.clockIn}</TableCell>
              <TableCell>{record.clockOut}</TableCell>
              <TableCell>{record.workTime}</TableCell>
              <TableCell>{record.extraHours}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <tfoot className="border-t bg-muted/50 font-medium [&>tr]:last:border-b-0">
          <TableRow>
            <TableCell colSpan={4} className="text-right font-bold">WORKING HOURS:</TableCell>
            <TableCell className="font-bold">{formatTime(totalHours)}</TableCell>
            <TableCell className="font-bold">{formatTime(extraHours)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4} className="text-right font-bold">WORKING DAYS:</TableCell>
            <TableCell colSpan={2} className="font-bold">{workingDays}</TableCell>
          </TableRow>
        </tfoot>
      </Table>
      
      <div className="pt-8 pb-8">
        <div className="text-left whitespace-pre-line">
          {generateSignatureText()}
        </div>
      </div>
    </div>
  );
}
