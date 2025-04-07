
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Upload } from 'lucide-react';
import { ChecklistItem } from '@/types/checklists';

interface ReplaceFileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  checklist: ChecklistItem | null;
  onReplaceFile: (checklistId: string, file: File) => void;
}

const ReplaceFileDialog = ({
  isOpen,
  onOpenChange,
  checklist,
  onReplaceFile
}: ReplaceFileDialogProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleReplaceConfirm = () => {
    if (checklist && selectedFile) {
      onReplaceFile(checklist.id, selectedFile);
      onOpenChange(false);
      setSelectedFile(null);
    }
  };

  // Reset selected file when dialog opens or closes
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Replace Checklist File</DialogTitle>
          <DialogDescription>
            Upload a new file to replace <strong>{checklist?.name}</strong> while keeping the same name and identifier.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4">
              <input
                type="file"
                id="replace-file"
                ref={fileInputRef}
                className="hidden"
                accept=".doc,.docx,.pdf,.xls,.xlsx"
                onChange={handleFileChange}
              />
              <div className="flex flex-col gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full justify-center"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose file to replace with
                </Button>
                <div className="text-sm text-center">
                  {selectedFile ? (
                    <span className="text-green-600 font-medium">
                      Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No file selected</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleReplaceConfirm}
            disabled={!selectedFile}
          >
            Replace File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReplaceFileDialog;
