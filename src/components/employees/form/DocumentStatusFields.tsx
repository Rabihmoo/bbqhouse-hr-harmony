
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DocumentStatusFieldsProps {
  formData: {
    healthCardValid: boolean;
    healthCardValidUntil: string;
    biValid: boolean;
    biValidUntil: string;
  };
  handleSwitchChange: (name: string, checked: boolean) => void;
  handleDateChange: (name: string, date: Date | undefined) => void;
}

const DocumentStatusFields = ({ 
  formData, 
  handleSwitchChange, 
  handleDateChange 
}: DocumentStatusFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="healthCardValidUntil">Health Card Validity Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="healthCardValidUntil"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal h-11 px-4 text-base",
                !formData.healthCardValidUntil && "text-muted-foreground"
              )}
              type="button"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.healthCardValidUntil ? format(new Date(formData.healthCardValidUntil), 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-[9999]" align="start">
            <Calendar
              mode="single"
              selected={formData.healthCardValidUntil ? new Date(formData.healthCardValidUntil) : undefined}
              onSelect={(date) => handleDateChange('healthCardValidUntil', date)}
              initialFocus
              className="pointer-events-auto z-[9999]"
            />
          </PopoverContent>
        </Popover>
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
  );
};

export default DocumentStatusFields;
