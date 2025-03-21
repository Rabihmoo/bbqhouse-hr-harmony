
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEmployeeForm } from "@/hooks/use-employee-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import ImageUploadField from "./form/ImageUploadField";
import { useState } from "react";

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

  // Store date inputs to avoid calendar issues
  const [dateInputs, setDateInputs] = useState({
    biValidUntil: formData.biValidUntil || '',
    healthCardValidUntil: formData.healthCardValidUntil || '',
    hireDate: formData.hireDate || ''
  });

  // Handle date input changes directly
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateInputs(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Also update the form data with the selected date
    if (value) {
      handleDateChange(name, new Date(value));
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
      <DialogContent className="sm:max-w-[640px] md:max-w-[700px] max-h-[85vh] overflow-y-auto p-6 gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
          <DialogDescription>
            Fill in the employee details below.
          </DialogDescription>
        </DialogHeader>

        <form id="employee-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            {/* Image Upload */}
            <ImageUploadField 
              picture={formData.picture} 
              onImageChange={handleImageChange} 
            />
            
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="biNumber">BI Number</Label>
                  <Input
                    id="biNumber"
                    name="biNumber"
                    value={formData.biNumber}
                    onChange={handleInputChange}
                    placeholder="Enter BI number"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="biValidUntil">BI Validity Date</Label>
                  <Input
                    id="biValidUntil"
                    name="biValidUntil"
                    type="date"
                    value={dateInputs.biValidUntil}
                    onChange={handleDateInputChange}
                    required
                  />
                </div>

                <div className="flex items-center gap-2 pt-8">
                  <Switch
                    id="biValid"
                    checked={formData.biValid}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("biValid", checked)
                    }
                  />
                  <Label htmlFor="biValid">BI Valid</Label>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="secondAddress">Secondary Address (optional)</Label>
                <Textarea
                  id="secondAddress"
                  name="secondAddress"
                  value={formData.secondAddress}
                  onChange={handleInputChange}
                  placeholder="Enter secondary address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Employment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Employment Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Enter position"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleSelectChange("department", value)}
                  >
                    <SelectTrigger id="department" className="h-11">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kitchen">Kitchen</SelectItem>
                      <SelectItem value="Sala">Sala</SelectItem>
                      <SelectItem value="Bar">Bar</SelectItem>
                      <SelectItem value="Cleaning">Cleaning</SelectItem>
                      <SelectItem value="Takeaway">Takeaway</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="hireDate">Hire Date</Label>
                  <Input
                    id="hireDate"
                    name="hireDate"
                    type="date"
                    value={dateInputs.hireDate}
                    onChange={handleDateInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="salary">Salary (KZ)</Label>
                  <Input
                    id="salary"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="Enter salary amount"
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="inssNumber">INSS Number</Label>
                <Input
                  id="inssNumber"
                  name="inssNumber"
                  value={formData.inssNumber}
                  onChange={handleInputChange}
                  placeholder="Enter INSS number"
                />
              </div>
            </div>
            
            {/* Document Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Document Status</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="healthCardValidUntil">Health Card Validity Date</Label>
                  <Input
                    id="healthCardValidUntil"
                    name="healthCardValidUntil"
                    type="date"
                    value={dateInputs.healthCardValidUntil}
                    onChange={handleDateInputChange}
                  />
                </div>

                <div className="flex items-center gap-2 pt-8">
                  <Switch
                    id="healthCardValid"
                    checked={formData.healthCardValid}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("healthCardValid", checked)
                    }
                  />
                  <Label htmlFor="healthCardValid">Health Card Valid</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Add Employee"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeForm;
