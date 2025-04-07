import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { AttendanceRecord } from '@/types/attendance';
import { toast } from "sonner";
import { 
  exportToCsv, 
  exportToExcel, 
  getExportFileName 
} from '@/utils/exportOperations';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AttendanceReportTabProps {
  attendanceRecords: AttendanceRecord[];
  activeCompany: string;
  employees: any[];
}

export const AttendanceReportTab = ({ 
  attendanceRecords, 
  activeCompany, 
  employees 
}: AttendanceReportTabProps) => {
  const handleExport = (type: 'csv' | 'excel') => {
    if (attendanceRecords.length === 0) {
      toast.error("No data to export");
      return;
    }

    // Prepare summary data for export
    const summaryData = employees
      .filter(emp => emp.status === 'Active')
      .filter(emp => {
        if (activeCompany === 'all') return true;
        return emp.company?.toLowerCase().includes(activeCompany);
      })
      .map(employee => {
        const empRecords = attendanceRecords.filter(r => r.employeeId === employee.id);
        const presentCount = empRecords.filter(r => r.status === 'present').length;
        const absentCount = empRecords.filter(r => r.status === 'absent').length;
        const lateCount = empRecords.filter(r => r.status === 'late').length;
        const halfDayCount = empRecords.filter(r => r.status === 'half-day').length;
        const totalHours = empRecords.reduce((sum, r) => sum + r.totalHours, 0);
        
        return {
          'Employee': employee.fullName,
          'Present Days': presentCount,
          'Absent Days': absentCount,
          'Late Days': lateCount,
          'Half Days': halfDayCount,
          'Total Hours': totalHours.toFixed(1)
        };
      });

    const fileName = getExportFileName('Attendance_Summary');

    if (type === 'csv') {
      // Export combined data
      exportToCsv(summaryData, fileName);
      
      // Export individual employee data
      employees
        .filter(emp => emp.status === 'Active')
        .filter(emp => {
          if (activeCompany === 'all') return true;
          return emp.company?.toLowerCase().includes(activeCompany);
        })
        .forEach(employee => {
          const empRecords = attendanceRecords.filter(r => r.employeeId === employee.id);
          if (empRecords.length > 0) {
            const individualFileName = `${employee.fullName.replace(/\s+/g, '_')}_Summary`;
            const employeeData = [{
              'Employee': employee.fullName,
              'Present Days': empRecords.filter(r => r.status === 'present').length,
              'Absent Days': empRecords.filter(r => r.status === 'absent').length,
              'Late Days': empRecords.filter(r => r.status === 'late').length,
              'Half Days': empRecords.filter(r => r.status === 'half-day').length,
              'Total Hours': empRecords.reduce((sum, r) => sum + r.totalHours, 0).toFixed(1)
            }];
            exportToCsv(employeeData, individualFileName, employee.id);
          }
        });
      
      toast.success("Attendance summary exported as CSV");
    } else {
      // Export combined data
      exportToExcel(summaryData, fileName);
      
      // Export individual employee data
      employees
        .filter(emp => emp.status === 'Active')
        .filter(emp => {
          if (activeCompany === 'all') return true;
          return emp.company?.toLowerCase().includes(activeCompany);
        })
        .forEach(employee => {
          const empRecords = attendanceRecords.filter(r => r.employeeId === employee.id);
          if (empRecords.length > 0) {
            const individualFileName = `${employee.fullName.replace(/\s+/g, '_')}_Summary`;
            const employeeData = [{
              'Employee': employee.fullName,
              'Present Days': empRecords.filter(r => r.status === 'present').length,
              'Absent Days': empRecords.filter(r => r.status === 'absent').length,
              'Late Days': empRecords.filter(r => r.status === 'late').length,
              'Half Days': empRecords.filter(r => r.status === 'half-day').length,
              'Total Hours': empRecords.reduce((sum, r) => sum + r.totalHours, 0).toFixed(1)
            }];
            exportToExcel(employeeData, individualFileName, employee.id);
          }
        });
      
      toast.success("Attendance summary exported as Excel");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Attendance Summary</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              Export Report
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('excel')}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export as Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-1">Present</h3>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400">
              {attendanceRecords.filter(r => r.status === 'present').length}
            </p>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-100 dark:border-red-800">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-1">Absent</h3>
            <p className="text-3xl font-bold text-red-700 dark:text-red-400">
              {attendanceRecords.filter(r => r.status === 'absent').length}
            </p>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-100 dark:border-amber-800">
            <h3 className="text-lg font-medium text-amber-800 dark:text-amber-300 mb-1">Late</h3>
            <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">
              {attendanceRecords.filter(r => r.status === 'late').length}
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-1">Half Day</h3>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
              {attendanceRecords.filter(r => r.status === 'half-day').length}
            </p>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Employee
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Present
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Absent
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Late
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total Hours
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {employees
                .filter(emp => emp.status === 'Active')
                .filter(emp => {
                  if (activeCompany === 'all') return true;
                  return emp.company?.toLowerCase().includes(activeCompany);
                })
                .map(employee => {
                  const empRecords = attendanceRecords.filter(r => r.employeeId === employee.id);
                  const presentCount = empRecords.filter(r => r.status === 'present').length;
                  const absentCount = empRecords.filter(r => r.status === 'absent').length;
                  const lateCount = empRecords.filter(r => r.status === 'late').length;
                  const totalHours = empRecords.reduce((sum, r) => sum + r.totalHours, 0);
                  
                  return (
                    <tr key={employee.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {employee.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {presentCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {absentCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {lateCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {totalHours.toFixed(1)} hrs
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
