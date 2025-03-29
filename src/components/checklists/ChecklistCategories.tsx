
import React from 'react';
import { FolderOpen } from 'lucide-react';
import { CategoryId } from '@/types/checklists';

interface ChecklistCategoriesProps {
  categories: { id: CategoryId; name: string }[];
  activeCategory: CategoryId;
  onCategoryChange: (categoryId: CategoryId) => void;
}

const ChecklistCategories = ({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: ChecklistCategoriesProps) => {
  return (
    <div className="col-span-1 bg-white dark:bg-black/40 glass rounded-xl shadow-sm p-4">
      <h3 className="font-medium text-lg mb-4">Categories</h3>
      <div className="space-y-1">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
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
  );
};

export default ChecklistCategories;
