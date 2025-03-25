
import { Dispatch, SetStateAction } from 'react';
import { EmployeeBasicInfo } from './use-employee-basic-info';
import { BIDetails } from './use-employee-bi-details';
import { DocumentStatus } from './use-employee-documents';
import { EmployeeDocument } from './use-employee-documents-upload';

interface FormResetHooksProps {
  setBasicInfo: Dispatch<SetStateAction<EmployeeBasicInfo>>;
  setBIDetails: Dispatch<SetStateAction<BIDetails>>;
  setDocumentStatus: Dispatch<SetStateAction<DocumentStatus>>;
  setSalaryInfo: Dispatch<SetStateAction<any>>;
  setOtherFormData: Dispatch<SetStateAction<any>>;
  setIsDirty: Dispatch<SetStateAction<boolean>>;
  setDocuments?: Dispatch<SetStateAction<Record<string, EmployeeDocument>>>;
}

export const useFormReset = ({
  setBasicInfo,
  setBIDetails,
  setDocumentStatus,
  setSalaryInfo,
  setOtherFormData,
  setIsDirty,
  setDocuments
}: FormResetHooksProps) => {
  // Reset all form state hooks to default values
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
      salary: 0,
      salaryStructure: {
        basicSalary: 0,
        transportAllowance: 0,
        accommodationAllowance: 0,
        bonus: 0,
        totalSalary: 0
      }
    });

    setOtherFormData({});

    if (setDocuments) {
      setDocuments({
        bi: { type: "bi", file: null, uploaded: false },
        healthCard: { type: "healthCard", file: null, uploaded: false },
        tax: { type: "tax", file: null, uploaded: false },
        nuit: { type: "nuit", file: null, uploaded: false },
        declaration: { type: "declaration", file: null, uploaded: false },
        cv: { type: "cv", file: null, uploaded: false }
      });
    }

    setIsDirty(false);
  };

  return {
    resetForm
  };
};
