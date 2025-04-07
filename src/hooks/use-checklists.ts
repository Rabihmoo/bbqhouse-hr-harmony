
import { useState } from 'react';
import { useChecklistState } from './checklists/use-checklist-state';
import { useChecklistOperations } from './checklists/use-checklist-operations';
import { ChecklistItem } from '@/types/checklists';

export const useChecklists = () => {
  const {
    activeCompany,
    activeCategory,
    checklists,
    setChecklists,
    searchQuery,
    setSearchQuery,
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    newChecklist,
    setNewChecklist,
    handleCompanyChange,
    handleCategoryChange
  } = useChecklistState();

  const {
    handleFileSelection,
    handleUploadChecklist,
    handleReplaceChecklist,
    handleDownloadChecklist,
    handleDeleteChecklist
  } = useChecklistOperations({
    activeCompany,
    checklists,
    setChecklists
  });

  // State for replace file dialog
  const [isReplaceDialogOpen, setIsReplaceDialogOpen] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState<ChecklistItem | null>(null);

  // Function to handle file selection in the main hook
  const handleFileSelect = (file: File) => {
    const fileDetails = handleFileSelection(file);
    setNewChecklist(prev => ({
      ...prev,
      ...fileDetails
    }));
  };

  // Function to upload checklist in the main hook
  const handleUpload = () => {
    handleUploadChecklist(newChecklist, setIsUploadDialogOpen, setNewChecklist);
  };

  // Function to replace a checklist file
  const handleReplaceFile = (checklistId: string, file: File) => {
    handleReplaceChecklist(checklistId, file);
  };

  // Function to handle clicking the replace button
  const handleReplaceClick = (checklist: ChecklistItem) => {
    setSelectedChecklist(checklist);
    setIsReplaceDialogOpen(true);
  };

  // Function to delete checklist in the main hook
  const handleDelete = (checklistId: string) => {
    handleDeleteChecklist(checklistId, activeCategory);
  };

  // Filter checklists based on search query
  const filteredChecklists = checklists[activeCompany][activeCategory]
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return {
    activeCompany,
    activeCategory,
    checklists,
    searchQuery,
    setSearchQuery,
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    newChecklist,
    setNewChecklist,
    filteredChecklists,
    isReplaceDialogOpen,
    setIsReplaceDialogOpen,
    selectedChecklist,
    handleCompanyChange,
    handleCategoryChange,
    handleUploadChecklist: handleUpload,
    handleDownloadChecklist,
    handleDeleteChecklist: handleDelete,
    handleFileSelection: handleFileSelect,
    handleReplaceClick,
    handleReplaceFile
  };
};
