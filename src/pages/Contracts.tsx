
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
    // In a real implementation, this would download an actual Word document
    // For now, we'll simulate a download with a .docx file
    
    toast.success("Downloading contract", {
      description: `Contract for ${contract.employeeName} is being downloaded as a Word document.`
    });
    
    // Create a Blob that would represent a Word document
    // In a real implementation, this would be the actual docx content
    const dummyContent = `
      Contract for ${contract.employeeName}
      Position: ${contract.position}
      Company: ${contract.company}
      Start Date: ${contract.startDate}
      Signature Date: ${contract.signatureDate}
      
      Notes: ${contract.notes}
    `;
    
    // Create a blob with Word document MIME type
    const blob = new Blob([dummyContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    
    // Create a link to download the blob
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Contract_${contract.employeeName.replace(/ /g, '_')}.docx`);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    URL.revokeObjectURL(url);
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
                  <div key={contract.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="text-left">
                      <h3 className="font-medium">{contract.employeeName}</h3>
                      <p className="text-sm text-muted-foreground">{contract.company} - Generated on {new Date(contract.generatedAt).toLocaleDateString()}</p>
                      <div className="flex items-center mt-1">
                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">
                          Word Document
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleDownloadContract(contract)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download .docx
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
