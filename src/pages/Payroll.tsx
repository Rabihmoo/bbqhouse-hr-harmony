import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Calendar, FileText, DollarSign, FileDown, CalendarClock, Calculator } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEmployeeData } from "@/hooks/use-employee-data";
import { SalaryStructure } from '@/types/notification';
import { toast } from "sonner";

interface PayrollProps {
  onLogout?: () => void;
}

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: number;
  year: number;
  periodLabel: string;
  basicSalary: number;
  transportAllowance: number;
  accommodationAllowance: number;
  bonus: number;
  overtimeHours: number;
  overtimeAmount: number;
  deductions: number;
  netSalary: number;
  status: 'draft' | 'processed' | 'paid';
  paymentDate?: string;
}

const Payroll = ({ onLogout }: PayrollProps) => {
  const [activeTab, setActiveTab] = useState("payslips");
  const [activeCompany, setActiveCompany] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const { employees } = useEmployeeData();
  
  const [newPayroll, setNewPayroll] = useState({
    employeeId: "",
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    overtimeHours: 0,
    deductions: 0,
    status: "draft" as 'draft' | 'processed' | 'paid'
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  useEffect(() => {
    const loadPayrollData = () => {
      const storedPayroll = localStorage.getItem('bbq-payroll-records');
      if (storedPayroll) {
        setPayrollRecords(JSON.parse(storedPayroll));
      } else {
        const sampleRecords: PayrollRecord[] = [];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        for (let i = 0; i < 2; i++) {
          const month = i === 0 ? currentMonth : (currentMonth === 0 ? 11 : currentMonth - 1);
          const year = i === 0 ? currentYear : (currentMonth === 0 ? currentYear - 1 : currentYear);
          
          employees.forEach(employee => {
            if (employee.status === 'Active') {
              const salaryStructure = employee.salaryStructure || {
                basicSalary: 8900,
                transportAllowance: 1000,
                accommodationAllowance: 2000,
                bonus: 0
              };
              
              const overtimeHours = Math.floor(Math.random() * 20);
              const overtimeRate = 1.5 * (salaryStructure.basicSalary / 176);
              const overtimeAmount = Math.round(overtimeHours * overtimeRate);
              
              const deductions = Math.round(salaryStructure.basicSalary * 0.03);
              
              const netSalary = (
                salaryStructure.basicSalary +
                salaryStructure.transportAllowance +
                salaryStructure.accommodationAllowance +
                salaryStructure.bonus +
                overtimeAmount -
                deductions
              );
              
              sampleRecords.push({
                id: `payroll-${employee.id}-${year}-${month}`,
                employeeId: employee.id,
                employeeName: employee.fullName,
                month,
                year,
                periodLabel: `${months[month]} ${year}`,
                basicSalary: salaryStructure.basicSalary,
                transportAllowance: salaryStructure.transportAllowance,
                accommodationAllowance: salaryStructure.accommodationAllowance,
                bonus: salaryStructure.bonus,
                overtimeHours,
                overtimeAmount,
                deductions,
                netSalary,
                status: i === 0 ? 'draft' : 'paid',
                paymentDate: i === 0 ? undefined : format(new Date(year, month, 25), 'yyyy-MM-dd')
              });
            }
          });
        }
        
        setPayrollRecords(sampleRecords);
        localStorage.setItem('bbq-payroll-records', JSON.stringify(sampleRecords));
      }
    };
    
    loadPayrollData();
  }, [employees]);
  
  const filteredPayrollRecords = payrollRecords.filter(record => {
    const matchesPeriod = record.month === selectedMonth && record.year === selectedYear;
    if (!matchesPeriod) return false;
    
    if (activeCompany === 'all') return true;
    
    const employee = employees.find(emp => emp.id === record.employeeId);
    return employee?.company?.toLowerCase().includes(activeCompany);
  });
  
  const totalBasicSalary = filteredPayrollRecords.reduce((sum, record) => sum + record.basicSalary, 0);
  const totalAllowances = filteredPayrollRecords.reduce((sum, record) => sum + record.transportAllowance + record.accommodationAllowance, 0);
  const totalOvertime = filteredPayrollRecords.reduce((sum, record) => sum + record.overtimeAmount, 0);
  const totalDeductions = filteredPayrollRecords.reduce((sum, record) => sum + record.deductions, 0);
  const totalNetSalary = filteredPayrollRecords.reduce((sum, record) => sum + record.netSalary, 0);
  
  const employeesWithoutPayroll = employees.filter(employee => {
    if (employee.status !== 'Active') return false;
    if (activeCompany !== 'all' && !employee.company?.toLowerCase().includes(activeCompany)) return false;
    
    const hasRecord = payrollRecords.some(
      record => record.employeeId === employee.id && 
               record.month === selectedMonth && 
               record.year === selectedYear
    );
    
    return !hasRecord;
  });
  
  const handleGeneratePayroll = () => {
    if (!newPayroll.employeeId) {
      toast.error("Please select an employee");
      return;
    }
    
    const employee = employees.find(emp => emp.id === newPayroll.employeeId);
    if (!employee) {
      toast.error("Selected employee not found");
      return;
    }
    
    const salaryStructure = employee.salaryStructure || {
      basicSalary: 8900,
      transportAllowance: 1000,
      accommodationAllowance: 2000,
      bonus: 0
    };
    
    const overtimeRate = 1.5 * (salaryStructure.basicSalary / 176);
    const overtimeAmount = Math.round(newPayroll.overtimeHours * overtimeRate);
    
    const netSalary = (
      salaryStructure.basicSalary +
      salaryStructure.transportAllowance +
      salaryStructure.accommodationAllowance +
      salaryStructure.bonus +
      overtimeAmount -
      newPayroll.deductions
    );
    
    const newRecord: PayrollRecord = {
      id: `payroll-${employee.id}-${newPayroll.year}-${newPayroll.month}`,
      employeeId: employee.id,
      employeeName: employee.fullName,
      month: newPayroll.month,
      year: newPayroll.year,
      periodLabel: `${months[newPayroll.month]} ${newPayroll.year}`,
      basicSalary: salaryStructure.basicSalary,
      transportAllowance: salaryStructure.transportAllowance,
      accommodationAllowance: salaryStructure.accommodationAllowance,
      bonus: salaryStructure.bonus,
      overtimeHours: newPayroll.overtimeHours,
      overtimeAmount,
      deductions: newPayroll.deductions,
      netSalary,
      status: newPayroll.status,
      paymentDate: newPayroll.status === 'paid' ? format(new Date(), 'yyyy-MM-dd') : undefined
    };
    
    const existingIndex = payrollRecords.findIndex(
      record => record.employeeId === employee.id && 
               record.month === newPayroll.month && 
               record.year === newPayroll.year
    );
    
    let updatedRecords;
    if (existingIndex >= 0) {
      updatedRecords = [...payrollRecords];
      updatedRecords[existingIndex] = newRecord;
      toast.success("Payroll record updated");
    } else {
      updatedRecords = [...payrollRecords, newRecord];
      toast.success("Payroll record generated");
    }
    
    setPayrollRecords(updatedRecords);
    localStorage.setItem('bbq-payroll-records', JSON.stringify(updatedRecords));
    
    setNewPayroll({
      employeeId: "",
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      overtimeHours: 0,
      deductions: 0,
      status: "draft"
    });
    
    setSelectedMonth(newPayroll.month);
    setSelectedYear(newPayroll.year);
    setActiveTab("payslips");
  };
  
  const handleUpdateStatus = (record: PayrollRecord, newStatus: 'draft' | 'processed' | 'paid') => {
    const updatedRecord = {
      ...record,
      status: newStatus,
      paymentDate: newStatus === 'paid' ? format(new Date(), 'yyyy-MM-dd') : record.paymentDate
    };
    
    const updatedRecords = payrollRecords.map(r => 
      r.id === record.id ? updatedRecord : r
    );
    
    setPayrollRecords(updatedRecords);
    localStorage.setItem('bbq-payroll-records', JSON.stringify(updatedRecords));
    
    toast.success(`Payroll status updated to ${newStatus}`);
  };
  
  const handleDownloadPayslip = (record: PayrollRecord) => {
    toast.success("Downloading payslip", {
      description: `Payslip for ${record.employeeName} - ${record.periodLabel} is being downloaded.`
    });
    
    setTimeout(() => {
      const filename = `Payslip_${record.employeeName.replace(/ /g, '_')}_${record.periodLabel.replace(/ /g, '_')}.pdf`;
      const dummyLink = document.createElement('a');
      dummyLink.href = `#${filename}`;
      dummyLink.download = filename;
      document.body.appendChild(dummyLink);
      dummyLink.click();
      document.body.removeChild(dummyLink);
    }, 1000);
  };
  
  return (
    <DashboardLayout 
      title="Payroll" 
      subtitle="Manage employee payroll"
      onLogout={onLogout}
    >
      <div className="space-y-6">
        <Tabs defaultValue="payslips" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <TabsList>
              <TabsTrigger value="payslips">
                <FileText className="h-4 w-4 mr-2" />
                Payslips
              </TabsTrigger>
              <TabsTrigger value="summary">
                <Calculator className="h-4 w-4 mr-2" />
                Payroll Summary
              </TabsTrigger>
              <TabsTrigger value="generate">
                <DollarSign className="h-4 w-4 mr-2" />
                Generate Payroll
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
          
          <div className="flex items-center gap-4 mb-6">
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {[2023, 2024, 2025].map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <span className="text-lg font-medium">
              {months[selectedMonth]} {selectedYear}
            </span>
          </div>
          
          <TabsContent value="payslips" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payslips for {months[selectedMonth]} {selectedYear}</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredPayrollRecords.length > 0 ? (
                  <DataTable
                    data={filteredPayrollRecords}
                    columns={[
                      {
                        key: "employeeName",
                        header: "Employee",
                      },
                      {
                        key: "basicSalary",
                        header: "Basic Salary",
                        render: (row) => (
                          <span>{row.basicSalary.toLocaleString()} MT</span>
                        ),
                      },
                      {
                        key: "allowances",
                        header: "Allowances",
                        render: (row) => (
                          <span>{(row.transportAllowance + row.accommodationAllowance).toLocaleString()} MT</span>
                        ),
                      },
                      {
                        key: "overtimeAmount",
                        header: "Overtime",
                        render: (row) => (
                          <span>{row.overtimeAmount.toLocaleString()} MT</span>
                        ),
                      },
                      {
                        key: "deductions",
                        header: "Deductions",
                        render: (row) => (
                          <span>{row.deductions.toLocaleString()} MT</span>
                        ),
                      },
                      {
                        key: "netSalary",
                        header: "Net Salary",
                        render: (row) => (
                          <span className="font-semibold">{row.netSalary.toLocaleString()} MT</span>
                        ),
                      },
                      {
                        key: "status",
                        header: "Status",
                        render: (row) => (
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs inline-block",
                            row.status === 'draft' ? "bg-amber-100 text-amber-800" :
                            row.status === 'processed' ? "bg-blue-100 text-blue-800" :
                            "bg-green-100 text-green-800"
                          )}>
                            <span className="capitalize">{row.status}</span>
                          </span>
                        ),
                      },
                      {
                        key: "actions",
                        header: "",
                        render: (row) => (
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8"
                              onClick={() => handleDownloadPayslip(row)}
                            >
                              <FileDown className="h-4 w-4 mr-1" />
                              <span className="sr-only sm:not-sr-only sm:inline-block">Download</span>
                            </Button>
                            
                            {row.status === 'draft' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8"
                                onClick={() => handleUpdateStatus(row, 'processed')}
                              >
                                Process
                              </Button>
                            )}
                            
                            {row.status === 'processed' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8"
                                onClick={() => handleUpdateStatus(row, 'paid')}
                              >
                                Mark Paid
                              </Button>
                            )}
                          </div>
                        ),
                      },
                    ]}
                    searchable
                    pagination
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No payroll records found for this period.</p>
                    {employeesWithoutPayroll.length > 0 && (
                      <>
                        <p className="mb-2">Employees without payroll records:</p>
                        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 max-w-2xl mx-auto">
                          {employeesWithoutPayroll.map(employee => (
                            <div key={employee.id} className="border rounded-md p-2 text-sm">
                              {employee.fullName}
                            </div>
                          ))}
                        </div>
                        <Button 
                          className="mt-4"
                          onClick={() => setActiveTab("generate")}
                        >
                          Generate Payroll Records
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="summary" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Summary for {months[selectedMonth]} {selectedYear}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-5 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Basic Salary</h3>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                      {totalBasicSalary.toLocaleString()} MT
                    </p>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">Allowances</h3>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                      {totalAllowances.toLocaleString()} MT
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-100 dark:border-amber-800">
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">Overtime</h3>
                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                      {totalOvertime.toLocaleString()} MT
                    </p>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-100 dark:border-red-800">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Deductions</h3>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                      {totalDeductions.toLocaleString()} MT
                    </p>
                  </div>
                  
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800">
                    <h3 className="text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-1">Net Total</h3>
                    <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
                      {totalNetSalary.toLocaleString()} MT
                    </p>
                  </div>
                </div>
                
                <div className="rounded-lg overflow-hidden border">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Count
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          %
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 inline-block">
                            Draft
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {filteredPayrollRecords.filter(r => r.status === 'draft').length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {filteredPayrollRecords
                            .filter(r => r.status === 'draft')
                            .reduce((sum, r) => sum + r.netSalary, 0)
                            .toLocaleString()} MT
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {filteredPayrollRecords.length > 0 
                            ? Math.round(filteredPayrollRecords.filter(r => r.status === 'draft').length / filteredPayrollRecords.length * 100)
                            : 0}%
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 inline-block">
                            Processed
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {filteredPayrollRecords.filter(r => r.status === 'processed').length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {filteredPayrollRecords
                            .filter(r => r.status === 'processed')
                            .reduce((sum, r) => sum + r.netSalary, 0)
                            .toLocaleString()} MT
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {filteredPayrollRecords.length > 0 
                            ? Math.round(filteredPayrollRecords.filter(r => r.status === 'processed').length / filteredPayrollRecords.length * 100)
                            : 0}%
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 inline-block">
                            Paid
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {filteredPayrollRecords.filter(r => r.status === 'paid').length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {filteredPayrollRecords
                            .filter(r => r.status === 'paid')
                            .reduce((sum, r) => sum + r.netSalary, 0)
                            .toLocaleString()} MT
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {filteredPayrollRecords.length > 0 
                            ? Math.round(filteredPayrollRecords.filter(r => r.status === 'paid').length / filteredPayrollRecords.length * 100)
                            : 0}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="generate" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Payroll</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="payroll-employee">Employee</Label>
                      <Select
                        value={newPayroll.employeeId}
                        onValueChange={(value) => setNewPayroll({...newPayroll, employeeId: value})}
                      >
                        <SelectTrigger id="payroll-employee">
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
                      <Label htmlFor="payroll-status">Status</Label>
                      <Select
                        value={newPayroll.status}
                        onValueChange={(value: 'draft' | 'processed' | 'paid') => 
                          setNewPayroll({...newPayroll, status: value})
                        }
                      >
                        <SelectTrigger id="payroll-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="processed">Processed</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="payroll-month">Month</Label>
                      <Select
                        value={newPayroll.month.toString()}
                        onValueChange={(value) => setNewPayroll({...newPayroll, month: parseInt(value)})}
                      >
                        <SelectTrigger id="payroll-month">
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="payroll-year">Year</Label>
                      <Select
                        value={newPayroll.year.toString()}
                        onValueChange={(value) => setNewPayroll({...newPayroll, year: parseInt(value)})}
                      >
                        <SelectTrigger id="payroll-year">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {[2023, 2024, 2025].map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="overtime-hours">Overtime Hours</Label>
                      <Input
                        id="overtime-hours"
                        type="number"
                        min="0"
                        step="0.5"
                        value={newPayroll.overtimeHours}
                        onChange={(e) => setNewPayroll({...newPayroll, overtimeHours: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="deductions">Deductions (MT)</Label>
                      <Input
                        id="deductions"
                        type="number"
                        min="0"
                        value={newPayroll.deductions}
                        onChange={(e) => setNewPayroll({...newPayroll, deductions: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  
                  {newPayroll.employeeId && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Salary Information Preview</h3>
                      
                      {(() => {
                        const employee = employees.find(emp => emp.id === newPayroll.employeeId);
                        if (!employee) return <p>Employee not found</p>;
                        
                        const salaryStructure = employee.salaryStructure || {
                          basicSalary: 8900,
                          transportAllowance: 1000,
                          accommodationAllowance: 2000,
                          bonus: 0
                        };
                        
                        const overtimeRate = 1.5 * (salaryStructure.basicSalary / 176);
                        const overtimeAmount = Math.round(newPayroll.overtimeHours * overtimeRate);
                        
                        const netSalary = (
                          salaryStructure.basicSalary +
                          salaryStructure.transportAllowance +
                          salaryStructure.accommodationAllowance +
                          salaryStructure.bonus +
                          overtimeAmount -
                          newPayroll.deductions
                        );
                        
                        return (
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="font-medium">Basic Salary:</div>
                            <div>{salaryStructure.basicSalary.toLocaleString()} MT</div>
                            
                            <div className="font-medium">Transport Allowance:</div>
                            <div>{salaryStructure.transportAllowance.toLocaleString()} MT</div>
                            
                            <div className="font-medium">Accommodation Allowance:</div>
                            <div>{salaryStructure.accommodationAllowance.toLocaleString()} MT</div>
                            
                            <div className="font-medium">Bonus:</div>
                            <div>{salaryStructure.bonus.toLocaleString()} MT</div>
                            
                            <div className="font-medium">Overtime Amount:</div>
                            <div>{overtimeAmount.toLocaleString()} MT</div>
                            
                            <div className="font-medium">Deductions:</div>
                            <div>{newPayroll.deductions.toLocaleString()} MT</div>
                            
                            <div className="font-medium border-t pt-1">Net Salary:</div>
                            <div className="font-bold border-t pt-1">{netSalary.toLocaleString()} MT</div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleGeneratePayroll}
                    disabled={!newPayroll.employeeId}
                  >
                    Generate Payroll Record
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

export default Payroll;
