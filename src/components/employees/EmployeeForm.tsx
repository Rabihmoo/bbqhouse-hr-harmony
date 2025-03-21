
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
  const [formData, setFormData] = useState({
    fullName: "",
    biNumber: "",
    biValidUntil: "",
    biValid: false,
    address: "",
    secondAddress: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    salary: "",
    hireDate: "",
    healthCardValid: false,
    healthCardValidUntil: "",
    picture: "",
    inssNumber: "",
  });

  // Reset form when dialog opens/closes or when in edit mode and initialData changes
  useEffect(() => {
    if (open) {
      if (isEditing && initialData) {
        setFormData({
          fullName: initialData.fullName || "",
          biNumber: initialData.biNumber || "",
          biValidUntil: initialData.biValidUntil || "",
          biValid: initialData.biValid || false,
          address: initialData.address || "",
          secondAddress: initialData.secondAddress || "",
          email: initialData.email || "",
          phone: initialData.phone || "",
          position: initialData.position || "",
          department: initialData.department || "",
          salary: initialData.salary ? String(initialData.salary) : "",
          hireDate: initialData.hireDate || "",
          healthCardValid: initialData.healthCardValid || false,
          healthCardValidUntil: initialData.healthCardValidUntil || "",
          picture: initialData.picture || "",
          inssNumber: initialData.inssNumber || "",
        });
      } else {
        // Reset form for new employee
        setFormData({
          fullName: "",
          biNumber: "",
          biValidUntil: "",
          biValid: false,
          address: "",
          secondAddress: "",
          email: "",
          phone: "",
          position: "",
          department: "",
          salary: "",
          hireDate: "",
          healthCardValid: false,
          healthCardValidUntil: "",
          picture: "",
          inssNumber: "",
        });
      }
    }
  }, [open, isEditing, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData({
      ...formData,
      picture: imageUrl,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      onSubmit({
        ...formData,
        salary: Number(formData.salary),
        id: initialData?.id || undefined,
      });
      
      toast({
        title: isEditing ? "Employee Updated" : "Employee Added",
        description: `${formData.fullName} has been successfully ${isEditing ? "updated" : "added"}.`,
      });
      
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

  // Simple image preview component
  const ImagePreview = () => {
    if (!formData.picture) return null;
    
    return (
      <div className="h-20 w-20 rounded-full overflow-hidden border">
        <img 
          src={formData.picture} 
          alt="Employee" 
          className="h-full w-full object-cover" 
        />
      </div>
    );
  };

  // If not open, don't render anything
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
          <DialogDescription>
            Fill in the employee details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="mb-6 flex items-center gap-4">
            <ImagePreview />
            <div>
              <Label htmlFor="picture-upload">Employee Picture</Label>
              <Input
                id="picture-upload"
                type="file"
                accept="image/*"
                className="mt-1"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const imageUrl = URL.createObjectURL(e.target.files[0]);
                    handleImageChange(imageUrl);
                  }
                }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="grid grid-cols-1 gap-8">
            {/* Personal Information */}
            <section>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" className="mb-1">
                    Full Name*
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <Label htmlFor="biNumber" className="mb-1">
                    BI Number*
                  </Label>
                  <Input
                    id="biNumber"
                    name="biNumber"
                    value={formData.biNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter BI number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="biValidUntil" className="mb-1">
                    BI Validity Date*
                  </Label>
                  <Input
                    type="date"
                    id="biValidUntil"
                    name="biValidUntil"
                    value={formData.biValidUntil}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex items-center mt-6">
                  <Checkbox
                    id="biValid"
                    checked={formData.biValid}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("biValid", checked === true)
                    }
                    className="mr-2"
                  />
                  <Label htmlFor="biValid">
                    BI Valid
                  </Label>
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="address" className="mb-1">
                  Address*
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter address"
                  rows={2}
                />
              </div>

              <div className="mt-4">
                <Label htmlFor="secondAddress" className="mb-1">
                  Secondary Address (optional)
                </Label>
                <Textarea
                  id="secondAddress"
                  name="secondAddress"
                  value={formData.secondAddress}
                  onChange={handleInputChange}
                  placeholder="Enter secondary address"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="email" className="mb-1">
                    Email*
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="mb-1">
                    Phone*
                  </Label>
                  <Input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </section>

            {/* Employment Information */}
            <section>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Employment Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position" className="mb-1">
                    Position*
                  </Label>
                  <Input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter position"
                  />
                </div>

                <div>
                  <Label htmlFor="department" className="mb-1">
                    Department*
                  </Label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select department</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Sala">Sala</option>
                    <option value="Bar">Bar</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Takeaway">Takeaway</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="hireDate" className="mb-1">
                    Hire Date*
                  </Label>
                  <Input
                    type="date"
                    id="hireDate"
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="salary" className="mb-1">
                    Salary (KZ)*
                  </Label>
                  <Input
                    type="number"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter salary amount"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="inssNumber" className="mb-1">
                  INSS Number
                </Label>
                <Input
                  type="text"
                  id="inssNumber"
                  name="inssNumber"
                  value={formData.inssNumber}
                  onChange={handleInputChange}
                  placeholder="Enter INSS number"
                />
              </div>
            </section>

            {/* Document Status */}
            <section>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Document Status</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="healthCardValidUntil" className="mb-1">
                    Health Card Validity Date
                  </Label>
                  <Input
                    type="date"
                    id="healthCardValidUntil"
                    name="healthCardValidUntil"
                    value={formData.healthCardValidUntil}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center mt-6">
                  <Checkbox
                    id="healthCardValid"
                    checked={formData.healthCardValid}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("healthCardValid", checked === true)
                    }
                    className="mr-2"
                  />
                  <Label htmlFor="healthCardValid">
                    Health Card Valid
                  </Label>
                </div>
              </div>
            </section>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t mt-8">
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
