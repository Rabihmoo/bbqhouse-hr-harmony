
import { useState, useEffect, ChangeEvent } from "react";
import { useEmployeeBasicInfo } from "./use-employee-basic-info";
import { useEmployeeDocuments } from "./use-employee-documents";
import { useEmployeeBIDetails } from "./use-employee-bi-details";
import { useEmployeeSalary } from "./use-employee-salary";
import { useAdditionalFormData } from "./use-additional-form-data";

// This is the main hook that combines all the other hooks
export const useEmployeeFormState = (
  open: boolean,
  isEditing: boolean,
  initialData: any | null,
  onSubmit: (data: any) => void
) => {
  const [isDirty, setIsDirty] = useState(false);

  // Use the individual hooks
  const {
    basicInfo,
    handleBasicInfoChange,
    handleSelectChange,
    handleImageChange,
    setBasicInfo,
  } = useEmployeeBasicInfo(open, isEditing, initialData);

  const {
    biDetails,
    handleBIInputChange,
    handleBICheckboxChange,
    handleBIDateChange,
    setBIDetails,
  } = useEmployeeBIDetails(open, isEditing, initialData);

  const {
    salaryInfo,
    handleSalaryChange,
    processSalaryData,
    setSalaryInfo,
  } = useEmployeeSalary(open, isEditing, initialData);

  const {
    documentStatus,
    handleDocumentSwitchChange,
    handleDocumentDateChange,
    setDocumentStatus,
  } = useEmployeeDocuments(open, isEditing, initialData);

  // This is for any other form fields that aren't handled by the specific hooks
  const {
    otherFormData,
    handleInputChange: handleOtherInputChange,
    setOtherFormData,
  } = useAdditionalFormData(open, isEditing, initialData);

  // Wrapper methods to ensure all changes mark the form as dirty
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    handleOtherInputChange(e);
    setIsDirty(true);
  };

  const handleBasicInfoInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    handleBasicInfoChange(e);
    setIsDirty(true);
  };

  const handleSelectInputChange = (name: string, value: string) => {
    handleSelectChange(name, value);
    setIsDirty(true);
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    if (name.startsWith('bi')) {
      handleBICheckboxChange(name, checked);
    } else {
      handleDocumentSwitchChange(name, checked);
    }
    setIsDirty(true);
  };

  const handleDateChange = (field: string, date: Date | undefined) => {
    if (field.startsWith('biDetails.')) {
      handleBIDateChange(field, date);
    } else {
      handleDocumentDateChange(field, date);
    }
    setIsDirty(true);
  };

  const handleSalaryInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleSalaryChange(e);
    setIsDirty(true);
  };

  const handleImageUploadChange = (imageUrl: string) => {
    handleImageChange(imageUrl);
    setIsDirty(true);
  };

  // Calculate total salary for the form
  const calculateTotalSalary = () => {
    processSalaryData();
    setIsDirty(true);
  };

  // Combined data from all hooks
  const formData = {
    ...basicInfo,
    ...biDetails,
    ...documentStatus,
    ...salaryInfo,
    ...otherFormData,
  };

  // Process form data for submission
  const processFormData = () => {
    // Convert string salary values to numbers
    const processedSalaryData = processSalaryData();
    
    return {
      ...formData,
      ...processedSalaryData
    };
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const processed = processFormData();
    onSubmit(processed);
    setIsDirty(false);
  };

  // Reset all form data
  const resetForm = () => {
    setBasicInfo({
      fullName: "",
      address: "",
      secondAddress: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      hireDate: "",
      inssNumber: "",
      company: "BBQHouse LDA",
      picture: "",
    });
    
    setBIDetails({
      biNumber: "",
      biValid: false,
      biValidUntil: "",
      biDetails: {
        issueDate: "",
        expiryDate: ""
      }
    });
    
    setDocumentStatus({
      healthCardValid: false,
      healthCardValidUntil: "",
    });
    
    setSalaryInfo({
      salary: "",
      salaryStructure: {
        basicSalary: "",
        transportAllowance: "",
        accommodationAllowance: "",
        bonus: "",
        totalSalary: ""
      }
    });
    
    setOtherFormData({
      email: "",
      phone: "",
      address: "",
      secondAddress: "",
      picture: "",
      company: "BBQHouse LDA",
      leaveAllowances: [],
      leaveRecords: [],
    });
    
    setIsDirty(false);
  };

  return {
    formData,
    isDirty,
    setIsDirty,
    handleInputChange,
    handleBasicInfoChange: handleBasicInfoInputChange,
    handleSelectChange: handleSelectInputChange,
    handleImageChange: handleImageUploadChange,
    handleBIInputChange,
    handleSalaryChange: handleSalaryInputChange,
    handleCheckboxChange,
    handleDocumentSwitchChange,
    handleDocumentDateChange,
    handleDateChange,
    calculateTotalSalary,
    processFormData,
    handleSubmit,
    resetForm,
  };
};
