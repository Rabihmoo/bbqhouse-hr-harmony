
import { Company } from "@/types/company";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Edit, FileText, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface CompanyProfileProps {
  company: Company;
  onEdit: () => void;
  onDelete: () => void;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({
  company,
  onEdit,
  onDelete
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <div className="bg-primary/10 p-3 rounded-lg mr-4">
              <Building className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{company.name}</h2>
              <p className="text-muted-foreground">NUIT: {company.nuit || "Not provided"}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={onEdit} variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" /> Edit
            </Button>
            <Button onClick={onDelete} variant="destructive" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Basic Information</h3>
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p>{company.address || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">NUIT</p>
                  <p>{company.nuit || "Not provided"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Sections</h3>
              <div className="flex flex-wrap gap-2">
                {company.sections.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No sections assigned</p>
                ) : (
                  company.sections.map((section) => (
                    <span
                      key={section}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded dark:bg-blue-900 dark:text-blue-300"
                    >
                      {section}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Custom Fields</h3>
              {company.customFields.length === 0 ? (
                <p className="text-sm text-muted-foreground">No custom fields added</p>
              ) : (
                <div className="bg-muted rounded-lg p-4 space-y-3">
                  {company.customFields.map((field) => (
                    <div key={field.id}>
                      <p className="text-sm text-muted-foreground">{field.fieldName}</p>
                      {field.fieldType === 'date' && typeof field.fieldValue === 'string' ? (
                        <p>{new Date(field.fieldValue).toLocaleDateString()}</p>
                      ) : field.fieldType === 'file' ? (
                        <a 
                          href={String(field.fieldValue)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <FileText className="h-4 w-4" />
                          View File
                        </a>
                      ) : field.fieldType === 'dropdown' && Array.isArray(field.fieldValue) ? (
                        <div className="flex flex-wrap gap-1">
                          {field.fieldValue.map((value, i) => (
                            <span 
                              key={i}
                              className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded"
                            >
                              {value}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p>{String(field.fieldValue || 'Not provided')}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Documents</h3>
            {company.documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No documents uploaded</p>
            ) : (
              <div className="bg-muted rounded-lg p-4 space-y-2">
                {company.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-2 border-b last:border-0">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded on {format(new Date(doc.uploadDate), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <a 
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyProfile;
