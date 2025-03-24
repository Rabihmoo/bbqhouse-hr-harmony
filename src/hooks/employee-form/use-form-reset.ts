
import { Dispatch, SetStateAction } from "react";
import { EmployeeBasicInfo } from "./use-employee-basic-info";
import { BIDetails } from "./use-employee-bi-details";
import { DocumentStatus } from "./use-employee-documents";
import { SalaryStructure } from "./use-employee-salary";
import { OtherFormData } from "./use-additional-form-data";

interface ResetFormProps {
  setBasicInfo: Dispatch<SetStateAction<EmployeeBasicInfo>>;
  setBIDetails: Dispatch<SetStateAction<BIDetails>>;
  setDocumentStatus: Dispatch<SetStateAction<DocumentStatus>>;
  setSalaryInfo: Dispatch<SetStateAction<SalaryStructure>>;
  setOtherFormData: Dispatch<SetStateAction<OtherFormData>>;
  setIsDirty: Dispatch<SetStateAction<boolean>>;
}

export const useFormReset = ({
  setBasicInfo,
  setBIDetails, 
  setDocumentStatus,
  setSalaryInfo,
  setOtherFormData,
  setIsDirty
}: ResetFormProps) => {
  
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
    resetForm
  };
};
