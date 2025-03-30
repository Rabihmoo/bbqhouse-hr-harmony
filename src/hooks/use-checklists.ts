
import { useState } from 'react';
import { toast } from 'sonner';
import { CompanyId, CategoryId, CompanyChecklists, ChecklistItem } from '@/types/checklists';

// Define initial checklist data
const initialChecklists: CompanyChecklists = {
  bbq: {
    kitchen: [
      { id: '1', name: 'Kitchen Opening Checklist.docx', size: '24KB', date: '2023-10-15' },
      { id: '2', name: 'Kitchen Closing Checklist.docx', size: '32KB', date: '2023-10-15' }
    ],
    sala: [
      { id: '3', name: 'Sala Opening Procedures.docx', size: '18KB', date: '2023-10-10' }
    ],
    bar: [
      { id: '4', name: 'Bar Inventory Checklist.docx', size: '42KB', date: '2023-10-01' }
    ],
    manager: [],
    cleaning: [],
    weekly: [],
    monthly: []
  },
  salt: {
    kitchen: [],
    sala: [],
    bar: [],
    manager: [],
    cleaning: [],
    weekly: [],
    monthly: []
  },
  cleaning: {
    kitchen: [],
    sala: [],
    bar: [],
    manager: [],
    cleaning: [
      { id: '5', name: 'Daily Cleaning Schedule.docx', size: '28KB', date: '2023-09-28' }
    ],
    weekly: [],
    monthly: []
  }
};

export const useChecklists = () => {
  const [activeCompany, setActiveCompany] = useState<CompanyId>('bbq');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('kitchen');
  const [checklists, setChecklists] = useState<CompanyChecklists>(initialChecklists);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newChecklist, setNewChecklist] = useState<{ name: string; category: CategoryId }>({
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

  // Function to upload a new checklist
  const handleUploadChecklist = () => {
    if (!newChecklist.name) {
      toast.error("Please enter a checklist name");
      return;
    }

    // Add .docx extension if not already included
    const fileName = newChecklist.name.endsWith('.docx') 
      ? newChecklist.name 
      : `${newChecklist.name}.docx`;

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      name: fileName,
      size: `${Math.floor(Math.random() * 50 + 10)}KB`,
      date: new Date().toISOString().split('T')[0]
    };

    // Add the new checklist to the appropriate company and category
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

  // Function to download a checklist
  const handleDownloadChecklist = (checklist: { name: string }) => {
    // Ensure filename has .docx extension
    const fileName = checklist.name.endsWith('.docx') 
      ? checklist.name 
      : `${checklist.name}.docx`;
    
    toast.success(`Downloading ${fileName}`);
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    
    // In a real app, this would be a URL to the actual file
    // For now, we'll create a placeholder Word document with some content
    const blob = new Blob([
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>BBQHOUSE Checklist</title></head><body><h1>BBQHOUSE Checklist</h1><p>This is a placeholder for the checklist content.</p></body></html>'
    ], { type: 'application/vnd.ms-word' });
    
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to delete a checklist
  const handleDeleteChecklist = (checklistId: string) => {
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
    handleUploadChecklist,
    handleDownloadChecklist,
    handleDeleteChecklist
  };
};
