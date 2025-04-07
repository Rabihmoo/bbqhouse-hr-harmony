
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompanyDocument } from "@/types/company";
import { FileText, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface DocumentsUploaderProps {
  documents: CompanyDocument[];
  onAddDocument: (doc: { name: string; type: string; url: string }) => void;
  onRemoveDocument: (docId: string) => void;
}

const DocumentsUploader: React.FC<DocumentsUploaderProps> = ({
  documents,
  onAddDocument,
  onRemoveDocument
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // In a real app, you would upload the file to a server here
      // For now, we'll just create a fake URL
      const fakeUrl = `file://${file.name}`;
      
      onAddDocument({
        name: file.name,
        type: file.type,
        url: fakeUrl
      });
      
      toast.success(`Document "${file.name}" uploaded successfully`);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-dashed flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
        <p className="text-xs text-muted-foreground mt-1">
          Supported formats: PDF, DOCX, JPG, PNG
        </p>
      </div>
      
      {documents.length > 0 && (
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted px-4 py-2 text-sm font-medium">
            Uploaded Documents
          </div>
          <div className="divide-y">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="font-medium line-clamp-1">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(doc.uploadDate), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveDocument(doc.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsUploader;
