
import React from "react";
import { Folder } from "lucide-react";
import { companies } from "@/lib/data";

const ContractTemplates = () => {
  return (
    <div className="bg-white dark:bg-black/40 glass rounded-xl shadow-sm overflow-hidden p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-bbqred p-2 rounded-lg text-white">
          <Folder className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold">Contract Templates</h2>
      </div>
      
      <div className="grid gap-6">
        {companies.map(company => (
          <div key={company.id} className="border rounded-lg p-4 bg-background/70">
            <h3 className="font-medium text-lg mb-3">{company.name} Template</h3>
            <div className="flex items-center mb-4">
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded text-xs">Word Document (.docx)</span>
              <span className="text-sm text-muted-foreground ml-3">Filename: {company.contractTemplate}</span>
            </div>
            
            <div className="grid gap-2 text-sm">
              <div className="flex items-center justify-between p-2 border-b">
                <span>Document type</span>
                <span className="font-medium">Standard Employment Contract</span>
              </div>
              <div className="flex items-center justify-between p-2 border-b">
                <span>Company Address</span>
                <span className="font-medium">
                  {company.name === "SALT LDA" 
                    ? "Avenida Marginal n.º1251, Maputo" 
                    : "Cidade de Maputo"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 border-b">
                <span>Base Salary</span>
                <span className="font-medium">8,900.00 MT</span>
              </div>
              <div className="flex items-center justify-between p-2 border-b">
                <span>Language</span>
                <span className="font-medium">Portuguese</span>
              </div>
              <div className="flex items-center justify-between p-2">
                <span>Legal review</span>
                <span className="font-medium">Complete</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractTemplates;
