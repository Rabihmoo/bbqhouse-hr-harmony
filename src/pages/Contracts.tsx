
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ContractGenerator from "@/components/contracts/ContractGenerator";
import { toast } from "sonner";
import { FileText, FileCheck, Folder, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { companies } from "@/lib/data";
import { Button } from "@/components/ui/button";

const Contracts = ({ onLogout }: { onLogout?: () => void }) => {
  const [activeTab, setActiveTab] = useState("generate");
  const [generatedContracts, setGeneratedContracts] = useState<any[]>([]);

  const handleGenerateContract = (contractData: any) => {
    // In a real implementation, this would generate a contract document
    // and potentially save it to a database or file storage
    
    // Add the contract to the history
    const newContract = {
      id: Date.now().toString(),
      ...contractData,
      generatedAt: new Date().toISOString(),
      downloadUrl: `#contract-${Date.now()}` // In a real app, this would be an actual URL
    };
    
    setGeneratedContracts(prev => [newContract, ...prev]);
    
    // Automatically switch to history tab to show the generated contract
    setActiveTab("history");
    
    toast("Contract generated successfully", {
      description: `The contract for ${contractData.employeeName} has been generated using ${contractData.company} template.`,
      duration: 5000,
    });
  };

  const handleDownloadContract = (contract: any) => {
    // In a real implementation, this would download the actual file
    // For now, we'll just show a toast message
    toast.success("Downloading contract", {
      description: `Contract for ${contract.employeeName} is being downloaded.`
    });
    
    // Simulate a file download by creating a temporary link
    const link = document.createElement('a');
    link.href = contract.downloadUrl;
    link.setAttribute('download', `Contract_${contract.employeeName.replace(/ /g, '_')}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                  Each company uses a specific contract template with different formatting:
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
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-0">
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
                  <p className="text-sm text-muted-foreground mb-4">Filename: {company.contractTemplate}</p>
                  
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
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          <div className="bg-white dark:bg-black/40 glass rounded-xl shadow-sm overflow-hidden p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-bbqred p-2 rounded-lg text-white">
                <FileCheck className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold">Contract History</h2>
            </div>
            
            {generatedContracts.length > 0 ? (
              <div className="grid gap-4">
                {generatedContracts.map(contract => (
                  <div key={contract.id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div className="text-left">
                      <h3 className="font-medium">{contract.employeeName}</h3>
                      <p className="text-sm text-muted-foreground">{contract.company} - Generated on {new Date(contract.generatedAt).toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleDownloadContract(contract)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No contract history available yet.</p>
                <p className="text-sm mt-2">Generated contracts will appear here.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Contracts;
