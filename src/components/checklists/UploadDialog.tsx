
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryId, CompanyId } from '@/types/checklists';

interface UploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newChecklist: { name: string; category: CategoryId };
  setNewChecklist: React.Dispatch<React.SetStateAction<{ name: string; category: CategoryId }>>;
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
          <Button type="button" onClick={handleUploadChecklist}>
            Confirm Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
