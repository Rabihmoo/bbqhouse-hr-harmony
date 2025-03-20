
import { useState } from "react";
import { Calendar, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { LeaveType, employees } from "@/lib/data";

interface LeaveRequestFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const LeaveRequestForm = ({ open, onClose, onSubmit }: LeaveRequestFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    employeeId: "",
    startDate: "",
    endDate: "",
    type: "" as LeaveType,
    reason: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, documentFile: selectedFile });
    onClose();
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md glass">
        <DialogHeader>
          <DialogTitle>New Leave Request</DialogTitle>
          <DialogDescription>
            Fill out the form below to submit a new leave request.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employeeId">Employee</Label>
              <Select
                value={formData.employeeId}
                onValueChange={(value) => handleSelectChange("employeeId", value)}
              >
                <SelectTrigger id="employeeId">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="startDate"
                    name="startDate"
                    type="date"
                    className="pl-10"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="endDate"
                    name="endDate"
                    type="date"
                    className="pl-10"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Leave Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value as LeaveType)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Annual">Annual Leave</SelectItem>
                  <SelectItem value="Sick">Sick Leave</SelectItem>
                  <SelectItem value="Unpaid">Unpaid Leave</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="Enter reason for leave"
                value={formData.reason}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="document">Upload Document (optional)</Label>
              <div className="border border-input bg-background rounded-md">
                {selectedFile ? (
                  <div className="flex items-center justify-between p-3">
                    <span className="text-sm truncate">
                      {selectedFile.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={clearFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="document"
                    className="flex flex-col items-center justify-center p-4 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Upload className="h-5 w-5 mb-2" />
                    <span className="text-sm">Click to upload</span>
                    <input
                      id="document"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRequestForm;
