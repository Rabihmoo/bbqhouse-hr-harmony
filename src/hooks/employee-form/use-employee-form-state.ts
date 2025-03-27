
import { ChangeEvent } from "react";
import { useEmployeeBasicInfo } from "./use-employee-basic-info";
import { useEmployeeDocuments } from "./use-employee-documents";
import { useEmployeeBIDetails } from "./use-employee-bi-details";
import { useEmployeeSalary } from "./use-employee-salary";
import { useAdditionalFormData } from "./use-additional-form-data";
import { useFormStateHandlers } from "./use-form-state-handlers";
import { useFormSubmission } from "./use-form-submission";
import { useFormReset } from "./use-form-reset";
import { useEmployeeDocumentsUpload } from "./use-employee-documents-upload";

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

  const {
    documents,
    handleDocumentUpload,
    setDocuments
  } = useEmployeeDocumentsUpload(open, isEditing, initialData);

  // This is for any other form fields that aren't handled by the specific hooks
  const {
    otherFormData,
    handleInputChange: handleOtherInputChange,
    setOtherFormData,
  } = useAdditionalFormData(open, isEditing, initialData);

  // Combined data from all hooks - ensure we include status and company
  const formData = {
    ...basicInfo,
    ...biDetails,
    ...documentStatus,
    ...salaryInfo,
    ...otherFormData,
    documents,
    // Explicitly include these fields to ensure they're in the formData
    status: basicInfo.status || "Active",
    company: basicInfo.company || "BBQHouse LDA",
    address: basicInfo.address || "",
    secondAddress: basicInfo.secondAddress || "",
    email: basicInfo.email || "",
    phone: basicInfo.phone || ""
  };
  
  // Define processFormData here before it's used
  const processFormData = () => {
    // Convert string salary values to numbers
    const processedSalaryData = processSalaryData();
    
    // Ensure status and company are included in the processed data
    return {
      ...formData,
      ...processedSalaryData,
      status: formData.status,
      company: formData.company,
      address: formData.address,
      secondAddress: formData.secondAddress,
      email: formData.email,
      phone: formData.phone
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
    setIsDirty,
    setDocuments
  });

  return {
    formData,
    isDirty,
    setIsDirty,
    ...stateHandlers,
    handleBIInputChange,
    handleDocumentUpload,
    processFormData,
    handleSubmit,
    resetForm,
  };
};
