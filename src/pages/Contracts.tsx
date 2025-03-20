
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ContractGenerator from "@/components/contracts/ContractGenerator";
import { toast } from "sonner";

const Contracts = () => {
  const handleGenerateContract = (contractData: any) => {
    // In a real implementation, this would generate a contract document
    // and potentially save it to a database or file storage
    
    toast("Contract generated successfully", {
      description: "The contract has been generated and saved.",
      duration: 5000,
    });
  };

  return (
    <DashboardLayout 
      title="Contracts" 
      subtitle="Generate and manage employee contracts"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContractGenerator onGenerate={handleGenerateContract} />
        
        <div className="bg-white dark:bg-black/40 glass rounded-xl shadow-sm overflow-hidden p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-bbqred p-2 rounded-lg text-white">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12H15M9 16H15M9 8H15M5.5 3L18.5 3C19.8807 3 21 4.11929 21 5.5V18.5C21 19.8807 19.8807 21 18.5 21H5.5C4.11929 21 3 19.8807 3 18.5V5.5C3 4.11929 4.11929 3 5.5 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Contract Templates</h2>
          </div>
          
          <div className="grid gap-4">
            <div className="p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors cursor-pointer">
              <h3 className="font-medium mb-1">Standard Employment Contract</h3>
              <p className="text-sm text-muted-foreground">Full-time permanent employment contract template</p>
            </div>
            
            <div className="p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors cursor-pointer">
              <h3 className="font-medium mb-1">Temporary Contract</h3>
              <p className="text-sm text-muted-foreground">Fixed-term employment contract for temporary positions</p>
            </div>
            
            <div className="p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors cursor-pointer">
              <h3 className="font-medium mb-1">Part-Time Contract</h3>
              <p className="text-sm text-muted-foreground">Reduced hours employment agreement template</p>
            </div>
            
            <div className="p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors cursor-pointer">
              <h3 className="font-medium mb-1">Probationary Period Contract</h3>
              <p className="text-sm text-muted-foreground">Initial employment period with evaluation terms</p>
            </div>
            
            <div className="p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors cursor-pointer">
              <h3 className="font-medium mb-1">Contract Amendment</h3>
              <p className="text-sm text-muted-foreground">Template for making changes to existing contracts</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Contracts;
