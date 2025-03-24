
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  employeeId?: string;
  timestamp: string;
  actionType?: 'view-employee' | 'approve-leave' | 'update-document';
}

export interface LeaveAllowance {
  year: number;
  daysEntitled: number;
  daysTaken: number;
  remaining: number;
  status: 'unused' | 'partially-used' | 'fully-used';
}

export interface LeaveRecord {
  id: string;
  startDate: string;
  endDate: string;
  days: number;
  year: number;
  type: 'annual' | 'sick' | 'unpaid' | 'other';
  status: 'completed' | 'scheduled';
  notes?: string;
  employeeId?: string;
  employeeName?: string;
}

export interface SalaryStructure {
  basicSalary: number;
  transportAllowance: number;
  accommodationAllowance: number;
  bonus: number;
  totalSalary: number;
}

export interface Company {
  id: string;
  name: 'BBQHouse LDA' | 'SALT LDA' | 'Executive Cleaning LDA';
  contractTemplate: string;
}

export interface BIDetails {
  issueDate: string;
  expiryDate: string;
}
