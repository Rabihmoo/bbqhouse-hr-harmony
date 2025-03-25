
import { useState, useEffect } from "react";

export interface EmployeeDocument {
  type: string;
  file: string | null;
  uploaded: boolean;
  uploadDate?: string;
}

export interface EmployeeDocuments {
  bi: EmployeeDocument;
  healthCard: EmployeeDocument;
  tax: EmployeeDocument;
  nuit: EmployeeDocument;
  declaration: EmployeeDocument;
  cv: EmployeeDocument;
}

export const useEmployeeDocumentsUpload = (
  open: boolean,
  isEditing: boolean,
  initialData: any | null
) => {
  const [documents, setDocuments] = useState<Record<string, EmployeeDocument>>({
    bi: { type: "bi", file: null, uploaded: false },
    healthCard: { type: "healthCard", file: null, uploaded: false },
    tax: { type: "tax", file: null, uploaded: false },
    nuit: { type: "nuit", file: null, uploaded: false },
    declaration: { type: "declaration", file: null, uploaded: false },
    cv: { type: "cv", file: null, uploaded: false }
  });

  useEffect(() => {
    if (open) {
      if (isEditing && initialData && initialData.documents) {
        setDocuments(initialData.documents);
      } else {
        // Reset to default when opening for new employee
        setDocuments({
          bi: { type: "bi", file: null, uploaded: false },
          healthCard: { type: "healthCard", file: null, uploaded: false },
          tax: { type: "tax", file: null, uploaded: false },
          nuit: { type: "nuit", file: null, uploaded: false },
          declaration: { type: "declaration", file: null, uploaded: false },
          cv: { type: "cv", file: null, uploaded: false }
        });
      }
    }
  }, [open, isEditing, initialData]);

  const handleDocumentUpload = (documentType: string, fileUrl: string) => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: {
        type: documentType,
        file: fileUrl,
        uploaded: true,
        uploadDate: new Date().toISOString()
      }
    }));
  };

  return {
    documents,
    handleDocumentUpload,
    setDocuments
  };
};
