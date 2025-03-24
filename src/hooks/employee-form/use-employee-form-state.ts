import { useState, useEffect, ChangeEvent } from "react";
import { useEmployeeBasicInfo } from "./use-employee-basic-info";
import { useEmployeeDocuments } from "./use-employee-documents";
import { useEmployeeBIDetails } from "./use-employee-bi-details";
import { useEmployeeSalary } from "./use-employee-salary";

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
    handleBIInputChange: handleBIDetailsChange,
    handleBICheckboxChange,
    handleBIDateChange: handleBIDetailsDateChange,
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
  const [otherFormData, setOtherFormData] = useState<any>({});

  useEffect(() => {
    if (open) {
      if (isEditing && initialData) {
        // Other fields not covered by the specific hooks
        setOtherFormData({
          id: initialData.id,
          email: initialData.email || "",
          phone: initialData.phone || "",
          address: initialData.address || "",
          secondAddress: initialData.secondAddress || "",
          picture: initialData.picture || "",
          company: initialData.company || "BBQHouse LDA",
          leaveAllowances: initialData.leaveAllowances || [],
          leaveRecords: initialData.leaveRecords || [],
        });
      } else {
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
      }
    }
  }, [open, isEditing, initialData]);

  // Generic handler for other form fields
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOtherFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
    setIsDirty(true);
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    handleBICheckboxChange(name, checked);
    handleDocumentSwitchChange(name, checked);
    setIsDirty(true);
  };

  const handleDateChange = (field: string, date: Date | undefined) => {
    if (field.startsWith('biDetails.')) {
      handleBIDetailsDateChange(field, date);
    } else {
      handleDocumentDateChange(field, date);
    }
    setIsDirty(true);
  };

  // Calculate total salary for the form
  const calculateTotalSalary = (changedField: string, newValue: string) => {
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
    handleBasicInfoChange,
    handleSelectChange,
    handleImageChange,
    handleBIDetailsChange,
    handleBIDetailsDateChange,
    handleSalaryChange,
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
