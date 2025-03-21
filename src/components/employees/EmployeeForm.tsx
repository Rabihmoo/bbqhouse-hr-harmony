
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import PersonalInfoFields from "./form/PersonalInfoFields";
import EmploymentInfoFields from "./form/EmploymentInfoFields";
import DocumentStatusFields from "./form/DocumentStatusFields";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

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
  const { toast } = useToast();
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
    inssNumber: "", // Added INSS Number field
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
          inssNumber: initialData.inssNumber || "", // Added INSS Number field
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
          inssNumber: "", // Added INSS Number field
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you would upload this file to your server
      // For now, we'll just create a URL for preview
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      
      setFormData(prev => ({
        ...prev,
        picture: imageUrl,
      }));
      
      toast({
        title: "Picture uploaded",
        description: "Employee picture has been uploaded successfully.",
      });
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
            <div className="grid gap-4">
              <Label>Employee Picture</Label>
              <div className="flex items-center gap-4">
                {formData.picture && (
                  <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img 
                      src={formData.picture} 
                      alt="Employee" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <label htmlFor="picture-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    <Upload className="h-4 w-4" />
                    <span>Upload Picture</span>
                  </div>
                  <input 
                    id="picture-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
            
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
