
// Define types for our data structure
export type CompanyId = 'bbq' | 'salt' | 'cleaning';
export type CategoryId = 'kitchen' | 'sala' | 'bar' | 'manager' | 'cleaning' | 'weekly' | 'monthly';

export interface ChecklistItem {
  id: string;
  name: string;
  size: string;
  date: string;
}

export type CategoryChecklists = {
  [key in CategoryId]: ChecklistItem[];
};

export type CompanyChecklists = {
  [key in CompanyId]: CategoryChecklists;
};

export interface Company {
  id: CompanyId;
  name: string;
}

export interface Category {
  id: CategoryId;
  name: string;
}
