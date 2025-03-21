export type Department = 'Kitchen' | 'Sala' | 'Bar' | 'Cleaning' | 'Takeaway';

export type EmployeeStatus = 'Active' | 'On Leave' | 'Terminated' | 'Suspended';

export type LeaveType = 'Annual' | 'Sick' | 'Unpaid' | 'Other';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed';

export interface Employee {
  id: string;
  fullName: string;
  biNumber: string;
  biValidUntil?: string;
  biValid: boolean;
  hireDate: string;
  address: string;
  secondAddress?: string;
  healthCardValidUntil?: string;
  position: string;
  department: Department;
  salary: number;
  healthCardValid: boolean;
  status: EmployeeStatus;
  email: string;
  phone: string;
  remainingLeaves: number;
  picture?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  startDate: string;
  endDate: string;
  type: LeaveType;
  status: LeaveStatus;
  documentUrl?: string;
  reason: string;
  createdAt: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  timeIn: string;
  timeOut: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day';
  reason?: string;
}

// Sample data
export const employees: Employee[] = [
  {
    id: '1',
    fullName: 'João Silva',
    biNumber: 'BI123456789',
    biValidUntil: '2026-01-15',
    hireDate: '2022-01-15',
    address: 'Rua Principal 123, Luanda',
    secondAddress: '',
    position: 'Head Chef',
    department: 'Kitchen',
    salary: 220000,
    healthCardValid: true,
    healthCardValidUntil: '2025-01-15',
    biValid: true,
    status: 'Active',
    email: 'joao.silva@bbqhouse.com',
    phone: '+244 923 456 789',
    remainingLeaves: 23
  },
  {
    id: '2',
    fullName: 'Maria Santos',
    biNumber: 'BI987654321',
    biValidUntil: '2025-03-10',
    hireDate: '2022-03-10',
    address: 'Avenida Central 45, Luanda',
    secondAddress: '',
    position: 'Restaurant Manager',
    department: 'Sala',
    salary: 250000,
    healthCardValid: true,
    healthCardValidUntil: '2024-06-15',
    biValid: true,
    status: 'Active',
    email: 'maria.santos@bbqhouse.com',
    phone: '+244 923 123 456',
    remainingLeaves: 25
  },
  {
    id: '3',
    fullName: 'Carlos Mendes',
    biNumber: 'BI456789123',
    biValidUntil: '2024-08-20',
    hireDate: '2022-02-20',
    address: 'Rua do Sol 78, Luanda',
    secondAddress: '',
    position: 'Bartender',
    department: 'Bar',
    salary: 180000,
    healthCardValid: true,
    healthCardValidUntil: '2024-12-20',
    biValid: true,
    status: 'On Leave',
    email: 'carlos.mendes@bbqhouse.com',
    phone: '+244 923 789 456',
    remainingLeaves: 15
  },
  {
    id: '4',
    fullName: 'Ana Costa',
    biNumber: 'BI789123456',
    biValidUntil: '2023-10-05',
    hireDate: '2022-04-05',
    address: 'Travessa da Lua 32, Luanda',
    secondAddress: '',
    position: 'Cleaning Supervisor',
    department: 'Cleaning',
    salary: 150000,
    healthCardValid: true,
    healthCardValidUntil: '2024-04-05',
    biValid: false,
    status: 'Active',
    email: 'ana.costa@bbqhouse.com',
    phone: '+244 923 456 123',
    remainingLeaves: 18
  },
  {
    id: '5',
    fullName: 'Pedro Neves',
    biNumber: 'BI321654987',
    biValidUntil: '2024-05-12',
    hireDate: '2022-05-12',
    address: 'Rua das Flores 56, Luanda',
    secondAddress: '',
    position: 'Takeaway Coordinator',
    department: 'Takeaway',
    salary: 170000,
    healthCardValid: false,
    healthCardValidUntil: '2023-11-12',
    biValid: true,
    status: 'Active',
    email: 'pedro.neves@bbqhouse.com',
    phone: '+244 923 987 123',
    remainingLeaves: 19
  }
];

export const leaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '3',
    employeeName: 'Carlos Mendes',
    department: 'Bar',
    startDate: '2023-10-15',
    endDate: '2023-10-20',
    type: 'Annual',
    status: 'Approved',
    documentUrl: '/documents/leave-1.pdf',
    reason: 'Family vacation',
    createdAt: '2023-09-30'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Maria Santos',
    department: 'Sala',
    startDate: '2023-11-05',
    endDate: '2023-11-07',
    type: 'Sick',
    status: 'Completed',
    documentUrl: '/documents/leave-2.pdf',
    reason: 'Cold and fever',
    createdAt: '2023-11-04'
  },
  {
    id: '3',
    employeeId: '5',
    employeeName: 'Pedro Neves',
    department: 'Takeaway',
    startDate: '2023-12-24',
    endDate: '2023-12-26',
    type: 'Annual',
    status: 'Pending',
    reason: 'Christmas holidays',
    createdAt: '2023-12-10'
  }
];

export const attendanceRecords: Attendance[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'João Silva',
    date: '2023-12-14',
    timeIn: '08:05:32',
    timeOut: '17:02:45',
    status: 'Present'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Maria Santos',
    date: '2023-12-14',
    timeIn: '08:15:10',
    timeOut: '17:30:22',
    status: 'Present'
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Carlos Mendes',
    date: '2023-12-14',
    timeIn: '',
    timeOut: '',
    status: 'Absent',
    reason: 'On approved leave'
  },
  {
    id: '4',
    employeeId: '4',
    employeeName: 'Ana Costa',
    date: '2023-12-14',
    timeIn: '08:45:23',
    timeOut: '17:15:40',
    status: 'Late',
    reason: 'Traffic'
  },
  {
    id: '5',
    employeeId: '5',
    employeeName: 'Pedro Neves',
    date: '2023-12-14',
    timeIn: '08:02:10',
    timeOut: '17:10:05',
    status: 'Present'
  }
];

export const departmentColors = {
  'Kitchen': 'bg-amber-500',
  'Sala': 'bg-emerald-500',
  'Bar': 'bg-violet-500',
  'Cleaning': 'bg-sky-500',
  'Takeaway': 'bg-rose-500'
};

export const statusColors = {
  'Active': 'bg-green-500',
  'On Leave': 'bg-amber-500',
  'Terminated': 'bg-red-500',
  'Suspended': 'bg-gray-500',
  'Pending': 'bg-blue-500',
  'Approved': 'bg-green-500',
  'Rejected': 'bg-red-500',
  'Completed': 'bg-purple-500',
  'Present': 'bg-green-500',
  'Absent': 'bg-red-500',
  'Late': 'bg-amber-500',
  'Half Day': 'bg-blue-500'
};

export const getDepartmentEmployeeCount = (department: Department): number => {
  return employees.filter(employee => employee.department === department).length;
};

export const calculateDashboardStats = () => {
  return {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(emp => emp.status === 'Active').length,
    onLeaveEmployees: employees.filter(emp => emp.status === 'On Leave').length,
    totalDepartments: 5,
    pendingLeaveRequests: leaveRequests.filter(leave => leave.status === 'Pending').length,
    departmentStats: [
      { name: 'Kitchen', count: getDepartmentEmployeeCount('Kitchen'), color: departmentColors['Kitchen'] },
      { name: 'Sala', count: getDepartmentEmployeeCount('Sala'), color: departmentColors['Sala'] },
      { name: 'Bar', count: getDepartmentEmployeeCount('Bar'), color: departmentColors['Bar'] },
      { name: 'Cleaning', count: getDepartmentEmployeeCount('Cleaning'), color: departmentColors['Cleaning'] },
      { name: 'Takeaway', count: getDepartmentEmployeeCount('Takeaway'), color: departmentColors['Takeaway'] }
    ]
  };
};
