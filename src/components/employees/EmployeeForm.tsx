
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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

  // Update form data only when opening the modal with new data
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
  }, [initialData, open, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
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
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white dark:bg-black/40">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
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
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="biValidUntil">BI Validity Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.biValidUntil && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.biValidUntil ? format(new Date(formData.biValidUntil), 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.biValidUntil ? new Date(formData.biValidUntil) : undefined}
                      onSelect={(date) => handleDateChange('biValidUntil', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="healthCardValidUntil">Health Card Validity Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.healthCardValidUntil && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.healthCardValidUntil ? format(new Date(formData.healthCardValidUntil), 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.healthCardValidUntil ? new Date(formData.healthCardValidUntil) : undefined}
                      onSelect={(date) => handleDateChange('healthCardValidUntil', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="secondAddress">Secondary Address (optional)</Label>
              <Input
                id="secondAddress"
                name="secondAddress"
                value={formData.secondAddress}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hireDate">Hire Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.hireDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.hireDate ? format(new Date(formData.hireDate), 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.hireDate ? new Date(formData.hireDate) : undefined}
                      onSelect={(date) => handleDateChange('hireDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="salary">Salary (KZ)</Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleInputChange}
                  required
                />
              </div>
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
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
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
