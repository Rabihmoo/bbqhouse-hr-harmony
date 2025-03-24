
import { useState, useEffect } from "react";
import { format } from "date-fns";

export interface DocumentStatus {
  healthCardValid: boolean;
  healthCardValidUntil: string;
}

export const useEmployeeDocuments = (
  open: boolean,
  isEditing: boolean,
  initialData: any | null
) => {
  const [documentStatus, setDocumentStatus] = useState<DocumentStatus>({
    healthCardValid: false,
    healthCardValidUntil: "",
  });

  useEffect(() => {
    if (open) {
      if (isEditing && initialData) {
        setDocumentStatus({
          healthCardValid: initialData.healthCardValid || false,
          healthCardValidUntil: initialData.healthCardValidUntil || "",
        });
      } else {
        setDocumentStatus({
          healthCardValid: false,
          healthCardValidUntil: "",
        });
      }
    }
  }, [open, isEditing, initialData]);

  const handleDocumentSwitchChange = (name: string, checked: boolean) => {
    setDocumentStatus((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleDocumentDateChange = (field: string, date: Date | undefined) => {
    if (!date) return;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    
    setDocumentStatus((prevState) => ({
      ...prevState,
      [field]: dateStr,
    }));
  };

  return {
    documentStatus,
    handleDocumentSwitchChange,
    handleDocumentDateChange,
    setDocumentStatus,
  };
};
