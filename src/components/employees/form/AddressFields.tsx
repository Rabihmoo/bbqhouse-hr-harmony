
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddressFieldsProps {
  formData: {
    address: string;
    secondAddress: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AddressFields = ({ formData, handleInputChange }: AddressFieldsProps) => {
  return (
    <>
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
    </>
  );
};

export default AddressFields;
