
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PersonalInfoFieldsProps {
  formData: {
    fullName: string;
    biNumber: string;
    biValidUntil: string;
    address: string;
    secondAddress: string;
    email: string;
    phone: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleDateChange: (name: string, date: Date | undefined) => void;
}

const PersonalInfoFields = ({ 
  formData, 
  handleInputChange, 
  handleDateChange 
}: PersonalInfoFieldsProps) => {
  return (
    <div className="space-y-4">
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

      <div className="grid gap-2">
        <Label htmlFor="biValidUntil">BI Validity Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="biValidUntil"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.biValidUntil && "text-muted-foreground"
              )}
              type="button"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.biValidUntil ? format(new Date(formData.biValidUntil), 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-[100]" align="start">
            <Calendar
              mode="single"
              selected={formData.biValidUntil ? new Date(formData.biValidUntil) : undefined}
              onSelect={(date) => handleDateChange('biValidUntil', date)}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Input
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
        <Input
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
  );
};

export default PersonalInfoFields;
