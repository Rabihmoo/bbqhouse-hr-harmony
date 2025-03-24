
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface BIDetailsFieldsProps {
  formData: {
    biNumber: string;
    biDetails: {
      issueDate: string;
      expiryDate: string;
    };
    biValid: boolean;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
}

const BIDetailsFields = ({ formData, handleInputChange, handleCheckboxChange }: BIDetailsFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
};

export default BIDetailsFields;
