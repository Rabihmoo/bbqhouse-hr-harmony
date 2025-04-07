
import { useState } from 'react';
import { CompanyId, CategoryId, CompanyChecklists } from '@/types/checklists';
import { initialChecklists } from '@/data/initialChecklists';

export const useChecklistState = () => {
  const [activeCompany, setActiveCompany] = useState<CompanyId>('bbq');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('kitchen');
  const [checklists, setChecklists] = useState<CompanyChecklists>(initialChecklists);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newChecklist, setNewChecklist] = useState<{ name: string; category: CategoryId; file?: File }>({
    name: '',
    category: 'kitchen'
  });

  // Function to handle company tab change
  const handleCompanyChange = (value: string) => {
    // Ensure the value is a valid CompanyId before setting it
    if (value === 'bbq' || value === 'salt' || value === 'cleaning') {
      setActiveCompany(value);
    }
  };

  // Function to handle category change
  const handleCategoryChange = (value: CategoryId) => {
    setActiveCategory(value);
  };

  return {
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
  };
};
