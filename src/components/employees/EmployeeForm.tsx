
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Department } from "@/lib/data";

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
    fullName: initialData.fullName || "",
    biNumber: initialData.biNumber || "",
    address: initialData.address || "",
    position: initialData.position || "",
    department: initialData.department || "",
    salary: initialData.salary || "",
    healthCardValid: initialData.healthCardValid || false,
    biValid: initialData.biValid || false,
    email: initialData.email || "",
    phone: initialData.phone || "",
    hireDate: initialData.hireDate || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      ...formData,
      salary: Number(formData.salary), 
      id: initialData.id || undefined 
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] glass">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
          <DialogDescription>
            Fill in the employee details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="biNumber">BI Number</Label>
                <Input
                  id="biNumber"
                  name="biNumber"
                  value={formData.biNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleSelectChange("department", value)}
                >
                  <SelectTrigger id="department">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hireDate">Hire Date</Label>
                <Input
                  id="hireDate"
                  name="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={handleChange}
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
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="healthCardValid"
                  checked={formData.healthCardValid}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("healthCardValid", checked)
                  }
                />
                <Label htmlFor="healthCardValid">Health Card Valid</Label>
              </div>

              <div className="flex items-center gap-2">
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
          </div>

          <DialogFooter>
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
