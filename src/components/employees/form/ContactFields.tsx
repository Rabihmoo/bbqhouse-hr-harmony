
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ContactFieldsProps {
  formData: {
    email: string;
    phone: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ContactFields = ({ formData, handleInputChange }: ContactFieldsProps) => {
  return (
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
  );
};

export default ContactFields;
