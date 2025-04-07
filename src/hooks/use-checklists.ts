
import { useChecklistState } from './checklists/use-checklist-state';
import { useChecklistOperations } from './checklists/use-checklist-operations';

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
    handleDownloadChecklist,
    handleDeleteChecklist
  } = useChecklistOperations({
    activeCompany,
    checklists,
    setChecklists
  });

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
    handleCompanyChange,
    handleCategoryChange,
    handleUploadChecklist: handleUpload,
    handleDownloadChecklist,
    handleDeleteChecklist: handleDelete,
    handleFileSelection: handleFileSelect
  };
};
