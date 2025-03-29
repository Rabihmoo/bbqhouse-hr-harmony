
import React from "react";
import { FileCheck } from "lucide-react";
import { companies } from "@/lib/data";

const ContractInformation = () => {
  return (
    <div className="bg-white dark:bg-black/40 glass rounded-xl shadow-sm overflow-hidden p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-bbqred p-2 rounded-lg text-white">
          <FileCheck className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold">Contract Information</h2>
      </div>
      
      <div className="prose dark:prose-invert max-w-none">
        <p>
          The contract generator creates employment contracts based on the employee's company affiliation.
          Each company uses a specific contract template with different formatting.
        </p>
        
        <p className="font-medium text-bbqred mt-4">
          All contracts are generated as Microsoft Word (.docx) documents, ready for printing and signing.
        </p>
        
        <ul className="my-4">
          {companies.map(company => (
            <li key={company.id} className="mb-2">
              <strong>{company.name}</strong>: Uses {company.contractTemplate}
            </li>
          ))}
        </ul>
        
        <p>
          All contracts are fixed with a standard base salary of 8,900.00 MT (Oito mil e novecentos meticais),
          with allowances pulled from the employee's salary structure.
        </p>
        
        <div className="bg-muted/30 p-4 rounded-md mt-4">
          <h3 className="text-base font-medium mb-2">Important Notes:</h3>
          <ul className="text-sm space-y-2">
            <li>Generated contracts automatically include company-specific information.</li>
            <li>Employee details (name, BI number, etc.) are pulled from their profile.</li>
            <li>Salary allowances (transport, bonus, punctuality) are included from the employee record.</li>
            <li>Contract signature date is recorded for compliance purposes.</li>
            <li className="text-bbqred font-medium">All contracts can be downloaded as Word (.docx) documents.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContractInformation;
