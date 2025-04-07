
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AttendanceReport, formatTime, generateDeclarationText, generateSignatureText } from "@/utils/attendanceProcessor";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useEmployeeData } from "@/hooks/use-employee-data";
import { Download, Printer, FileText } from "lucide-react";

interface AttendanceReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportData: AttendanceReport | null;
}

const AttendanceReportDialog = ({ open, onOpenChange, reportData }: AttendanceReportDialogProps) => {
  const { toast } = useToast();
  const { employees } = useEmployeeData();
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("MYR HR Management");
  const [month, setMonth] = useState<string>(reportData?.month || "");
  const [year, setYear] = useState<string>(reportData?.year || new Date().getFullYear().toString());
  const [currentView, setCurrentView] = useState<"summary" | "individual">("summary");

  if (!reportData) {
    return null;
  }

  const handleExportAll = () => {
    toast({
      title: "Reports exported",
      description: "All attendance declarations have been prepared for export.",
    });
  };

  const handlePrintDeclaration = () => {
    toast({
      title: "Printing declaration",
      description: "The individual declaration is being sent to the printer.",
    });
  };

  const handleExportIndividual = () => {
    toast({
      title: "Declaration exported",
      description: "The individual declaration has been exported as PDF.",
    });
  };

  // Get the selected employee report
  const selectedEmployeeReport = reportData.employeeReports.find(
    report => report.employeeId === selectedEmployee
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Attendance Report & Declarations
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <Label htmlFor="report-month">Month</Label>
              <Input
                id="report-month"
                value={month}
                onChange={e => setMonth(e.target.value)}
                placeholder="Enter month name"
              />
            </div>
            <div>
              <Label htmlFor="report-year">Year</Label>
              <Input
                id="report-year"
                value={year}
                onChange={e => setYear(e.target.value)}
                placeholder="Enter year"
              />
            </div>
          </div>
          
          <Tabs defaultValue="summary" onValueChange={(value) => setCurrentView(value as "summary" | "individual")}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="summary">Summary Report</TabsTrigger>
              <TabsTrigger value="individual">Individual Declarations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-6">
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
              
              <div className="text-center pt-4">
                <Button onClick={handleExportAll}>
                  <Download className="h-4 w-4 mr-2" />
                  Export All Declarations
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="individual" className="space-y-6">
              <div className="mb-6">
                <Label htmlFor="employee-select">Select Employee</Label>
                <Select
                  value={selectedEmployee}
                  onValueChange={setSelectedEmployee}
                >
                  <SelectTrigger id="employee-select">
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportData.employeeReports.map(report => (
                      <SelectItem key={report.employeeId} value={report.employeeId}>
                        {report.employeeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedEmployeeReport && (
                <div className="border rounded-lg p-6 space-y-6 print:border-none print:p-0">
                  <div className="text-center mb-4 space-y-4">
                    <h2 className="text-xl font-bold">DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS</h2>
                    
                    <p className="text-left whitespace-pre-line">
                      Eu, {selectedEmployeeReport.employeeName}, portador(a) do documento de identificação {selectedEmployeeReport.biNumber} e funcionário(a) da empresa {companyName},
                      venho por meio deste documento declarar o meu consentimento e aceitação para
                      realizar horas extras de trabalho de acordo com as condições e termos
                      estabelecidos pela legislação vigente e pela política interna da empresa.
                    </p>
                    <p className="text-left">
                      Entendo que a necessidade de laborar horas extras pode surgir devido a
                      circunstâncias excepcionais e/ou necessidades operacionais da empresa. Estou
                      ciente de que serei compensado(a) adequadamente pelas horas extras
                      trabalhadas de acordo com as regras e regulamentos aplicáveis.
                    </p>
                    <p className="text-left">
                      A tabela a seguir detalha as horas extras a serem trabalhadas durante o
                      mês de {month} de {year}:
                    </p>
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
                      {selectedEmployeeReport.attendanceRecords.map((record, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{selectedEmployeeReport.employeeName}</TableCell>
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
                        <TableCell colSpan={4} className="text-right font-bold">Totals:</TableCell>
                        <TableCell className="font-bold">{formatTime(selectedEmployeeReport.totalHours)}</TableCell>
                        <TableCell className="font-bold">{formatTime(selectedEmployeeReport.extraHours)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} className="text-right font-bold">Working Days:</TableCell>
                        <TableCell colSpan={2} className="font-bold">{selectedEmployeeReport.workingDays}</TableCell>
                      </TableRow>
                    </tfoot>
                  </Table>
                  
                  <div className="pt-8 pb-8">
                    <p className="text-left">
                      Ao assinar este documento, confirmo que estou ciente das datas e horários específicos em que as horas extras serão executadas e concordo em cumpri-las conforme indicado na tabela acima.
                    </p>
                    
                    <div className="mt-16">
                      <p className="text-center border-t pt-4">Assinatura do Funcionário</p>
                    </div>
                    
                    <div className="mt-16 text-right">
                      <p>Data: {format(new Date(), 'dd/MM/yyyy')}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedEmployeeReport && (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handlePrintDeclaration}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button onClick={handleExportIndividual}>
                    <Download className="h-4 w-4 mr-2" />
                    Export as PDF
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceReportDialog;
