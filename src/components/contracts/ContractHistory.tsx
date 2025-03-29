
import React from "react";
import { FileCheck, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContractHistoryProps {
  generatedContracts: any[];
  onDownloadContract: (contract: any) => void;
}

const ContractHistory = ({ generatedContracts, onDownloadContract }: ContractHistoryProps) => {
  return (
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
              <Button variant="outline" size="sm" onClick={() => onDownloadContract(contract)}>
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
  );
};

export default ContractHistory;
