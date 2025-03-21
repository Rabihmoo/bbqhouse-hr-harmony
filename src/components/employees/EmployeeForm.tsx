
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ImageUploadField from "./form/ImageUploadField";

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

  // Reset form when dialog opens/closes
  useState(() => {
    if (open && isEditing && initialData) {
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
    } else if (!isEditing) {
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
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
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
          <div className="mb-6">
            <ImageUploadField
              picture={formData.picture}
              onImageChange={handleImageChange}
            />
          </div>

          {/* Form Content */}
          <div className="grid grid-cols-1 gap-8">
            {/* Personal Information */}
            <section>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-md"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label htmlFor="biNumber" className="block text-sm font-medium mb-1">
                    BI Number*
                  </label>
                  <input
                    type="text"
                    id="biNumber"
                    name="biNumber"
                    value={formData.biNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-md"
                    placeholder="Enter BI number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="biValidUntil" className="block text-sm font-medium mb-1">
                    BI Validity Date*
                  </label>
                  <input
                    type="date"
                    id="biValidUntil"
                    name="biValidUntil"
                    value={formData.biValidUntil}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-md"
                  />
                </div>

                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    id="biValid"
                    name="biValid"
                    checked={formData.biValid}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 mr-2"
                  />
                  <label htmlFor="biValid" className="text-sm font-medium">
                    BI Valid
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="address" className="block text-sm font-medium mb-1">
                  Address*
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border rounded-md"
                  rows={2}
                  placeholder="Enter address"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="secondAddress" className="block text-sm font-medium mb-1">
                  Secondary Address (optional)
                </label>
                <textarea
                  id="secondAddress"
                  name="secondAddress"
                  value={formData.secondAddress}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                  rows={2}
                  placeholder="Enter secondary address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-md"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Phone*
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-md"
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
                  <label htmlFor="position" className="block text-sm font-medium mb-1">
                    Position*
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-md"
                    placeholder="Enter position"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium mb-1">
                    Department*
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-md"
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
                  <label htmlFor="hireDate" className="block text-sm font-medium mb-1">
                    Hire Date*
                  </label>
                  <input
                    type="date"
                    id="hireDate"
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="salary" className="block text-sm font-medium mb-1">
                    Salary (KZ)*
                  </label>
                  <input
                    type="number"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-md"
                    placeholder="Enter salary amount"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="inssNumber" className="block text-sm font-medium mb-1">
                  INSS Number
                </label>
                <input
                  type="text"
                  id="inssNumber"
                  name="inssNumber"
                  value={formData.inssNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                  placeholder="Enter INSS number"
                />
              </div>
            </section>

            {/* Document Status */}
            <section>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Document Status</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="healthCardValidUntil" className="block text-sm font-medium mb-1">
                    Health Card Validity Date
                  </label>
                  <input
                    type="date"
                    id="healthCardValidUntil"
                    name="healthCardValidUntil"
                    value={formData.healthCardValidUntil}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md"
                  />
                </div>

                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    id="healthCardValid"
                    name="healthCardValid"
                    checked={formData.healthCardValid}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 mr-2"
                  />
                  <label htmlFor="healthCardValid" className="text-sm font-medium">
                    Health Card Valid
                  </label>
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
