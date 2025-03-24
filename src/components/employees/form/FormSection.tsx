
import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

const FormSection = ({ title, children }: FormSectionProps) => {
  return (
    <section>
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b">{title}</h3>
      {children}
    </section>
  );
};

export default FormSection;
