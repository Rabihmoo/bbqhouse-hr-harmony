
import { useState, useEffect, ChangeEvent } from "react";
import { useEmployeeBasicInfo } from "./use-employee-basic-info";
import { useEmployeeDocuments } from "./use-employee-documents";
import { useEmployeeBIDetails } from "./use-employee-bi-details";
import { useEmployeeSalary } from "./use-employee-salary";
import { useAdditionalFormData } from "./use-additional-form-data";
import { useFormStateHandlers } from "./use-form-state-handlers";
import { useFormSubmission } from "./use-form-submission";

// This is the main hook that combines all the other hooks
export const useEmployeeFormState = (
  open: boolean,
  isEditing: boolean,
  initialData: any | null,
  onSubmit: (data: any) => void
) => {
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

  // Form submission and dirty state handling
  const {
    isDirty,
    setIsDirty,
    handleSubmit
  } = useFormSubmission(onSubmit, processFormData);

  // Combined data from all hooks
  const formData = {
    ...basicInfo,
    ...biDetails,
    ...documentStatus,
    ...salaryInfo,
    ...otherFormData,
  };

  // Event handlers with dirty state tracking
  const stateHandlers = useFormStateHandlers(
    setIsDirty,
    handleBasicInfoChange,
    handleBIInputChange,
    handleBICheckboxChange,
    handleBIDateChange,
    handleSalaryChange,
    handleSelectChange,
    handleImageChange,
    handleDocumentSwitchChange,
    handleDocumentDateChange,
    handleOtherInputChange,
    processSalaryData
  );

  // Process form data for submission
  const processFormData = () => {
    // Convert string salary values to numbers
    const processedSalaryData = processSalaryData();
    
    return {
      ...formData,
      ...processedSalaryData
    };
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
    ...stateHandlers,
    processFormData,
    handleSubmit,
    resetForm,
  };
};
