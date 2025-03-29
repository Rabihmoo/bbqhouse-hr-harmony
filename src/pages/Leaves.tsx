
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Check, X, Clock, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEmployeeData } from "@/hooks/use-employee-data";
import { LeaveRecord, LeaveAllowance } from "@/types/notification";
import { toast } from "sonner";

interface LeavesProps {
  onLogout?: () => void;
}

const Leaves = ({ onLogout }: LeavesProps) => {
  const [activeTab, setActiveTab] = useState("requests");
  const [activeCompany, setActiveCompany] = useState<string>("all");
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const [leaveAllowances, setLeaveAllowances] = useState<LeaveAllowance[]>([]);
  const { employees } = useEmployeeData();
  
  // New leave request state
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    employeeId: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    type: "annual" as "annual" | "sick" | "unpaid" | "other",
    notes: ""
  });
  
  // Load leave data
  useEffect(() => {
    const loadLeaveData = () => {
      // Check if we have stored leave records
      const storedLeaveRecords = localStorage.getItem('bbq-leave-records');
      if (storedLeaveRecords) {
        setLeaveRecords(JSON.parse(storedLeaveRecords));
      } else {
        // Generate some sample leave records if none exist
        const sampleRecords: LeaveRecord[] = [];
        
        employees.forEach(employee => {
          if (employee.status === 'Active') {
            // Create a random completed leave for each active employee
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 3));
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1);
            
            sampleRecords.push({
              id: `leave-${employee.id}-${Date.now()}`,
              employeeId: employee.id,
              employeeName: employee.fullName,
              startDate: format(startDate, 'yyyy-MM-dd'),
              endDate: format(endDate, 'yyyy-MM-dd'),
              days: Math.floor(Math.random() * 5) + 1,
              type: "annual",
              status: "completed",
              year: new Date().getFullYear(),
              notes: "Annual leave"
            });
          }
        });
        
        setLeaveRecords(sampleRecords);
        localStorage.setItem('bbq-leave-records', JSON.stringify(sampleRecords));
      }
      
      // Load leave allowances
      const storedAllowances = localStorage.getItem('bbq-leave-allowances');
      if (storedAllowances) {
        setLeaveAllowances(JSON.parse(storedAllowances));
      } else {
        // Generate sample allowances if none exist
        const sampleAllowances: LeaveAllowance[] = [];
        const currentYear = new Date().getFullYear();
        
        employees.forEach(employee => {
          if (employee.status === 'Active') {
            const daysEntitled = 21; // Standard allowance
            const daysTaken = Math.floor(Math.random() * 10);
            const remaining = daysEntitled - daysTaken;
            
            sampleAllowances.push({
              year: currentYear,
              daysEntitled,
              daysTaken,
              remaining,
              status: daysTaken === 0 ? 'unused' : (remaining === 0 ? 'fully-used' : 'partially-used')
            });
          }
        });
        
        setLeaveAllowances(sampleAllowances);
        localStorage.setItem('bbq-leave-allowances', JSON.stringify(sampleAllowances));
      }
    };
    
    loadLeaveData();
  }, [employees]);
  
  // Filter leave records by company
  const filteredLeaveRecords = activeCompany === 'all' 
    ? leaveRecords 
    : leaveRecords.filter(record => {
        const employee = employees.find(emp => emp.id === record.employeeId);
        return employee?.company?.toLowerCase().includes(activeCompany);
      });
  
  // Handle new leave request submission
  const handleSubmitLeaveRequest = () => {
    if (!newLeaveRequest.employeeId || !newLeaveRequest.startDate || !newLeaveRequest.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const employee = employees.find(emp => emp.id === newLeaveRequest.employeeId);
    if (!employee) {
      toast.error("Selected employee not found");
      return;
    }
    
    // Calculate number of days (excluding weekends)
    const start = new Date(newLeaveRequest.startDate);
    const end = new Date(newLeaveRequest.endDate);
    let days = 0;
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends (0 = Sunday, 6 = Saturday)
        days++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const newLeave: LeaveRecord = {
      id: `leave-${employee.id}-${Date.now()}`,
      employeeId: employee.id,
      employeeName: employee.fullName,
      startDate: format(newLeaveRequest.startDate, 'yyyy-MM-dd'),
      endDate: format(newLeaveRequest.endDate, 'yyyy-MM-dd'),
      days,
      type: newLeaveRequest.type,
      status: "scheduled",
      year: newLeaveRequest.startDate.getFullYear(),
      notes: newLeaveRequest.notes
    };
    
    // Add to leave records
    const updatedLeaveRecords = [...leaveRecords, newLeave];
    setLeaveRecords(updatedLeaveRecords);
    localStorage.setItem('bbq-leave-records', JSON.stringify(updatedLeaveRecords));
    
    // Reset form
    setNewLeaveRequest({
      employeeId: "",
      startDate: undefined,
      endDate: undefined,
      type: "annual",
      notes: ""
    });
    
    toast.success("Leave request created successfully");
    setActiveTab("requests");
  };

  return (
    <DashboardLayout 
      title="Leaves" 
      subtitle="Manage employee leave requests"
      onLogout={onLogout}
    >
      <div className="space-y-6">
        <Tabs defaultValue="requests" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <TabsList>
              <TabsTrigger value="requests">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Leave Requests
              </TabsTrigger>
              <TabsTrigger value="allowances">
                <FileText className="h-4 w-4 mr-2" />
                Leave Allowances
              </TabsTrigger>
              <TabsTrigger value="new">
                <Clock className="h-4 w-4 mr-2" />
                New Request
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
          
          <TabsContent value="requests" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={filteredLeaveRecords}
                  columns={[
                    {
                      key: "employeeName",
                      header: "Employee",
                    },
                    {
                      key: "type",
                      header: "Leave Type",
                      render: (row) => (
                        <span className="capitalize">{row.type}</span>
                      ),
                    },
                    {
                      key: "startDate",
                      header: "Start Date",
                    },
                    {
                      key: "endDate",
                      header: "End Date",
                    },
                    {
                      key: "days",
                      header: "Days",
                      render: (row) => (
                        <span>{row.days} {row.days === 1 ? 'day' : 'days'}</span>
                      ),
                    },
                    {
                      key: "status",
                      header: "Status",
                      render: (row) => (
                        <div className="flex items-center">
                          {row.status === "completed" ? (
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <Clock className="h-4 w-4 text-amber-500 mr-2" />
                          )}
                          <span className="capitalize">{row.status}</span>
                        </div>
                      ),
                    },
                    {
                      key: "actions",
                      header: "",
                      render: (row) => (
                        <div className="flex items-center space-x-2">
                          {row.status === "scheduled" && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex items-center h-8 px-2 text-green-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updatedRecords = leaveRecords.map(rec =>
                                    rec.id === row.id ? { ...rec, status: "completed" } : rec
                                  );
                                  setLeaveRecords(updatedRecords);
                                  localStorage.setItem('bbq-leave-records', JSON.stringify(updatedRecords));
                                  toast.success("Leave status updated to completed");
                                }}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                <span className="sr-only sm:not-sr-only sm:inline-block">Complete</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex items-center h-8 px-2 text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updatedRecords = leaveRecords.filter(rec => rec.id !== row.id);
                                  setLeaveRecords(updatedRecords);
                                  localStorage.setItem('bbq-leave-records', JSON.stringify(updatedRecords));
                                  toast.success("Leave request deleted");
                                }}
                              >
                                <X className="h-4 w-4 mr-1" />
                                <span className="sr-only sm:not-sr-only sm:inline-block">Cancel</span>
                              </Button>
                            </>
                          )}
                        </div>
                      ),
                    },
                  ]}
                  searchable
                  pagination
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="allowances" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Leave Allowances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {employees
                    .filter(emp => emp.status === 'Active')
                    .filter(emp => {
                      if (activeCompany === 'all') return true;
                      return emp.company?.toLowerCase().includes(activeCompany);
                    })
                    .map(employee => {
                      const allowance = leaveAllowances.find(a => a.year === new Date().getFullYear());
                      
                      return (
                        <div 
                          key={employee.id} 
                          className="border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{employee.fullName}</h3>
                              <p className="text-sm text-muted-foreground">{employee.position}</p>
                            </div>
                            <div className={cn(
                              "px-2 py-1 rounded-full text-xs",
                              allowance?.status === 'unused' 
                                ? "bg-amber-100 text-amber-800" 
                                : allowance?.status === 'fully-used'
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                            )}>
                              {allowance?.status === 'unused' 
                                ? "Unused" 
                                : allowance?.status === 'fully-used'
                                  ? "Fully Used"
                                  : "Partially Used"}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 mb-2 text-sm">
                            <div className="bg-background p-2 rounded text-center">
                              <div className="font-semibold">{allowance?.daysEntitled || 21}</div>
                              <div className="text-xs text-muted-foreground">Entitled</div>
                            </div>
                            <div className="bg-background p-2 rounded text-center">
                              <div className="font-semibold">{allowance?.daysTaken || 0}</div>
                              <div className="text-xs text-muted-foreground">Taken</div>
                            </div>
                            <div className="bg-background p-2 rounded text-center">
                              <div className="font-semibold">{allowance?.remaining || 21}</div>
                              <div className="text-xs text-muted-foreground">Remaining</div>
                            </div>
                          </div>
                          
                          <progress 
                            className="w-full h-2 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-bar]:bg-secondary [&::-webkit-progress-value]:bg-primary"
                            value={(allowance?.daysTaken || 0)} 
                            max={(allowance?.daysEntitled || 21)}
                          />
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="new" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>New Leave Request</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="employee">Employee</Label>
                      <Select
                        value={newLeaveRequest.employeeId}
                        onValueChange={(value) => setNewLeaveRequest({...newLeaveRequest, employeeId: value})}
                      >
                        <SelectTrigger id="employee">
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees
                            .filter(emp => emp.status === 'Active')
                            .map(employee => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.fullName} - {employee.position}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="leave-type">Leave Type</Label>
                      <Select
                        value={newLeaveRequest.type}
                        onValueChange={(value: "annual" | "sick" | "unpaid" | "other") => 
                          setNewLeaveRequest({...newLeaveRequest, type: value})
                        }
                      >
                        <SelectTrigger id="leave-type">
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="annual">Annual Leave</SelectItem>
                          <SelectItem value="sick">Sick Leave</SelectItem>
                          <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newLeaveRequest.startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newLeaveRequest.startDate ? format(newLeaveRequest.startDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newLeaveRequest.startDate}
                            onSelect={(date) => setNewLeaveRequest({...newLeaveRequest, startDate: date})}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newLeaveRequest.endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newLeaveRequest.endDate ? format(newLeaveRequest.endDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newLeaveRequest.endDate}
                            onSelect={(date) => setNewLeaveRequest({...newLeaveRequest, endDate: date})}
                            initialFocus
                            disabled={(date) => 
                              !newLeaveRequest.startDate || date < newLeaveRequest.startDate
                            }
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      placeholder="Additional notes about the leave request"
                      value={newLeaveRequest.notes}
                      onChange={(e) => setNewLeaveRequest({...newLeaveRequest, notes: e.target.value})}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSubmitLeaveRequest}
                    disabled={!newLeaveRequest.employeeId || !newLeaveRequest.startDate || !newLeaveRequest.endDate}
                  >
                    Submit Leave Request
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

export default Leaves;
