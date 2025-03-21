
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface FormActionsProps {
  isEditing: boolean;
  onCancel: () => void;
}

const FormActions = ({ isEditing, onCancel }: FormActionsProps) => {
  return (
    <DialogFooter className="mt-6 flex gap-2 pt-2">
      <Button variant="outline" type="button" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {isEditing ? "Save Changes" : "Add Employee"}
      </Button>
    </DialogFooter>
  );
};

export default FormActions;
