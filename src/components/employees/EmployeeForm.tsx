
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePreventNavigation } from "@/hooks/use-prevent-navigation";
import { useEmployeeFormState } from "@/hooks/employee-form/use-employee-form-state";
import FormSection from "./form/FormSection";
import BIDetailsFields from "./form/BIDetailsFields";
import SalaryStructureFields from "./form/SalaryStructureFields";
import AddressFields from "./form/AddressFields";
import ContactFields from "./form/ContactFields";
import CompanySelector from "./form/CompanySelector";
import EmploymentInfoFields from "./form/EmploymentInfoFields";
import DocumentStatusFields from "./form/DocumentStatusFields";
import ImageUploadField from "./form/ImageUploadField";
import FormActions from "./form/FormActions";
import DocumentUploadFields from "./form/DocumentUploadFields";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any | null;
  isEditing?: boolean;
}

const EmployeeForm = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
  isEditing = false
}: EmployeeFormProps) => {
  const { toast } = useToast();
  const {
    formData, 
    isDirty, 
    setIsDirty,
    handleInputChange,
    handleBasicInfoChange,
    handleSalaryChange,
    handleCheckboxChange,
    handleImageChange,
    handleSelectChange,
    handleDateChange,
    handleBIInputChange,
    handleDocumentUpload,
    processFormData,
    handleSubmit
  } = useEmployeeFormState(open, isEditing, initialData, onSubmit);
  
  usePreventNavigation({
    enabled: open && isDirty,
    message: "You have unsaved changes. Are you sure you want to leave?"
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const processedData = processFormData();
      onSubmit(processedData);
      
      toast({
        title: isEditing ? "Employee Updated" : "Employee Added",
        description: `${formData.fullName} has been successfully ${isEditing ? "updated" : "added"}.`,
      });
      
      setIsDirty(false);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the employee data.",
        variant: "destructive",
      });
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen && isDirty) {
        if (confirm("You have unsaved changes. Are you sure you want to close this form?")) {
          onClose();
        }
      } else if (!isOpen) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
          <DialogDescription>
            Fill in the employee details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="mb-6">
            <ImageUploadField 
              picture={formData.picture} 
              onImageChange={handleImageChange} 
            />
          </div>

          <div className="grid grid-cols-1 gap-8">
            <FormSection title="Personal Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" className="mb-1">
                    Full Name*
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleBasicInfoChange}
                    required
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="status" className="mb-1">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                      <SelectItem value="Terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <BIDetailsFields 
                  formData={formData}
                  handleInputChange={handleBIInputChange}
                  handleCheckboxChange={handleCheckboxChange}
                />
              </div>
              
              <AddressFields 
                formData={formData}
                handleInputChange={handleBasicInfoChange}
              />
              
              <ContactFields 
                formData={formData}
                handleInputChange={handleBasicInfoChange}
              />
            </FormSection>

            <FormSection title="Employment Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EmploymentInfoFields
                  formData={formData}
                  handleInputChange={handleBasicInfoChange}
                  handleSelectChange={handleSelectChange}
                  handleDateChange={handleDateChange}
                />
                
                <CompanySelector
                  value={formData.company}
                  onValueChange={(value) => handleSelectChange("company", value)}
                />
              </div>
              
              <SalaryStructureFields
                formData={formData}
                handleInputChange={handleSalaryChange}
              />
            </FormSection>

            <FormSection title="Document Status">
              <DocumentStatusFields
                formData={formData}
                handleSwitchChange={handleCheckboxChange}
                handleDateChange={handleDateChange}
              />
            </FormSection>

            <FormSection title="Required Documents">
              <DocumentUploadFields
                documents={formData.documents || {}}
                onDocumentUpload={handleDocumentUpload}
              />
            </FormSection>
          </div>

          <FormActions
            isEditing={isEditing}
            onCancel={onClose}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeForm;
