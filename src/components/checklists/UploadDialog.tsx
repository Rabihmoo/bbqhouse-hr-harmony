
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryId, CompanyId } from '@/types/checklists';
import { Upload } from 'lucide-react';

interface UploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newChecklist: { name: string; category: CategoryId; file?: File };
  setNewChecklist: React.Dispatch<React.SetStateAction<{ name: string; category: CategoryId; file?: File }>>;
  handleUploadChecklist: () => void;
  activeCompany: CompanyId;
  companies: { id: CompanyId; name: string }[];
  categories: { id: CategoryId; name: string }[];
}

const UploadDialog = ({
  isOpen,
  onOpenChange,
  newChecklist,
  setNewChecklist,
  handleUploadChecklist,
  activeCompany,
  companies,
  categories
}: UploadDialogProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewChecklist({...newChecklist, name: file.name, file});
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Checklist</DialogTitle>
          <DialogDescription>
            Confirm details for the uploaded checklist.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              Select File
            </Label>
            <div className="col-span-3">
              <input
                type="file"
                id="file"
                ref={fileInputRef}
                className="hidden"
                accept=".doc,.docx,.pdf,.xls,.xlsx"
                onChange={handleFileChange}
              />
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full justify-start"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose file
                </Button>
                <span className="text-sm text-muted-foreground self-center truncate max-w-[150px]">
                  {newChecklist.file ? newChecklist.file.name : 'No file chosen'}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              File Name
            </Label>
            <Input
              id="name"
              value={newChecklist.name}
              onChange={(e) => setNewChecklist({...newChecklist, name: e.target.value})}
              className="col-span-3"
              placeholder="e.g. Kitchen Opening Checklist"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select
              value={newChecklist.category}
              onValueChange={(value: CategoryId) => setNewChecklist({...newChecklist, category: value})}
            >
              <SelectTrigger id="category" className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Company</Label>
            <div className="col-span-3 text-sm">
              {companies.find(c => c.id === activeCompany)?.name || 'Unknown Company'}
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleUploadChecklist}
            disabled={!newChecklist.file}
          >
            Confirm Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
