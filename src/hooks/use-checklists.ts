
import { useState } from 'react';
import { toast } from 'sonner';
import { CompanyId, CategoryId, CompanyChecklists, ChecklistItem } from '@/types/checklists';

// Define initial checklist data
const initialChecklists: CompanyChecklists = {
  bbq: {
    kitchen: [
      { id: '1', name: 'Kitchen Opening Checklist.docx', size: '24KB', date: '2023-10-15', fileData: null },
      { id: '2', name: 'Kitchen Closing Checklist.docx', size: '32KB', date: '2023-10-15', fileData: null }
    ],
    sala: [
      { id: '3', name: 'Sala Opening Procedures.docx', size: '18KB', date: '2023-10-10', fileData: null }
    ],
    bar: [
      { id: '4', name: 'Bar Inventory Checklist.docx', size: '42KB', date: '2023-10-01', fileData: null }
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
      { id: '5', name: 'Daily Cleaning Schedule.docx', size: '28KB', date: '2023-09-28', fileData: null }
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

  // Function to handle file selection
  const handleFileSelection = (file: File) => {
    // Store the file in the newChecklist state
    setNewChecklist(prev => ({
      ...prev,
      name: file.name,
      file: file
    }));
  };

  // Function to upload a new checklist
  const handleUploadChecklist = () => {
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

  // Function to get MIME type from file extension
  const getMimeTypeFromExtension = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch(extension) {
      case 'pdf': 
        return 'application/pdf';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'doc':
        return 'application/msword';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'xls':
        return 'application/vnd.ms-excel';
      default:
        return 'application/octet-stream';
    }
  };

  // Function to download a checklist
  const handleDownloadChecklist = (checklist: ChecklistItem) => {
    if (!checklist.fileData) {
      toast.error(`Cannot download ${checklist.name}. No file data available.`);
      return;
    }
    
    // Create a blob from the stored file data
    const blob = new Blob([checklist.fileData], { 
      type: checklist.mimeType || getMimeTypeFromExtension(checklist.name) 
    });
    
    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', checklist.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Downloading ${checklist.name}`);
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
    handleDeleteChecklist,
    handleFileSelection
  };
};
