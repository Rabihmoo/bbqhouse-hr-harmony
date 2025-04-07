
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AttendanceRecord } from '@/types/attendance';

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Summary</CardTitle>
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
