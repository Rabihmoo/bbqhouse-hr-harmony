
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { AttendanceReport, EmployeeReport } from "@/utils/attendance/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { formatTime } from "@/utils/attendance/timeCalculations";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { generateDeclarationText } from "@/utils/attendance/declarationGenerator";

interface PreviewDeclarationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportData: AttendanceReport | null;
}

export default function PreviewDeclarationsDialog({
  open,
  onOpenChange,
  reportData
}: PreviewDeclarationsDialogProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  
  if (!reportData || reportData.employeeReports.length === 0) {
    return null;
  }

  // Set the first employee as default if none selected
  if (!selectedEmployeeId && reportData.employeeReports.length > 0) {
    setSelectedEmployeeId(reportData.employeeReports[0].employeeId);
  }

  const selectedEmployee = reportData.employeeReports.find(
    emp => emp.employeeId === selectedEmployeeId
  );

  // Get only the first 2 days of records for preview
  const previewRecords = selectedEmployee 
    ? selectedEmployee.attendanceRecords.slice(0, 2) 
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Preview Declaration</DialogTitle>
          <DialogDescription>
            This is a preview of how the declarations will look. Only the first 2 days are shown.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Select Employee</label>
            <Select
              value={selectedEmployeeId}
              onValueChange={setSelectedEmployeeId}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {reportData.employeeReports.map((employee) => (
                  <SelectItem key={employee.employeeId} value={employee.employeeId}>
                    {employee.employeeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEmployee && (
            <ScrollArea className="h-[500px] border rounded-md p-4">
              <div className="space-y-4 p-2">
                <div>
                  <h3 className="font-bold text-center mb-2">
                    DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS
                  </h3>
                  
                  <p className="whitespace-pre-line text-sm mt-4">
                    {generateDeclarationText(
                      selectedEmployee.employeeName,
                      selectedEmployee.biNumber,
                      selectedEmployee.company,
                      reportData.month.toUpperCase(),
                      reportData.year
                    )}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">
                    A tabela a seguir detalha as horas extras a serem trabalhadas durante o
                    mês de {reportData.month.toUpperCase()} de {reportData.year}:
                  </p>
                </div>

                <Table className="border-collapse mt-4">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="border text-center">Name</TableHead>
                      <TableHead className="border text-center">Date</TableHead>
                      <TableHead className="border text-center">Clock In</TableHead>
                      <TableHead className="border text-center">Clock Out</TableHead>
                      <TableHead className="border text-center">Work Time</TableHead>
                      <TableHead className="border text-center">EXTRA HOURS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewRecords.map((record, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="border text-center">{selectedEmployee.employeeName}</TableCell>
                        <TableCell className="border text-center">{record.date}</TableCell>
                        <TableCell className="border text-center">{record.clockIn}</TableCell>
                        <TableCell className="border text-center">{record.clockOut}</TableCell>
                        <TableCell className="border text-center">{record.workTime}</TableCell>
                        <TableCell className="border text-center">{record.extraHours}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 grid grid-cols-2 gap-2 border-collapse">
                  <div className="border p-2 font-semibold text-right">TOTAL WORKING HOURS</div>
                  <div className="border p-2 text-center">
                    {selectedEmployee.totalHours}
                  </div>
                  <div className="border p-2 font-semibold text-right">WORKING DAYS</div>
                  <div className="border p-2 text-center">
                    {selectedEmployee.workingDays}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm">
                    Ao assinar este documento, confirmo que estou ciente das datas e horários específicos em que as horas extras serão executadas e concordo em cumpri-las conforme indicado na tabela acima.
                  </p>
                  <div className="mt-8 flex justify-between">
                    <div>Assinatura do Funcionário: _____________________________</div>
                    <div>Data: {new Date().getDate()} DE {reportData.month.toUpperCase()}</div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
