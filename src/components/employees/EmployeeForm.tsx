
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import PersonalInfoFields from "./form/PersonalInfoFields";
import EmploymentInfoFields from "./form/EmploymentInfoFields";
import DocumentStatusFields from "./form/DocumentStatusFields";

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
  const [formData, setFormData] = useState({
    fullName: "",
    biNumber: "",
    biValidUntil: "",
    address: "",
    secondAddress: "",
    position: "",
    department: "",
    salary: "",
    healthCardValid: false,
    healthCardValidUntil: "",
    biValid: false,
    email: "",
    phone: "",
    hireDate: "",
    picture: "",
  });

  useEffect(() => {
    if (open) {
      if (isEditing && initialData && Object.keys(initialData).length > 0) {
        setFormData({
          fullName: initialData.fullName || "",
          biNumber: initialData.biNumber || "",
          biValidUntil: initialData.biValidUntil || "",
          address: initialData.address || "",
          secondAddress: initialData.secondAddress || "",
          position: initialData.position || "",
          department: initialData.department || "",
          salary: initialData.salary ? String(initialData.salary) : "",
          healthCardValid: initialData.healthCardValid || false,
          healthCardValidUntil: initialData.healthCardValidUntil || "",
          biValid: initialData.biValid || false,
          email: initialData.email || "",
          phone: initialData.phone || "",
          hireDate: initialData.hireDate || "",
          picture: initialData.picture || "",
        });
      } else if (!isEditing) {
        // Reset form when adding new employee
        setFormData({
          fullName: "",
          biNumber: "",
          biValidUntil: "",
          address: "",
          secondAddress: "",
          position: "",
          department: "",
          salary: "",
          healthCardValid: false,
          healthCardValidUntil: "",
          biValid: false,
          email: "",
          phone: "",
          hireDate: "",
          picture: "",
        });
      }
    }
  }, [open, isEditing, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [name]: format(date, "yyyy-MM-dd"),
      }));
    }
  };

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
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
          <DialogDescription>
            Fill in the employee details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="grid gap-6 py-4">
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

          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Add Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeForm;
