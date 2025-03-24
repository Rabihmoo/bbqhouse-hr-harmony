
import { useState, useEffect } from "react";
import { format } from "date-fns";

export interface BIDetails {
  biNumber: string;
  biValid: boolean;
  biValidUntil: string;
  biDetails: {
    issueDate: string;
    expiryDate: string;
  };
}

export const useEmployeeBIDetails = (
  open: boolean,
  isEditing: boolean,
  initialData: any | null
) => {
  const [biDetails, setBIDetails] = useState<BIDetails>({
    biNumber: "",
    biValid: false,
    biValidUntil: "",
    biDetails: {
      issueDate: "",
      expiryDate: ""
    }
  });

  useEffect(() => {
    if (open) {
      if (isEditing && initialData) {
        setBIDetails({
          biNumber: initialData.biNumber || "",
          biValid: initialData.biValid || false,
          biValidUntil: initialData.biValidUntil || "",
          biDetails: {
            issueDate: initialData.biDetails?.issueDate || "",
            expiryDate: initialData.biDetails?.expiryDate || initialData.biValidUntil || ""
          }
        });
      } else {
        setBIDetails({
          biNumber: "",
          biValid: false,
          biValidUntil: "",
          biDetails: {
            issueDate: "",
            expiryDate: ""
          }
        });
      }
    }
  }, [open, isEditing, initialData]);

  const handleBIInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle nested BI details
    if (name.startsWith('biDetails.')) {
      const biField = name.split('.')[1];
      setBIDetails((prevState) => ({
        ...prevState,
        biDetails: {
          ...prevState.biDetails,
          [biField]: value
        },
        // Update biValidUntil for backward compatibility
        ...(biField === 'expiryDate' ? { biValidUntil: value } : {})
      }));
    } else {
      setBIDetails((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleBICheckboxChange = (name: string, checked: boolean) => {
    setBIDetails((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleBIDateChange = (field: string, date: Date | undefined) => {
    if (!date) return;
    
    const dateStr = format(date, 'yyyy-MM-dd');

    if (field === 'biDetails.issueDate') {
      setBIDetails((prevState) => ({
        ...prevState,
        biDetails: {
          ...prevState.biDetails,
          issueDate: dateStr
        }
      }));
    } 
    else if (field === 'biDetails.expiryDate') {
      setBIDetails((prevState) => ({
        ...prevState,
        biDetails: {
          ...prevState.biDetails,
          expiryDate: dateStr
        },
        biValidUntil: dateStr // For backward compatibility
      }));
    }
  };

  return {
    biDetails,
    handleBIInputChange,
    handleBICheckboxChange,
    handleBIDateChange,
    setBIDetails,
  };
};
