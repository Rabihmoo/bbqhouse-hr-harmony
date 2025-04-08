
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileDown, Calendar, History } from "lucide-react";
import { formatTime } from "@/utils/attendance/timeCalculations";
import { format, parse } from "date-fns";

interface ExportRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  exportDate: string;
  month: string;
  year: string;
  totalHours: number;
  workingDays: number;
  format: 'excel' | 'pdf' | 'both';
}

interface MonthlyHistoryTabProps {
  activeCompany: string | null;
}

export function MonthlyHistoryTab({ activeCompany }: MonthlyHistoryTabProps) {
  const [exportRecords, setExportRecords] = useState<ExportRecord[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  
  // Load export records from localStorage
  useEffect(() => {
    const loadExportRecords = () => {
      const recordsStr = localStorage.getItem('bbq-employee-exports') || '[]';
      const records: ExportRecord[] = JSON.parse(recordsStr);
      
      let filteredRecords = records;
      
      // Apply company filter if provided
      if (activeCompany) {
        // This would require linking with the company data
        // For now, we'll skip this filter
      }
      
      setExportRecords(filteredRecords);
    };
    
    loadExportRecords();
    
    // Listen for storage changes
    window.addEventListener('storage', loadExportRecords);
    
    return () => {
      window.removeEventListener('storage', loadExportRecords);
    };
  }, [activeCompany]);
  
  // Get unique employees and months for filtering
  const employees = [
    { id: "all", name: "All Employees" },
    ...Array.from(new Set(exportRecords.map(record => record.employeeId)))
      .map(id => {
        const record = exportRecords.find(r => r.employeeId === id);
        return {
          id,
          name: record?.employeeName || id
        };
      })
  ];
  
  const months = [
    { value: "all", label: "All Months" },
    ...Array.from(new Set(exportRecords.map(record => `${record.month}_${record.year}`)))
      .map(monthYear => {
        const [month, year] = monthYear.split('_');
        return {
          value: monthYear,
          label: `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`
        };
      })
  ];
  
  // Filter records based on selections
  const filteredRecords = exportRecords.filter(record => {
    const employeeMatch = selectedEmployee === "all" || record.employeeId === selectedEmployee;
    const monthMatch = selectedMonth === "all" || `${record.month}_${record.year}` === selectedMonth;
    return employeeMatch && monthMatch;
  });
  
  // Calculate summary
  const totalExports = filteredRecords.length;
  const uniqueEmployees = new Set(filteredRecords.map(r => r.employeeId)).size;
  const totalHours = filteredRecords.reduce((sum, r) => sum + r.totalHours, 0);
  
  // Handle download
  const handleDownload = (record: ExportRecord) => {
    // In a real app, this would retrieve the stored file
    // For now, just show a notice
    alert(`In a production environment, this would download the ${record.format} file for ${record.employeeName} - ${record.month} ${record.year}`);
  };
  
  return (
    <div className="space-y-6">
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <History className="h-5 w-5" />
            Export History
          </CardTitle>
          <CardDescription>
            View and download previously generated employee declarations
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="w-full sm:w-1/3">
              <label className="text-sm font-medium">Employee</label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-1/3">
              <label className="text-sm font-medium">Month/Year</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-1/3 flex flex-col justify-end">
              <div className="text-sm text-muted-foreground mt-6">
                Showing {filteredRecords.length} exports
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="border rounded-md p-4 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold">{totalExports}</div>
              <div className="text-sm text-muted-foreground">Total Exports</div>
            </div>
            
            <div className="border rounded-md p-4 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold">{uniqueEmployees}</div>
              <div className="text-sm text-muted-foreground">Employees</div>
            </div>
            
            <div className="border rounded-md p-4 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold">{formatTime(totalHours)}</div>
              <div className="text-sm text-muted-foreground">Total Hours</div>
            </div>
          </div>
          
          <ScrollArea className="h-[300px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Month/Year</TableHead>
                  <TableHead>Export Date</TableHead>
                  <TableHead>Working Days</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.employeeName}</TableCell>
                      <TableCell>
                        {record.month.charAt(0).toUpperCase() + record.month.slice(1)} {record.year}
                      </TableCell>
                      <TableCell>
                        {format(new Date(record.exportDate), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>{record.workingDays}</TableCell>
                      <TableCell>{formatTime(record.totalHours)}</TableCell>
                      <TableCell className="uppercase">{record.format}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownload(record)}
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No export history found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
