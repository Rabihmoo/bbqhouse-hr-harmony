
export type CompanyId = 'bbq' | 'salt' | 'cleaning';
export type CategoryId = 'kitchen' | 'sala' | 'bar' | 'manager' | 'cleaning' | 'weekly' | 'monthly';

export interface Company {
  id: CompanyId;
  name: string;
}

export interface Category {
  id: CategoryId;
  name: string;
}

export interface ChecklistItem {
  id: string;
  name: string;
  size: string;
  date: string;
  fileData?: ArrayBuffer | null;
  mimeType?: string;
}

export interface CompanyChecklists {
  [companyId: string]: {
    [categoryId: string]: ChecklistItem[];
  }
}
