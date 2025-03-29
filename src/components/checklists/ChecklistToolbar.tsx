
import React from 'react';
import { Upload } from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Company } from '@/types/checklists';

interface ChecklistToolbarProps {
  companies: Company[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleUploadClick: () => void;
}

const ChecklistToolbar = ({
  companies,
  searchQuery,
  setSearchQuery,
  handleUploadClick
}: ChecklistToolbarProps) => {
  return (
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
  );
};

export default ChecklistToolbar;
