
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CustomField } from "@/types/company";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus, Trash, X } from "lucide-react";
import { format } from "date-fns";

interface CustomFieldsSectionProps {
  customFields: CustomField[];
  setCustomFields: React.Dispatch<React.SetStateAction<CustomField[]>>;
}

const CustomFieldsSection: React.FC<CustomFieldsSectionProps> = ({
  customFields,
  setCustomFields
}) => {
  const [isAddingField, setIsAddingField] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<CustomField["fieldType"]>("text");
  const [newFieldValue, setNewFieldValue] = useState<string | number | null>("");
  const [newFieldOptions, setNewFieldOptions] = useState<string[]>([]);
  const [newOptionText, setNewOptionText] = useState<string>("");

  const addCustomField = () => {
    if (!newFieldName.trim()) {
      return;
    }

    let fieldValue: CustomField["fieldValue"] = newFieldValue;

    if (newFieldType === "dropdown") {
      fieldValue = [];
    } else if (newFieldType === "date") {
      fieldValue = new Date().toISOString();
    }

    const newField: CustomField = {
      id: uuidv4(),
      fieldName: newFieldName,
      fieldType: newFieldType,
      fieldValue,
      options: newFieldType === "dropdown" ? newFieldOptions : undefined
    };

    setCustomFields([...customFields, newField]);
    resetNewFieldForm();
  };

  const resetNewFieldForm = () => {
    setNewFieldName("");
    setNewFieldType("text");
    setNewFieldValue("");
    setNewFieldOptions([]);
    setIsAddingField(false);
  };

  const updateFieldValue = (fieldId: string, value: CustomField["fieldValue"]) => {
    setCustomFields(
      customFields.map(field =>
        field.id === fieldId ? { ...field, fieldValue: value } : field
      )
    );
  };

  const removeCustomField = (fieldId: string) => {
    setCustomFields(customFields.filter(field => field.id !== fieldId));
  };

  const addOption = () => {
    if (newOptionText.trim() && !newFieldOptions.includes(newOptionText)) {
      setNewFieldOptions([...newFieldOptions, newOptionText]);
      setNewOptionText("");
    }
  };

  const removeOption = (option: string) => {
    setNewFieldOptions(newFieldOptions.filter(opt => opt !== option));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base">Custom Fields</Label>
        {!isAddingField && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsAddingField(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Field
          </Button>
        )}
      </div>

      {isAddingField && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fieldName">Field Name</Label>
                <Input
                  id="fieldName"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="e.g., Warehouse Contact"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="fieldType">Field Type</Label>
                <Select
                  value={newFieldType}
                  onValueChange={(value) => setNewFieldType(value as CustomField["fieldType"])}
                >
                  <SelectTrigger id="fieldType" className="mt-1">
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="file">File Upload</SelectItem>
                    <SelectItem value="dropdown">Dropdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {newFieldType === "dropdown" && (
              <div className="space-y-2">
                <Label>Dropdown Options</Label>
                <div className="flex gap-2">
                  <Input
                    value={newOptionText}
                    onChange={(e) => setNewOptionText(e.target.value)}
                    placeholder="Add an option"
                    className="flex-grow"
                  />
                  <Button type="button" onClick={addOption} size="sm">
                    Add
                  </Button>
                </div>
                {newFieldOptions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newFieldOptions.map((option, index) => (
                      <div
                        key={index}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1"
                      >
                        {option}
                        <button
                          type="button"
                          onClick={() => removeOption(option)}
                          className="text-secondary-foreground/70 hover:text-secondary-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {newFieldType !== "dropdown" && newFieldType !== "date" && newFieldType !== "file" && (
              <div>
                <Label htmlFor="fieldValue">Default Value (Optional)</Label>
                <Input
                  id="fieldValue"
                  type={newFieldType === "number" ? "number" : "text"}
                  value={newFieldValue?.toString() || ""}
                  onChange={(e) => setNewFieldValue(newFieldType === "number" ? Number(e.target.value) : e.target.value)}
                  placeholder="Default value"
                  className="mt-1"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={resetNewFieldForm}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={addCustomField}
                disabled={!newFieldName.trim()}
              >
                Add Field
              </Button>
            </div>
          </div>
        </Card>
      )}

      {customFields.length > 0 && (
        <div className="space-y-4">
          {customFields.map((field) => (
            <div key={field.id} className="bg-muted rounded-md p-4 flex gap-4 items-start">
              <div className="flex-grow">
                <Label className="mb-1">{field.fieldName}</Label>

                {field.fieldType === "text" && (
                  <Input
                    value={field.fieldValue?.toString() || ""}
                    onChange={(e) => updateFieldValue(field.id, e.target.value)}
                    placeholder="Text value"
                  />
                )}

                {field.fieldType === "number" && (
                  <Input
                    type="number"
                    value={field.fieldValue?.toString() || ""}
                    onChange={(e) => updateFieldValue(field.id, Number(e.target.value))}
                    placeholder="Number value"
                  />
                )}

                {field.fieldType === "date" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal mt-1", !field.fieldValue && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.fieldValue ? (
                          format(
                            typeof field.fieldValue === "string"
                              ? new Date(field.fieldValue)
                              : (field.fieldValue as Date),
                            "PPP"
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.fieldValue
                            ? typeof field.fieldValue === "string"
                              ? new Date(field.fieldValue)
                              : (field.fieldValue as Date)
                            : undefined
                        }
                        onSelect={(date) => updateFieldValue(field.id, date?.toISOString() || null)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                )}

                {field.fieldType === "file" && (
                  <div className="mt-1">
                    <Input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          // In a real app, you'd upload the file to a server
                          // and then store the URL
                          updateFieldValue(field.id, `file://${e.target.files[0].name}`);
                        }
                      }}
                    />
                    {field.fieldValue && (
                      <div className="text-sm mt-1 text-blue-600">
                        File: {typeof field.fieldValue === 'string' && field.fieldValue.split('/').pop()}
                      </div>
                    )}
                  </div>
                )}

                {field.fieldType === "dropdown" && (
                  <Select
                    value={Array.isArray(field.fieldValue) && field.fieldValue.length > 0 ? field.fieldValue[0] : ""}
                    onValueChange={(value) => updateFieldValue(field.id, [value])}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option, index) => (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCustomField(field.id)}
                className="mt-6"
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomFieldsSection;
