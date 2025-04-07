
import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { toast } from "sonner";
import { useEmployeeData } from "@/hooks/use-employee-data";
import { AttendanceRecord, NewAttendance } from '@/types/attendance';

export const useAttendanceState = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const [activeCompany, setActiveCompany] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const { employees } = useEmployeeData();
  
  const [newAttendance, setNewAttendance] = useState<NewAttendance>({
    employeeId: "",
    date: new Date(),
    clockIn: "08:00",
    clockOut: "17:00",
    status: "present",
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

  return {
    activeTab,
    setActiveTab,
    activeCompany,
    setActiveCompany,
    selectedDate,
    setSelectedDate,
    attendanceRecords,
    setAttendanceRecords,
    newAttendance,
    setNewAttendance,
    filteredDailyRecords,
    employeesWithoutAttendance,
    handleSubmitAttendance,
    employees
  };
};
