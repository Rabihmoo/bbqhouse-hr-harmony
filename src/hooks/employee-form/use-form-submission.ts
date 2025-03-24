
import { useState } from "react";

export const useFormSubmission = (
  onSubmit: (data: any) => void,
  processFormData: () => any
) => {
  const [isDirty, setIsDirty] = useState(false);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const processed = processFormData();
    onSubmit(processed);
    setIsDirty(false);
  };

  return {
    isDirty,
    setIsDirty,
    handleSubmit
  };
};
