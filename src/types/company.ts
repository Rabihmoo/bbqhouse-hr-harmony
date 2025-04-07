
export interface CustomField {
  id: string;
  fieldName: string;
  fieldType: 'text' | 'number' | 'file' | 'dropdown' | 'date';
  fieldValue: string | number | string[] | Date | null;
  options?: string[]; // For dropdown fields
}

export interface CompanyDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  nuit: string;
  sections: string[];
  documents: CompanyDocument[];
  customFields: CustomField[];
}
