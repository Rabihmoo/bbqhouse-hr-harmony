
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEmployeeForm } from "@/hooks/use-employee-form";
import PersonalInfoFields from "./form/PersonalInfoFields";
import EmploymentInfoFields from "./form/EmploymentInfoFields";
import DocumentStatusFields from "./form/DocumentStatusFields";
import ImageUploadField from "./form/ImageUploadField";
import FormActions from "./form/FormActions";

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

const EmployeeForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  initialData = {}, 
  isEditing = false 
}: EmployeeFormProps) => {
  const {
    formData,
    handleInputChange,
    handleSelectChange,
    handleSwitchChange,
    handleDateChange,
    handleImageChange,
  } = useEmployeeForm({ initialData, isEditing, open });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      ...formData,
      salary: Number(formData.salary), 
      id: initialData?.id || undefined 
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] max-h-[85vh] overflow-y-auto p-6 gap-4">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl">
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
          <DialogDescription>
            Fill in the employee details below.
          </DialogDescription>
        </DialogHeader>

        <form id="employee-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            <ImageUploadField 
              picture={formData.picture} 
              onImageChange={handleImageChange} 
            />
            
            <PersonalInfoFields 
              formData={formData} 
              handleInputChange={handleInputChange} 
              handleDateChange={handleDateChange} 
            />
            
            <EmploymentInfoFields 
              formData={formData} 
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleDateChange={handleDateChange}
            />
            
            <DocumentStatusFields 
              formData={formData}
              handleSwitchChange={handleSwitchChange}
              handleDateChange={handleDateChange}
            />
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
