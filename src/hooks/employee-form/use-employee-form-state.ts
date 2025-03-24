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
  // Use the individual hooks
  const {
    basicInfo,
    handleBasicInfoChange,
    handleBasicInfoDateChange,
    setBasicInfo,
  } = useEmployeeBasicInfo(open, isEditing, initialData);

  const {
    biDetails,
    handleBIDetailsChange,
    handleBIDetailsDateChange,
    setBIDetails,
  } = useEmployeeBIDetails(open, isEditing, initialData);

  const {
    salaryInfo,
    handleSalaryChange,
    calculateTotalSalary,
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
  };

  // Combined data from all hooks
  const formData = {
    ...basicInfo,
    ...biDetails,
    ...documentStatus,
    ...salaryInfo,
    ...otherFormData,
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Reset all form data
  const resetForm = () => {
    setBasicInfo({
      fullName: "",
      position: "",
      department: "Kitchen",
      hireDate: "",
      status: "Active",
      inssNumber: "",
    });
    
    setBIDetails({
      biNumber: "",
      biValid: true,
      biValidUntil: "",
      biDetails: {
        issueDate: "",
        expiryDate: "",
      },
    });
    
    setDocumentStatus({
      healthCardValid: false,
      healthCardValidUntil: "",
    });
    
    setSalaryInfo({
      salary: 0,
      salaryStructure: {
        basicSalary: 0,
        transportAllowance: 0,
        accommodationAllowance: 0,
        bonus: 0,
        totalSalary: 0,
      },
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
  };

  return {
    formData,
    handleInputChange,
    handleBasicInfoChange,
    handleBasicInfoDateChange,
    handleBIDetailsChange,
    handleBIDetailsDateChange,
    handleSalaryChange,
    handleDocumentSwitchChange,
    handleDocumentDateChange,
    calculateTotalSalary,
    handleSubmit,
    resetForm,
  };
};
