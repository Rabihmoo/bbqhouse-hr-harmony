
import { useState } from "react";
import { useEmployeeBasicInfo, EmployeeBasicInfo } from "./use-employee-basic-info";
import { useEmployeeBIDetails, BIDetails } from "./use-employee-bi-details";
import { useEmployeeSalary, SalaryStructure } from "./use-employee-salary";
import { useEmployeeDocuments, DocumentStatus } from "./use-employee-documents";

export interface EmployeeFormData extends EmployeeBasicInfo, BIDetails, SalaryStructure, DocumentStatus {}

interface UseEmployeeFormStateProps {
  open: boolean;
  initialData: any | null;
  isEditing: boolean;
}

export const useEmployeeFormState = ({ open, initialData, isEditing }: UseEmployeeFormStateProps) => {
  const [isDirty, setIsDirty] = useState(false);

  const {
    basicInfo,
    handleBasicInfoChange,
    handleSelectChange,
    handleImageChange,
  } = useEmployeeBasicInfo(open, isEditing, initialData);

  const {
    biDetails,
    handleBIInputChange,
    handleBICheckboxChange,
    handleBIDateChange,
  } = useEmployeeBIDetails(open, isEditing, initialData);

  const {
    salaryInfo,
    handleSalaryChange,
    processSalaryData,
  } = useEmployeeSalary(open, isEditing, initialData);

  const {
    documentStatus,
    handleDocumentSwitchChange,
    handleDocumentDateChange,
  } = useEmployeeDocuments(open, isEditing, initialData);

  // Combined form data for easy access
  const formData: EmployeeFormData = {
    ...basicInfo,
    ...biDetails,
    ...salaryInfo,
    ...documentStatus
  };

  // Mark form as dirty when any change happens
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    
    if (name.startsWith('biDetails.')) {
      handleBIInputChange(e);
    } else if (name.startsWith('salaryStructure.')) {
      handleSalaryChange(e);
    } else {
      handleBasicInfoChange(e);
    }
    
    setIsDirty(true);
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    if (name === 'biValid') {
      handleBICheckboxChange(name, checked);
    } else if (name === 'healthCardValid') {
      handleDocumentSwitchChange(name, checked);
    }
    
    setIsDirty(true);
  };

  const handleDateChange = (field: string, date: Date | undefined) => {
    if (!date) return;
    
    if (field.startsWith('biDetails.')) {
      handleBIDateChange(field, date);
    } else if (field === 'healthCardValidUntil') {
      handleDocumentDateChange(field, date);
    } else if (field === 'hireDate') {
      handleSelectChange(field, date.toISOString().split('T')[0]);
    }
    
    setIsDirty(true);
  };

  const processFormData = () => {
    const salaryData = processSalaryData();
    
    return {
      ...basicInfo,
      ...biDetails,
      ...salaryData,
      ...documentStatus,
      id: initialData?.id || undefined,
    };
  };

  return {
    formData,
    isDirty,
    setIsDirty,
    handleInputChange,
    handleCheckboxChange,
    handleImageChange,
    handleSelectChange,
    handleDateChange,
    processFormData
  };
};
