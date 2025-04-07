
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ContractNotesProps {
  notes: string;
  setNotes: (notes: string) => void;
}

const ContractNotes: React.FC<ContractNotesProps> = ({ notes, setNotes }) => {
  return (
    <div>
      <Label htmlFor="notes">Additional Notes</Label>
      <Textarea
        id="notes"
        placeholder="Any special clauses or notes for this contract"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
  );
};

export default ContractNotes;
