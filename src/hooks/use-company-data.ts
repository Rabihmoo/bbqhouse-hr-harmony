
import { useState, useEffect } from 'react';
import { Company } from '@/types/company';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = 'myr-companies-data';

// Initial demo data
const initialCompanies: Company[] = [
  {
    id: uuidv4(),
    name: 'BBQHouse LDA',
    address: 'Avenida Julius Nyerere 1024, Maputo',
    nuit: '123456789',
    sections: ['Kitchen', 'Bar', 'Sala'],
    documents: [],
    customFields: []
  },
  {
    id: uuidv4(),
    name: 'SALT LDA',
    address: 'Av. 24 de Julho 856, Maputo',
    nuit: '987654321',
    sections: ['Kitchen', 'Admin'],
    documents: [],
    customFields: []
  },
  {
    id: uuidv4(),
    name: 'Executive Cleaning LDA',
    address: 'Rua dos Desportistas 12, Maputo',
    nuit: '456789123',
    sections: ['Cleaning', 'Admin', 'Management'],
    documents: [],
    customFields: [
      {
        id: uuidv4(),
        fieldName: 'Warehouse Contact',
        fieldType: 'text',
        fieldValue: 'Maria Santos: +258 84 123 4567'
      },
      {
        id: uuidv4(),
        fieldName: 'IBAN',
        fieldType: 'text',
        fieldValue: 'MZ59000100000012345678901'
      }
    ]
  }
];

export const useCompanyData = () => {
  const [companies, setCompanies] = useState<Company[]>(() => {
    const savedCompanies = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedCompanies ? JSON.parse(savedCompanies) : initialCompanies;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(companies));
  }, [companies]);

  // Function to add a new company
  const addCompany = (company: Company) => {
    // Ensure the company has a unique ID
    if (!company.id) {
      company.id = uuidv4();
    }
    setCompanies([...companies, company]);
    toast.success(`Company "${company.name}" added successfully`);
    return company;
  };

  // Function to update an existing company
  const updateCompany = (updatedCompany: Company) => {
    setCompanies(
      companies.map(company => 
        company.id === updatedCompany.id ? updatedCompany : company
      )
    );
    toast.success(`Company "${updatedCompany.name}" updated successfully`);
    return updatedCompany;
  };

  // Function to delete a company
  const deleteCompany = (companyId: string) => {
    const companyToDelete = companies.find(company => company.id === companyId);
    setCompanies(companies.filter(company => company.id !== companyId));
    if (companyToDelete) {
      toast.success(`Company "${companyToDelete.name}" deleted successfully`);
    }
  };

  // Function to get a company by ID
  const getCompanyById = (companyId: string) => {
    return companies.find(company => company.id === companyId);
  };

  return {
    companies,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompanyById
  };
};
