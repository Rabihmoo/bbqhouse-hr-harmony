import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { CalendarIcon, Clock, FileText, FileUp, CalendarDays, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useEmployeeData } from "@/hooks/use-employee-data";
import { toast } from "sonner";
import AttendanceUploader from '@/components/employees/AttendanceUploader';

interface AttendanceProps {
  onLogout?: () => void;
}

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string;
  totalHours: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
  notes?: string;
}

const Attendance = ({ onLogout }: AttendanceProps) => {
  const [activeTab, setActiveTab] = useState("daily");
  const [activeCompany, setActiveCompany] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const { employees } = useEmployeeData();
  
  const [newAttendance, setNewAttendance] = useState({
    employeeId: "",
    date: new Date(),
    clockIn: "08:00",
    clockOut: "17:00",
    status: "present" as 'present' | 'absent' | 'late' | 'half-day',
    notes: ""
  });

  useEffect(() => {
    const loadAttendanceData = () => {
      const storedAttendance = localStorage.getItem('bbq-attendance-records');
      if (storedAttendance) {
        setAttendanceRecords(JSON.parse(storedAttendance));
      } else {
        const sampleRecords: AttendanceRecord[] = [];
        const currentDate = new Date();
        
        for (let i = 0; i < 7; i++) {
          const date = subDays(currentDate, i);
          const dateStr = format(date, 'yyyy-MM-dd');
          
          employees.forEach(employee => {
            if (employee.status === 'Active') {
              const statuses: ('present' | 'absent' | 'late' | 'half-day')[] = ['present', 'present', 'present', 'present', 'late', 'half-day', 'absent'];
              const status = statuses[Math.floor(Math.random() * statuses.length)];
              
              let clockIn = "08:00";
              let clockOut = "17:00";
              let totalHours = 9;
              
              if (status === 'late') {
                const minutes = 15 + Math.floor(Math.random() * 45);
                clockIn = `08:${minutes < 10 ? '0' + minutes : minutes}`;
                totalHours = 9 - (minutes / 60);
              } else if (status === 'half-day') {
                clockOut = "12:00";
                totalHours = 4;
              } else if (status === 'absent') {
                clockIn = "";
                clockOut = "";
                totalHours = 0;
              }
              
              sampleRecords.push({
                id: `attendance-${employee.id}-${dateStr}`,
                employeeId: employee.id,
                employeeName: employee.fullName,
                date: dateStr,
                clockIn,
                clockOut,
                totalHours,
                status,
                notes: status === 'absent' ? "Not reported for work" : ""
              });
            }
          });
        }
        
        setAttendanceRecords(sampleRecords);
        localStorage.setItem('bbq-attendance-records', JSON.stringify(sampleRecords));
      }
    };
    
    loadAttendanceData();
  }, [employees]);
  
  const filteredDailyRecords = attendanceRecords.filter(record => {
    const matchesDate = record.date === format(selectedDate, 'yyyy-MM-dd');
    if (!matchesDate) return false;
    
    if (activeCompany === 'all') return true;
    
    const employee = employees.find(emp => emp.id === record.employeeId);
    return employee?.company?.toLowerCase().includes(activeCompany);
  });
  
  const employeesWithoutAttendance = employees.filter(employee => {
    if (employee.status !== 'Active') return false;
    if (activeCompany !== 'all' && !employee.company?.toLowerCase().includes(activeCompany)) return false;
    
    const hasRecord = attendanceRecords.some(
      record => record.employeeId === employee.id && record.date === format(selectedDate, 'yyyy-MM-dd')
    );
    
    return !hasRecord;
  });
  
  const handleSubmitAttendance = () => {
    if (!newAttendance.employeeId) {
      toast.error("Please select an employee");
      return;
    }
    
    const employee = employees.find(emp => emp.id === newAttendance.employeeId);
    if (!employee) {
      toast.error("Selected employee not found");
      return;
    }
    
    let totalHours = 0;
    if (newAttendance.status !== 'absent' && newAttendance.clockIn && newAttendance.clockOut) {
      const clockInParts = newAttendance.clockIn.split(':').map(Number);
      const clockOutParts = newAttendance.clockOut.split(':').map(Number);
      
      const clockInHours = clockInParts[0] + (clockInParts[1] / 60);
      const clockOutHours = clockOutParts[0] + (clockOutParts[1] / 60);
      
      totalHours = clockOutHours - clockInHours;
      totalHours = Math.round(totalHours * 10) / 10;
    }
    
    const dateStr = format(newAttendance.date, 'yyyy-MM-dd');
    const newRecord: AttendanceRecord = {
      id: `attendance-${employee.id}-${dateStr}`,
      employeeId: employee.id,
      employeeName: employee.fullName,
      date: dateStr,
      clockIn: newAttendance.status === 'absent' ? "" : newAttendance.clockIn,
      clockOut: newAttendance.status === 'absent' ? "" : newAttendance.clockOut,
      totalHours,
      status: newAttendance.status,
      notes: newAttendance.notes
    };
    
    const existingIndex = attendanceRecords.findIndex(
      record => record.employeeId === employee.id && record.date === dateStr
    );
    
    let updatedRecords;
    if (existingIndex >= 0) {
      updatedRecords = [...attendanceRecords];
      updatedRecords[existingIndex] = newRecord;
      toast.success("Attendance record updated");
    } else {
      updatedRecords = [...attendanceRecords, newRecord];
      toast.success("Attendance record created");
    }
    
    setAttendanceRecords(updatedRecords);
    localStorage.setItem('bbq-attendance-records', JSON.stringify(updatedRecords));
    
    setNewAttendance({
      employeeId: "",
      date: new Date(),
      clockIn: "08:00",
      clockOut: "17:00",
      status: "present",
      notes: ""
    });
    
    setActiveTab("daily");
    setSelectedDate(newAttendance.date);
  };
  
  return (
    <DashboardLayout 
      title="Attendance" 
      subtitle="Track and manage employee attendance"
      onLogout={onLogout}
    >
      <div className="space-y-6">
        <AttendanceUploader 
          onFileUploaded={(data) => {
            if (data && data.employeeReports) {
              toast.success("Attendance data processed successfully");
            }
          }}
        />
        
        <Tabs defaultValue="daily" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <TabsList>
              <TabsTrigger value="daily">
                <CalendarDays className="h-4 w-4 mr-2" />
                Daily Attendance
              </TabsTrigger>
              <TabsTrigger value="report">
                <FileText className="h-4 w-4 mr-2" />
                Attendance Report
              </TabsTrigger>
              <TabsTrigger value="add">
                <FileUp className="h-4 w-4 mr-2" />
                Add Attendance
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="company-filter">Filter by company:</Label>
              <Select
                value={activeCompany}
                onValueChange={setActiveCompany}
              >
                <SelectTrigger id="company-filter" className="w-[180px]">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  <SelectItem value="bbqhouse">BBQHouse LDA</SelectItem>
                  <SelectItem value="salt">SALT LDA</SelectItem>
                  <SelectItem value="executive">Executive Cleaning LDA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="daily" className="mt-0 space-y-6">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <CardTitle>Daily Attendance</CardTitle>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {format(selectedDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedDate(subDays(selectedDate, 1))}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                  >
                    Next
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {filteredDailyRecords.length > 0 ? (
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
                            onClick={() => {
                              setNewAttendance({
                                employeeId: row.employeeId,
                                date: new Date(row.date),
                                clockIn: row.clockIn || "08:00",
                                clockOut: row.clockOut || "17:00",
                                status: row.status,
                                notes: row.notes || ""
                              });
                              setActiveTab("add");
                            }}
                          >
                            Edit
                          </Button>
                        ),
                      },
                    ]}
                    searchable
                    pagination
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No attendance records for this date.</p>
                    {employeesWithoutAttendance.length > 0 && (
                      <>
                        <p className="mb-2">Employees without attendance records:</p>
                        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 max-w-2xl mx-auto">
                          {employeesWithoutAttendance.map(employee => (
                            <div key={employee.id} className="border rounded-md p-2 text-sm">
                              {employee.fullName}
                            </div>
                          ))}
                        </div>
                        <Button 
                          className="mt-4"
                          onClick={() => setActiveTab("add")}
                        >
                          Add Attendance Records
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="report" className="mt-0 space-y-6">
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
          </TabsContent>
          
          <TabsContent value="add" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Attendance Record</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="attendance-employee">Employee</Label>
                      <Select
                        value={newAttendance.employeeId}
                        onValueChange={(value) => setNewAttendance({...newAttendance, employeeId: value})}
                      >
                        <SelectTrigger id="attendance-employee">
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees
                            .filter(emp => emp.status === 'Active')
                            .filter(emp => {
                              if (activeCompany === 'all') return true;
                              return emp.company?.toLowerCase().includes(activeCompany);
                            })
                            .map(employee => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.fullName} - {employee.position}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="attendance-status">Status</Label>
                      <Select
                        value={newAttendance.status}
                        onValueChange={(value: 'present' | 'absent' | 'late' | 'half-day') => 
                          setNewAttendance({...newAttendance, status: value})
                        }
                      >
                        <SelectTrigger id="attendance-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="late">Late</SelectItem>
                          <SelectItem value="half-day">Half Day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newAttendance.date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newAttendance.date ? format(newAttendance.date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newAttendance.date}
                          onSelect={(date) => date && setNewAttendance({...newAttendance, date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {newAttendance.status !== 'absent' && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="clock-in">Clock In</Label>
                        <Input
                          id="clock-in"
                          type="time"
                          value={newAttendance.clockIn}
                          onChange={(e) => setNewAttendance({...newAttendance, clockIn: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="clock-out">Clock Out</Label>
                        <Input
                          id="clock-out"
                          type="time"
                          value={newAttendance.clockOut}
                          onChange={(e) => setNewAttendance({...newAttendance, clockOut: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="attendance-notes">Notes</Label>
                    <Input
                      id="attendance-notes"
                      placeholder="Additional notes"
                      value={newAttendance.notes}
                      onChange={(e) => setNewAttendance({...newAttendance, notes: e.target.value})}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSubmitAttendance}
                    disabled={!newAttendance.employeeId || !newAttendance.date}
                  >
                    Save Attendance Record
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
