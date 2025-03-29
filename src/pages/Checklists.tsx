
import React, { useState, useRef } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Upload, FileText, FolderOpen, Download, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface ChecklistsProps {
  onLogout?: () => void;
}

// Define types for our data structure
type CompanyId = 'bbq' | 'salt' | 'cleaning';
type CategoryId = 'kitchen' | 'sala' | 'bar' | 'manager' | 'cleaning' | 'weekly' | 'monthly';

interface ChecklistItem {
  id: string;
  name: string;
  size: string;
  date: string;
}

type CategoryChecklists = {
  [key in CategoryId]: ChecklistItem[];
};

type CompanyChecklists = {
  [key in CompanyId]: CategoryChecklists;
};

// The companies
const companies = [
  { id: 'bbq' as CompanyId, name: 'BBQHouse LDA' },
  { id: 'salt' as CompanyId, name: 'SALT LDA' },
  { id: 'cleaning' as CompanyId, name: 'Executive Cleaning LDA' }
];

// Categories for checklists
const categories = [
  { id: 'kitchen' as CategoryId, name: 'Kitchen Checklists' },
  { id: 'sala' as CategoryId, name: 'Sala Checklists' },
  { id: 'bar' as CategoryId, name: 'Bar Checklists' },
  { id: 'manager' as CategoryId, name: 'Manager Checklists' },
  { id: 'cleaning' as CategoryId, name: 'Cleaning Checklists' },
  { id: 'weekly' as CategoryId, name: 'Weekly Checklists' },
  { id: 'monthly' as CategoryId, name: 'Monthly Checklists' }
];

// Sample checklist data for demonstration
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

const Checklists = ({ onLogout }: ChecklistsProps) => {
  const [activeCompany, setActiveCompany] = useState<CompanyId>('bbq');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('kitchen');
  const [checklists, setChecklists] = useState<CompanyChecklists>(initialChecklists);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newChecklist, setNewChecklist] = useState<{ name: string; category: CategoryId }>({
    name: '',
    category: 'kitchen'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to handle company tab change with proper type casting
  const handleCompanyChange = (value: string) => {
    // Ensure the value is a valid CompanyId before setting it
    if (value === 'bbq' || value === 'salt' || value === 'cleaning') {
      setActiveCompany(value);
    }
  };

  // Function to handle category change with proper type casting
  const handleCategoryChange = (value: string) => {
    // We need to validate that the value is a valid CategoryId
    if (categories.some(cat => cat.id === value)) {
      setActiveCategory(value as CategoryId);
    }
  };

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
      
      // Extract the file name without extension
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      
      // Open dialog to confirm and set category
      setNewChecklist({
        name: file.name,
        category: activeCategory
      });
      setIsUploadDialogOpen(true);
    }
    
    // Reset file input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
    // In a real implementation, this would download the actual file
    toast.success(`Downloading ${checklist.name}`);
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = `#${checklist.name}`;
    link.setAttribute('download', checklist.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to delete a checklist
  const handleDeleteChecklist = (checklistId: string) => {
    setChecklists(prev => {
      const updatedCompany = { ...prev[activeCompany] };
      
      // Find which category contains the checklist and remove it
      for (const category of categories) {
        const categoryId = category.id;
        const categoryChecklists = updatedCompany[categoryId];
        
        updatedCompany[categoryId] = categoryChecklists.filter(
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

  return (
    <DashboardLayout 
      title="Checklists" 
      subtitle="Download and manage checklists"
      onLogout={onLogout}
    >
      <div className="space-y-6">
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
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              {companies.map(company => (
                <TabsTrigger key={company.id} value={company.id} className="px-4 py-2">
                  {company.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Search checklists..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Button onClick={handleUploadClick}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Checklist
              </Button>
            </div>
          </div>

          {/* Content for each company */}
          {companies.map(company => (
            <TabsContent key={company.id} value={company.id} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Left sidebar - Categories */}
                <div className="col-span-1 bg-white dark:bg-black/40 glass rounded-xl shadow-sm p-4">
                  <h3 className="font-medium text-lg mb-4">Categories</h3>
                  <div className="space-y-1">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center ${
                          activeCategory === category.id
                            ? "bg-bbqred text-white"
                            : "hover:bg-muted"
                        }`}
                      >
                        <FolderOpen className="h-4 w-4 mr-2" />
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right content - Checklist files */}
                <div className="col-span-1 md:col-span-3 bg-white dark:bg-black/40 glass rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {categories.find(c => c.id === activeCategory)?.name || 'Checklists'}
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
                              onClick={() => handleDownloadChecklist(checklist)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteChecklist(checklist.id)}
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
                        onClick={handleUploadClick}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Checklist
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleUploadChecklist}>
              Confirm Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Checklists;
