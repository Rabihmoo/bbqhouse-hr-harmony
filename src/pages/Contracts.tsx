
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ContractGenerator from "@/components/contracts/ContractGenerator";
import ContractInformation from "@/components/contracts/ContractInformation";
import ContractTemplates from "@/components/contracts/ContractTemplates";
import ContractHistory from "@/components/contracts/ContractHistory";
import { toast } from "sonner";
import { FileText, FileCheck, Folder } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadContract } from "@/utils/contractGenerator";

const Contracts = ({ onLogout }: { onLogout?: () => void }) => {
  const [activeTab, setActiveTab] = useState("generate");
  const [generatedContracts, setGeneratedContracts] = useState<any[]>([]);

  const handleGenerateContract = (contractData: any) => {
    // Add the contract to the history with a timestamp
    const newContract = {
      id: Date.now().toString(),
      ...contractData,
      generatedAt: new Date().toISOString(),
      downloadUrl: `#contract-${Date.now()}`, // In a real app, this would be an actual URL
      format: 'docx' // Set the format to docx explicitly
    };
    
    setGeneratedContracts(prev => [newContract, ...prev]);
    
    // Automatically switch to history tab to show the generated contract
    setActiveTab("history");
    
    toast.success("Contract generated successfully", {
      description: `The contract for ${contractData.employeeName} has been generated as a Word document and is ready for download.`,
      duration: 5000,
    });
  };

  const handleDownloadContract = (contract: any) => {
    toast.success("Downloading contract", {
      description: `Contract for ${contract.employeeName} is being downloaded as a Word document.`
    });
    
    downloadContract(contract);
  };

  return (
    <DashboardLayout 
      title="Contracts" 
      subtitle="Generate and manage employee contracts"
      onLogout={onLogout}
    >
      <Tabs defaultValue="generate" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="generate">
            <FileText className="h-4 w-4 mr-2" />
            Generate Contract
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Folder className="h-4 w-4 mr-2" />
            Contract Templates
          </TabsTrigger>
          <TabsTrigger value="history">
            <FileCheck className="h-4 w-4 mr-2" />
            Contract History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContractGenerator onGenerate={handleGenerateContract} />
            <ContractInformation />
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-0">
          <ContractTemplates />
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          <ContractHistory 
            generatedContracts={generatedContracts} 
            onDownloadContract={handleDownloadContract} 
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Contracts;
