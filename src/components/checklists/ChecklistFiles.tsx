
import React from 'react';
import { FileText, Download, Trash2, Plus, Replace } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChecklistItem } from '@/types/checklists';

interface ChecklistFilesProps {
  filteredChecklists: ChecklistItem[];
  searchQuery: string;
  onDownloadChecklist: (checklist: ChecklistItem) => void;
  onDeleteChecklist: (checklistId: string) => void;
  onReplaceClick: (checklist: ChecklistItem) => void;
  onUploadClick: () => void;
  categoryName: string;
}

const ChecklistFiles = ({
  filteredChecklists,
  searchQuery,
  onDownloadChecklist,
  onDeleteChecklist,
  onReplaceClick,
  onUploadClick,
  categoryName
}: ChecklistFilesProps) => {
  return (
    <div className="col-span-1 md:col-span-3 bg-white dark:bg-black/40 glass rounded-xl shadow-sm p-6 w-full">
      <h2 className="text-xl font-semibold mb-4 text-left">
        {categoryName}
      </h2>
      
      {filteredChecklists.length > 0 ? (
        <div className="divide-y w-full">
          {filteredChecklists.map(checklist => (
            <div 
              key={checklist.id} 
              className="py-3 flex items-center justify-between w-full"
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3 text-bbqred flex-shrink-0" />
                <div className="text-left">
                  <p className="font-medium">{checklist.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {checklist.size} • Uploaded on {checklist.date}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDownloadChecklist(checklist)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReplaceClick(checklist)}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2"
                  >
                    <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
                    <circle cx="16" cy="8" r="2" />
                    <path d="M18 12 9 3" />
                    <path d="m13 7 4 1 1 4" />
                  </svg>
                  Replace
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
        <div className="text-center py-8 w-full">
          <p className="text-muted-foreground">No checklists found matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed rounded-lg w-full">
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
