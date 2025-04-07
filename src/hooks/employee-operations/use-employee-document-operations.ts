
import { useToast } from "@/hooks/use-toast";

export const useEmployeeDocumentOperations = () => {
  const { toast } = useToast();

  const checkMissingDocuments = (employees: any[]) => {
    employees.forEach(employee => {
      if (!employee.documents) return;
      
      const requiredDocs = ['bi', 'healthCard', 'tax', 'nuit', 'declaration', 'cv'];
      const missingDocs = requiredDocs.filter(doc => 
        !employee.documents[doc] || !employee.documents[doc].uploaded
      );
      
      if (missingDocs.length > 0) {
        toast({
          title: "Missing Documents",
          description: `${employee.fullName} is missing ${missingDocs.length} document(s): ${missingDocs.join(', ')}`,
          variant: "destructive",
        });
      }
    });
  };

  return {
    checkMissingDocuments
  };
};
