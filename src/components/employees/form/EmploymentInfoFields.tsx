
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmploymentInfoFieldsProps {
  formData: {
    position: string;
    department: string;
    salary: string;
    hireDate: string;
    inssNumber: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleDateChange: (name: string, date: Date | undefined) => void;
}

const EmploymentInfoFields = ({ 
  formData, 
  handleInputChange, 
  handleSelectChange, 
  handleDateChange 
}: EmploymentInfoFieldsProps) => {
  return (
    <div className="space-y-4">
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
            <SelectTrigger id="department" className="h-11 text-base">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent position="popper" align="start" sideOffset={8} className="z-[9999]">
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
                id="hireDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-11 px-4 text-base",
                  !formData.hireDate && "text-muted-foreground"
                )}
                type="button"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.hireDate ? format(new Date(formData.hireDate), 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[9999]" align="start">
              <Calendar
                mode="single"
                selected={formData.hireDate ? new Date(formData.hireDate) : undefined}
                onSelect={(date) => handleDateChange('hireDate', date)}
                initialFocus
                className="pointer-events-auto z-[9999]"
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
  );
};

export default EmploymentInfoFields;
