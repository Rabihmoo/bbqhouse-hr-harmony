
import React, { useRef } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Company, Category } from '@/types/checklists';
import { useChecklists } from '@/hooks/use-checklists';
import ChecklistToolbar from '@/components/checklists/ChecklistToolbar';
import ChecklistCategories from '@/components/checklists/ChecklistCategories';
import ChecklistFiles from '@/components/checklists/ChecklistFiles';
import UploadDialog from '@/components/checklists/UploadDialog';
import ReplaceFileDialog from '@/components/checklists/ReplaceFileDialog';

interface ChecklistsProps {
  onLogout?: () => void;
}

// The companies
const companies: Company[] = [
  { id: 'bbq', name: 'BBQHouse LDA' },
  { id: 'salt', name: 'SALT LDA' },
  { id: 'cleaning', name: 'Executive Cleaning LDA' }
];

// Categories for checklists
const categories: Category[] = [
  { id: 'kitchen', name: 'Kitchen Checklists' },
  { id: 'sala', name: 'Sala Checklists' },
  { id: 'bar', name: 'Bar Checklists' },
  { id: 'manager', name: 'Manager Checklists' },
  { id: 'cleaning', name: 'Cleaning Checklists' },
  { id: 'weekly', name: 'Weekly Checklists' },
  { id: 'monthly', name: 'Monthly Checklists' }
];

const Checklists = ({ onLogout }: ChecklistsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    activeCompany,
    activeCategory,
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
    handleUploadChecklist,
    handleDownloadChecklist,
    handleDeleteChecklist,
    handleFileSelection,
    handleReplaceClick,
    handleReplaceFile
  } = useChecklists();

  // Function to open file dialog directly
  const handleUploadClick = () => {
    // Instead of opening the dialog, trigger the file input directly
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Store the file in state and open dialog
      handleFileSelection(file);
      setIsUploadDialogOpen(true);
    }
    
    // Reset file input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <DashboardLayout 
      title="Checklists" 
      subtitle="Download and manage checklists"
      onLogout={onLogout}
    >
      <div className="space-y-6 w-full">
        {/* Hidden file input for uploading */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".doc,.docx,.pdf,.xls,.xlsx"
          onChange={handleFileSelect}
        />
      
        {/* Company Tabs */}
        <Tabs defaultValue="bbq" value={activeCompany} onValueChange={handleCompanyChange}>
          <ChecklistToolbar 
            companies={companies}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleUploadClick={handleUploadClick}
          />

          {/* Content for each company */}
          {companies.map(company => (
            <TabsContent key={company.id} value={company.id} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
                {/* Left sidebar - Categories */}
                <ChecklistCategories 
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={handleCategoryChange}
                />

                {/* Right content - Checklist files */}
                <ChecklistFiles 
                  filteredChecklists={filteredChecklists}
                  searchQuery={searchQuery}
                  onDownloadChecklist={handleDownloadChecklist}
                  onDeleteChecklist={handleDeleteChecklist}
                  onReplaceClick={handleReplaceClick}
                  onUploadClick={handleUploadClick}
                  categoryName={categories.find(c => c.id === activeCategory)?.name || 'Checklists'}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Upload Dialog */}
      <UploadDialog 
        isOpen={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        newChecklist={newChecklist}
        setNewChecklist={setNewChecklist}
        handleUploadChecklist={handleUploadChecklist}
        activeCompany={activeCompany}
        companies={companies}
        categories={categories}
      />

      {/* Replace File Dialog */}
      <ReplaceFileDialog
        isOpen={isReplaceDialogOpen}
        onOpenChange={setIsReplaceDialogOpen}
        checklist={selectedChecklist}
        onReplaceFile={handleReplaceFile}
      />
    </DashboardLayout>
  );
};

export default Checklists;
