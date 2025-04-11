
import { formatTime, formatDateInPortuguese } from "@/utils/attendance/timeCalculations";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { generateDeclarationText, generateSignatureText, getFormattedSignatureDate } from "@/utils/attendance/declarationGenerator";
import { format } from "date-fns";

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
    status?: string;
  }[];
  totalHours: string;
  extraHours: string;
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
  const formattedSignatureDate = getFormattedSignatureDate();
  
  return (
    <div className="border rounded-lg p-6 space-y-6 print:border-none print:p-0">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-4">DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS</h2>
        <div className="text-left whitespace-pre-line mb-8">
          {generateDeclarationText(employeeName, biNumber, companyName, month, year)}
        </div>
      </div>
      
      <Table className="border-collapse">
        <TableHeader>
          <TableRow className="border border-gray-300">
            <TableHead className="border border-gray-300 text-center font-bold bg-gray-50">Name</TableHead>
            <TableHead className="border border-gray-300 text-center font-bold bg-gray-50">Date</TableHead>
            <TableHead className="border border-gray-300 text-center font-bold bg-gray-50">Clock In</TableHead>
            <TableHead className="border border-gray-300 text-center font-bold bg-gray-50">Clock Out</TableHead>
            <TableHead className="border border-gray-300 text-center font-bold bg-gray-50">Work Time</TableHead>
            <TableHead className="border border-gray-300 text-center font-bold bg-gray-50">EXTRA HOURS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceRecords.map((record, idx) => (
            <TableRow key={idx} className="border border-gray-300">
              <TableCell className="border border-gray-300 text-center">{employeeName}</TableCell>
              <TableCell className="border border-gray-300 text-center">{record.date}</TableCell>
              {record.clockIn === "FOLGA" ? (
                <>
                  <TableCell colSpan={2} className="border border-gray-300 text-center font-bold">
                    FOLGA
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell className="border border-gray-300 text-center">{record.clockIn}</TableCell>
                  <TableCell className="border border-gray-300 text-center">{record.clockOut}</TableCell>
                </>
              )}
              <TableCell className="border border-gray-300 text-center">{record.workTime}</TableCell>
              <TableCell className="border border-gray-300 text-center">{record.extraHours}</TableCell>
            </TableRow>
          ))}
          <TableRow className="border border-gray-300 font-bold">
            <TableCell colSpan={4} className="border border-gray-300 text-right pr-4">TOTAL WORKING HOURS</TableCell>
            <TableCell className="border border-gray-300 text-center">{totalHours}</TableCell>
            <TableCell className="border border-gray-300 text-center">{extraHours}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <div className="mt-6">
        <div className="grid grid-cols-2 gap-4 text-center border-collapse">
          <div className="border border-gray-300 py-2 text-right font-bold pr-4">WORKING DAYS</div>
          <div className="border border-gray-300 py-2 text-center font-bold">{workingDays}</div>
        </div>
      </div>
      
      <div className="pt-8 pb-8">
        <div className="text-left whitespace-pre-line mb-8">
          {generateSignatureText(formattedSignatureDate)}
        </div>
      </div>
    </div>
  );
}
