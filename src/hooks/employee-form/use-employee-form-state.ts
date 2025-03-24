
import { ChangeEvent } from "react";
import { useEmployeeBasicInfo } from "./use-employee-basic-info";
import { useEmployeeDocuments } from "./use-employee-documents";
import { useEmployeeBIDetails } from "./use-employee-bi-details";
import { useEmployeeSalary } from "./use-employee-salary";
import { useAdditionalFormData } from "./use-additional-form-data";
import { useFormStateHandlers } from "./use-form-state-handlers";
import { useFormSubmission } from "./use-form-submission";
import { useFormReset } from "./use-form-reset";

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

  // Combined data from all hooks
  const formData = {
    ...basicInfo,
    ...biDetails,
    ...documentStatus,
    ...salaryInfo,
    ...otherFormData,
  };
  
  // Define processFormData here before it's used
  const processFormData = () => {
    // Convert string salary values to numbers
    const processedSalaryData = processSalaryData();
    
    return {
      ...formData,
      ...processedSalaryData
    };
  };

  // Form submission and dirty state handling
  const {
    isDirty,
    setIsDirty,
    handleSubmit
  } = useFormSubmission(onSubmit, processFormData);

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

  // Form reset functionality
  const { resetForm } = useFormReset({
    setBasicInfo,
    setBIDetails,
    setDocumentStatus,
    setSalaryInfo,
    setOtherFormData,
    setIsDirty
  });

  return {
    formData,
    isDirty,
    setIsDirty,
    ...stateHandlers,
    handleBIInputChange, // Add this explicitly
    processFormData,
    handleSubmit,
    resetForm,
  };
};
