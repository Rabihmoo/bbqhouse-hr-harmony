
import { CompanyChecklists } from '@/types/checklists';

// Define initial checklist data
export const initialChecklists: CompanyChecklists = {
  bbq: {
    kitchen: [
      { id: '1', name: 'Kitchen Opening Checklist.docx', size: '24KB', date: '2023-10-15', fileData: null },
      { id: '2', name: 'Kitchen Closing Checklist.docx', size: '32KB', date: '2023-10-15', fileData: null }
    ],
    sala: [
      { id: '3', name: 'Sala Opening Procedures.docx', size: '18KB', date: '2023-10-10', fileData: null }
    ],
    bar: [
      { id: '4', name: 'Bar Inventory Checklist.docx', size: '42KB', date: '2023-10-01', fileData: null }
    ],
    manager: [],
    cleaning: [],
    weekly: [],
    monthly: []
  },
  salt: {
    kitchen: [],
    sala: [],
    bar: [],
    manager: [],
    cleaning: [],
    weekly: [],
    monthly: []
  },
  cleaning: {
    kitchen: [],
    sala: [],
    bar: [],
    manager: [],
    cleaning: [
      { id: '5', name: 'Daily Cleaning Schedule.docx', size: '28KB', date: '2023-09-28', fileData: null }
    ],
    weekly: [],
    monthly: []
  }
};
