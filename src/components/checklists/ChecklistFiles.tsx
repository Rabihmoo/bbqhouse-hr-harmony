
import React from 'react';
import { FileText, Download, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChecklistItem } from '@/types/checklists';

interface ChecklistFilesProps {
  filteredChecklists: ChecklistItem[];
  searchQuery: string;
  onDownloadChecklist: (checklist: { name: string }) => void;
  onDeleteChecklist: (checklistId: string) => void;
  onUploadClick: () => void;
  categoryName: string;
}

const ChecklistFiles = ({
  filteredChecklists,
  searchQuery,
  onDownloadChecklist,
  onDeleteChecklist,
  onUploadClick,
  categoryName
}: ChecklistFilesProps) => {
  // Helper function to ensure file has .docx extension
  const ensureDocxExtension = (filename: string) => {
    if (!filename.toLowerCase().endsWith('.docx')) {
      return `${filename}.docx`;
    }
    return filename;
  };
  
  return (
    <div className="col-span-1 md:col-span-3 bg-white dark:bg-black/40 glass rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">
        {categoryName}
      </h2>
      
      {filteredChecklists.length > 0 ? (
        <div className="divide-y">
          {filteredChecklists.map(checklist => (
            <div 
              key={checklist.id} 
              className="py-3 flex items-center justify-between"
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3 text-bbqred" />
                <div>
                  <p className="font-medium">{ensureDocxExtension(checklist.name)}</p>
                  <p className="text-sm text-muted-foreground">
                    {checklist.size} • Uploaded on {checklist.date}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDownloadChecklist({
                    ...checklist,
                    name: ensureDocxExtension(checklist.name)
                  })}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDeleteChecklist(checklist.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : searchQuery ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No checklists found matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No checklists available in this category</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={onUploadClick}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Checklist
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChecklistFiles;
