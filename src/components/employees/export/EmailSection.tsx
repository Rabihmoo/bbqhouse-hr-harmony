
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface EmailSectionProps {
  sendEmail: boolean;
  setSendEmail: (send: boolean) => void;
  emailAddress: string;
  setEmailAddress: (email: string) => void;
}

export function EmailSection({
  sendEmail,
  setSendEmail,
  emailAddress,
  setEmailAddress
}: EmailSectionProps) {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="sendEmail"
          checked={sendEmail}
          onCheckedChange={(checked) => setSendEmail(!!checked)}
        />
        <Label htmlFor="sendEmail">Send via email</Label>
      </div>

      {sendEmail && (
        <div className="space-y-2 pl-6">
          <Label htmlFor="emailAddress">Email Address</Label>
          <Input
            id="emailAddress"
            type="email"
            placeholder="Enter email address"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
        </div>
      )}
    </>
  );
}
