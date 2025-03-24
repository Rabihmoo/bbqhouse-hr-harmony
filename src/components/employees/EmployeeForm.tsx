
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePreventNavigation } from "@/hooks/use-prevent-navigation";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { companies } from "@/lib/data";

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
    biDetails: {
      issueDate: "",
      expiryDate: ""
    },
    address: "",
    secondAddress: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    salary: "",
    salaryStructure: {
      basicSalary: "",
      transportAllowance: "",
      accommodationAllowance: "",
      bonus: "",
      totalSalary: ""
    },
    hireDate: "",
    healthCardValid: false,
    healthCardValidUntil: "",
    picture: "",
    inssNumber: "",
    company: "BBQHouse LDA" as "BBQHouse LDA" | "SALT LDA" | "Executive Cleaning LDA",
  });
  
  const [isDirty, setIsDirty] = useState(false);
  
  usePreventNavigation({
    enabled: open && isDirty,
    message: "You have unsaved changes. Are you sure you want to leave?"
  });

  useEffect(() => {
    if (open) {
      if (isEditing && initialData) {
        setFormData({
          fullName: initialData.fullName || "",
          biNumber: initialData.biNumber || "",
          biValidUntil: initialData.biValidUntil || "",
          biValid: initialData.biValid || false,
          biDetails: {
            issueDate: initialData.biDetails?.issueDate || "",
            expiryDate: initialData.biDetails?.expiryDate || initialData.biValidUntil || ""
          },
          address: initialData.address || "",
          secondAddress: initialData.secondAddress || "",
          email: initialData.email || "",
          phone: initialData.phone || "",
          position: initialData.position || "",
          department: initialData.department || "",
          salary: initialData.salary ? String(initialData.salary) : "",
          salaryStructure: {
            basicSalary: initialData.salaryStructure?.basicSalary ? String(initialData.salaryStructure.basicSalary) : "",
            transportAllowance: initialData.salaryStructure?.transportAllowance ? String(initialData.salaryStructure.transportAllowance) : "",
            accommodationAllowance: initialData.salaryStructure?.accommodationAllowance ? String(initialData.salaryStructure.accommodationAllowance) : "",
            bonus: initialData.salaryStructure?.bonus ? String(initialData.salaryStructure.bonus) : "",
            totalSalary: initialData.salaryStructure?.totalSalary ? String(initialData.salaryStructure.totalSalary) : ""
          },
          hireDate: initialData.hireDate || "",
          healthCardValid: initialData.healthCardValid || false,
          healthCardValidUntil: initialData.healthCardValidUntil || "",
          picture: initialData.picture || "",
          inssNumber: initialData.inssNumber || "",
          company: initialData.company || "BBQHouse LDA",
        });
        setIsDirty(false);
      } else {
        setFormData({
          fullName: "",
          biNumber: "",
          biValidUntil: "",
          biValid: false,
          biDetails: {
            issueDate: "",
            expiryDate: ""
          },
          address: "",
          secondAddress: "",
          email: "",
          phone: "",
          position: "",
          department: "",
          salary: "",
          salaryStructure: {
            basicSalary: "",
            transportAllowance: "",
            accommodationAllowance: "",
            bonus: "",
            totalSalary: ""
          },
          hireDate: "",
          healthCardValid: false,
          healthCardValidUntil: "",
          picture: "",
          inssNumber: "",
          company: "BBQHouse LDA",
        });
        setIsDirty(false);
      }
    }
  }, [open, isEditing, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Handle nested salary structure
    if (name.startsWith('salaryStructure.')) {
      const salaryField = name.split('.')[1];
      setFormData(prevState => ({
        ...prevState,
        salaryStructure: {
          ...prevState.salaryStructure,
          [salaryField]: value
        }
      }));

      // Calculate total salary if any of the salary components changes
      if (['basicSalary', 'transportAllowance', 'accommodationAllowance', 'bonus'].includes(salaryField)) {
        const basicSalary = Number(salaryField === 'basicSalary' ? value : prevState.salaryStructure.basicSalary) || 0;
        const transportAllowance = Number(salaryField === 'transportAllowance' ? value : prevState.salaryStructure.transportAllowance) || 0;
        const accommodationAllowance = Number(salaryField === 'accommodationAllowance' ? value : prevState.salaryStructure.accommodationAllowance) || 0;
        const bonus = Number(salaryField === 'bonus' ? value : prevState.salaryStructure.bonus) || 0;

        const totalSalary = basicSalary + transportAllowance + accommodationAllowance + bonus;

        setFormData(prevState => ({
          ...prevState,
          salaryStructure: {
            ...prevState.salaryStructure,
            totalSalary: String(totalSalary)
          },
          salary: String(totalSalary) // Update the legacy salary field too
        }));
      }
    } 
    // Handle nested BI details
    else if (name.startsWith('biDetails.')) {
      const biField = name.split('.')[1];
      setFormData(prevState => ({
        ...prevState,
        biDetails: {
          ...prevState.biDetails,
          [biField]: value
        },
        // Update biValidUntil for backward compatibility
        ...(biField === 'expiryDate' ? { biValidUntil: value } : {})
      }));
    } 
    else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    setIsDirty(true);
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
    setIsDirty(true);
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData({
      ...formData,
      picture: imageUrl,
    });
    setIsDirty(true);
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    setIsDirty(true);
  };

  const handleDateChange = (field: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');

    // Handle BI dates
    if (field === 'biDetails.issueDate') {
      setFormData(prev => ({
        ...prev,
        biDetails: {
          ...prev.biDetails,
          issueDate: dateStr
        }
      }));
    } 
    else if (field === 'biDetails.expiryDate') {
      setFormData(prev => ({
        ...prev,
        biDetails: {
          ...prev.biDetails,
          expiryDate: dateStr
        },
        biValidUntil: dateStr // For backward compatibility
      }));
    } 
    else {
      setFormData({
        ...formData,
        [field]: dateStr,
      });
    }
    
    setIsDirty(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const processedData = {
        ...formData,
        salaryStructure: {
          basicSalary: Number(formData.salaryStructure.basicSalary),
          transportAllowance: Number(formData.salaryStructure.transportAllowance),
          accommodationAllowance: Number(formData.salaryStructure.accommodationAllowance),
          bonus: Number(formData.salaryStructure.bonus),
          totalSalary: Number(formData.salaryStructure.totalSalary)
        },
        salary: Number(formData.salaryStructure.totalSalary), // For backward compatibility
        id: initialData?.id || undefined,
      };
      
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

          <div className="grid grid-cols-1 gap-8">
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
                  <Label htmlFor="biDetails.issueDate" className="mb-1">
                    BI Issue Date*
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.biDetails.issueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.biDetails.issueDate ? format(new Date(formData.biDetails.issueDate), 'PPP') : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-2">
                        <Label>BI Issue Date</Label>
                        <Input
                          type="date"
                          name="biDetails.issueDate"
                          value={formData.biDetails.issueDate}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="biDetails.expiryDate" className="mb-1">
                    BI Expiry Date*
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.biDetails.expiryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.biDetails.expiryDate ? format(new Date(formData.biDetails.expiryDate), 'PPP') : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-2">
                        <Label>BI Expiry Date</Label>
                        <Input
                          type="date"
                          name="biDetails.expiryDate"
                          value={formData.biDetails.expiryDate}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center mt-2">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="company" className="mb-1">
                    Company*
                  </Label>
                  <Select
                    value={formData.company}
                    onValueChange={(value) => handleSelectChange("company", value)}
                  >
                    <SelectTrigger id="company">
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map(company => (
                        <SelectItem key={company.id} value={company.name}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="hireDate" className="mb-1">
                    Hire Date*
                  </Label>
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
                        {formData.hireDate ? format(new Date(formData.hireDate), 'PPP') : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-2">
                        <Label>Hire Date</Label>
                        <Input
                          type="date"
                          name="hireDate"
                          value={formData.hireDate}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
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

              <div className="mt-6">
                <h4 className="font-medium mb-3">Salary Structure*</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="basicSalary" className="mb-1">
                        Basic Salary*
                      </Label>
                      <Input
                        type="number"
                        id="basicSalary"
                        name="salaryStructure.basicSalary"
                        value={formData.salaryStructure.basicSalary}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter basic salary amount"
                      />
                    </div>

                    <div>
                      <Label htmlFor="transportAllowance" className="mb-1">
                        Transport Allowance*
                      </Label>
                      <Input
                        type="number"
                        id="transportAllowance"
                        name="salaryStructure.transportAllowance"
                        value={formData.salaryStructure.transportAllowance}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter transport allowance"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="accommodationAllowance" className="mb-1">
                        Accommodation Allowance*
                      </Label>
                      <Input
                        type="number"
                        id="accommodationAllowance"
                        name="salaryStructure.accommodationAllowance"
                        value={formData.salaryStructure.accommodationAllowance}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter accommodation allowance"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bonus" className="mb-1">
                        Bonus*
                      </Label>
                      <Input
                        type="number"
                        id="bonus"
                        name="salaryStructure.bonus"
                        value={formData.salaryStructure.bonus}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter bonus amount"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="totalSalary" className="mb-1">
                      Total Salary
                    </Label>
                    <Input
                      type="number"
                      id="totalSalary"
                      name="salaryStructure.totalSalary"
                      value={formData.salaryStructure.totalSalary}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>
              </div>
            </section>

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
