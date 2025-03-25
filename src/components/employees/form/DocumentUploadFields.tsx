
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Document {
  type: string;
  file: string | null;
  uploaded: boolean;
}

interface DocumentUploadFieldsProps {
  documents: Record<string, Document>;
  onDocumentUpload: (documentType: string, fileUrl: string) => void;
}

const DocumentUploadFields = ({ documents, onDocumentUpload }: DocumentUploadFieldsProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const requiredDocuments = [
    { id: "bi", label: "BI (Bilhete de Identidade)" },
    { id: "healthCard", label: "Cartão de Saúde" },
    { id: "tax", label: "Imposto" },
    { id: "nuit", label: "NUIT" },
    { id: "declaration", label: "Declaração" },
    { id: "cv", label: "CV" }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(prev => ({ ...prev, [documentType]: true }));
      
      // In a production app, this would upload the file to a server
      // Simulating upload with a timeout
      setTimeout(() => {
        const fileUrl = URL.createObjectURL(e.target.files![0]);
        onDocumentUpload(documentType, fileUrl);
        setUploading(prev => ({ ...prev, [documentType]: false }));
        
        toast({
          title: "Document uploaded",
          description: `${documentType.toUpperCase()} has been uploaded successfully.`,
        });
      }, 1000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requiredDocuments.map((doc) => (
          <div key={doc.id} className="border rounded-md p-4 space-y-2">
            <Label htmlFor={`document-${doc.id}`} className="mb-1 flex items-center justify-between">
              {doc.label}
              {documents[doc.id]?.uploaded && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              {!documents[doc.id]?.uploaded && (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
            </Label>
            <div className="flex items-center gap-2">
              <label htmlFor={`document-${doc.id}`} className="cursor-pointer flex-grow">
                <Button
                  type="button"
                  variant="outline" 
                  className={`w-full justify-start gap-2 ${uploading[doc.id] ? 'opacity-70' : ''}`}
                  disabled={uploading[doc.id]}
                >
                  <Upload className="h-4 w-4" />
                  {documents[doc.id]?.uploaded 
                    ? "Replace document" 
                    : uploading[doc.id] 
                      ? "Uploading..." 
                      : "Upload document"}
                </Button>
                <input 
                  id={`document-${doc.id}`} 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => handleFileChange(e, doc.id)}
                />
              </label>
              {documents[doc.id]?.file && (
                <a 
                  href={documents[doc.id].file!} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline whitespace-nowrap"
                >
                  View
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentUploadFields;
