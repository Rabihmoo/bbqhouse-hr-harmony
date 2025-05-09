import { toast } from 'sonner';
import { ChecklistItem, CategoryId } from '@/types/checklists';
import { getMimeTypeFromExtension, createDownloadableBlob } from '@/utils/fileOperations';

interface ChecklistOperationsProps {
  activeCompany: string;
  checklists: any;
  setChecklists: React.Dispatch<React.SetStateAction<any>>;
}

export const useChecklistOperations = ({ 
  activeCompany, 
  checklists, 
  setChecklists 
}: ChecklistOperationsProps) => {
  
  // Function to handle file selection
  const handleFileSelection = (file: File) => {
    return {
      name: file.name,
      file: file
    };
  };

  // Function to upload a new checklist
  const handleUploadChecklist = (
    newChecklist: { name: string; category: CategoryId; file?: File },
    setIsUploadDialogOpen: (isOpen: boolean) => void,
    setNewChecklist: React.Dispatch<React.SetStateAction<{ name: string; category: CategoryId; file?: File }>>
  ) => {
    if (!newChecklist.name) {
      toast.error("Please enter a checklist name");
      return;
    }

    const file = newChecklist.file;
    if (!file) {
      toast.error("No file selected");
      return;
    }

    // Read the file as an ArrayBuffer to preserve binary content
    const reader = new FileReader();
    reader.onload = (e) => {
      // Ensure the result is treated as ArrayBuffer
      const fileData = e.target?.result as ArrayBuffer;
      
      // Add the new checklist to the appropriate company and category
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        name: newChecklist.name,
        size: `${Math.round(file.size / 1024)}KB`,
        date: new Date().toISOString().split('T')[0],
        fileData: fileData,
        mimeType: file.type || getMimeTypeFromExtension(newChecklist.name)
      };

      setChecklists(prev => ({
        ...prev,
        [activeCompany]: {
          ...prev[activeCompany],
          [newChecklist.category]: [
            ...prev[activeCompany][newChecklist.category],
            newItem
          ]
        }
      }));

      setIsUploadDialogOpen(false);
      setNewChecklist({ name: '', category: 'kitchen' });
      toast.success("Checklist uploaded successfully");
    };
    
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    
    reader.readAsArrayBuffer(file);
  };

  // Function to replace an existing checklist file
  const handleReplaceChecklist = (checklistId: string, file: File) => {
    if (!file) {
      toast.error("No file selected for replacement");
      return;
    }

    // Find which category contains the checklist
    let foundCategory: CategoryId | null = null;
    let foundChecklist: ChecklistItem | null = null;

    // Search through all categories to find the checklist
    Object.keys(checklists[activeCompany]).forEach((category) => {
      const found = checklists[activeCompany][category].find(
        (item: ChecklistItem) => item.id === checklistId
      );
      if (found) {
        foundCategory = category as CategoryId;
        foundChecklist = found;
      }
    });

    if (!foundCategory || !foundChecklist) {
      toast.error("Checklist not found");
      return;
    }

    // Read the new file
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = e.target?.result as ArrayBuffer;
      
      // Update the checklist with new file data but keep the same name and id
      setChecklists(prev => {
        const updatedChecklists = { ...prev };
        
        // Find and update the specific checklist
        const categoryItems = [...updatedChecklists[activeCompany][foundCategory!]];
        const checklistIndex = categoryItems.findIndex(item => item.id === checklistId);
        
        if (checklistIndex !== -1) {
          categoryItems[checklistIndex] = {
            ...categoryItems[checklistIndex],
            fileData: fileData,
            size: `${Math.round(file.size / 1024)}KB`,
            date: new Date().toISOString().split('T')[0],
            mimeType: file.type || getMimeTypeFromExtension(file.name)
          };
          
          // Update the category with modified items
          updatedChecklists[activeCompany][foundCategory!] = categoryItems;
        }
        
        return updatedChecklists;
      });

      toast.success(`"${foundChecklist!.name}" has been updated with the new file`);
    };
    
    reader.onerror = () => {
      toast.error("Failed to read replacement file");
    };
    
    reader.readAsArrayBuffer(file);
  };

  // Function to download a checklist
  const handleDownloadChecklist = (checklist: ChecklistItem) => {
    try {
      if (!checklist.fileData) {
        toast.error(`Cannot download ${checklist.name}. No file data available.`);
        return;
      }
      
      // Create a blob from the stored file data
      const blob = createDownloadableBlob(
        checklist.fileData, 
        checklist.mimeType || getMimeTypeFromExtension(checklist.name)
      );
      
      // Create a download link and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', checklist.name);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast.success(`Downloading ${checklist.name}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Failed to download ${checklist.name}. Please try again.`);
    }
  };

  // Function to delete a checklist
  const handleDeleteChecklist = (checklistId: string, activeCategory: CategoryId) => {
    setChecklists(prev => {
      const updatedCompany = { ...prev[activeCompany] };
      
      // Find which category contains the checklist and remove it
      for (const categoryId of Object.keys(updatedCompany) as CategoryId[]) {
        updatedCompany[categoryId] = updatedCompany[categoryId].filter(
          item => item.id !== checklistId
        );
      }

      return {
        ...prev,
        [activeCompany]: updatedCompany
      };
    });

    toast.success("Checklist deleted successfully");
  };

  return {
    handleFileSelection,
    handleUploadChecklist,
    handleReplaceChecklist,
    handleDownloadChecklist,
    handleDeleteChecklist
  };
};
