
import { useState } from "react";
import { Company, CustomField } from "@/types/company";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { MultiSelect } from "@/components/ui/multi-select";
import { Plus, X } from "lucide-react";
import CustomFieldsSection from "./CustomFieldsSection";
import DocumentsUploader from "./DocumentsUploader";

interface CompanyFormProps {
  company?: Company;
  onSubmit: (company: Company) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const sections = [
  "Kitchen",
  "Sala",
  "Bar",
  "Admin",
  "Cleaning",
  "Takeaway",
  "Accounting",
  "HR",
  "Management"
];

const CompanyForm: React.FC<CompanyFormProps> = ({
  company,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [name, setName] = useState(company?.name || "");
  const [address, setAddress] = useState(company?.address || "");
  const [nuit, setNuit] = useState(company?.nuit || "");
  const [selectedSections, setSelectedSections] = useState<string[]>(company?.sections || []);
  const [documents, setDocuments] = useState(company?.documents || []);
  const [customFields, setCustomFields] = useState<CustomField[]>(company?.customFields || []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error("Company name is required");
      return;
    }

    const companyData: Company = {
      id: company?.id || uuidv4(),
      name,
      address,
      nuit,
      sections: selectedSections,
      documents,
      customFields
    };

    onSubmit(companyData);
    
    // Show success message
    toast.success(
      isEditing ? "Company updated successfully" : "Company added successfully"
    );
  };

  const addDocument = (doc: { name: string; type: string; url: string }) => {
    const newDoc = {
      id: uuidv4(),
      name: doc.name,
      type: doc.type,
      url: doc.url,
      uploadDate: new Date().toISOString()
    };
    setDocuments([...documents, newDoc]);
  };

  const removeDocument = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold">
            {isEditing ? "Edit Company" : "Add New Company"}
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Company Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Company Name"
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Company Address"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="nuit">NUIT (Tax Number)</Label>
              <Input
                id="nuit"
                value={nuit}
                onChange={(e) => setNuit(e.target.value)}
                placeholder="NUIT (Tax Number)"
              />
            </div>

            <div>
              <Label>Sections</Label>
              <MultiSelect
                options={sections.map(section => ({ label: section, value: section }))}
                selected={selectedSections}
                onChange={setSelectedSections}
                placeholder="Select sections..."
              />
            </div>

            <div>
              <Label>Company Documents</Label>
              <DocumentsUploader 
                documents={documents}
                onAddDocument={addDocument}
                onRemoveDocument={removeDocument}
              />
            </div>

            <CustomFieldsSection
              customFields={customFields}
              setCustomFields={setCustomFields}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Update" : "Create"} Company</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompanyForm;
