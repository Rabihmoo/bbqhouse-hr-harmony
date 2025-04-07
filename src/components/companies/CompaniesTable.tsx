
import { useState } from "react";
import { Company } from "@/types/company";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Pencil, Trash2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CompaniesTableProps {
  companies: Company[];
  onView: (company: Company) => void;
  onEdit: (company: Company) => void;
  onDelete: (companyId: string) => void;
}

const CompaniesTable: React.FC<CompaniesTableProps> = ({
  companies,
  onView,
  onEdit,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.nuit.includes(searchTerm)
  );

  const handleDelete = (company: Company) => {
    setCompanyToDelete(company);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (companyToDelete) {
      onDelete(companyToDelete.id);
    }
    setDeleteDialogOpen(false);
    setCompanyToDelete(null);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'} found
          </div>
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No companies found</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Company Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>NUIT</TableHead>
                  <TableHead>Sections</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.address}</TableCell>
                    <TableCell>{company.nuit}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {company.sections.map((section) => (
                          <span key={section} className="bg-blue-100 text-blue-800 text-xs font-medium mr-1 px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                            {section}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onView(company)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(company)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(company)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the company "{companyToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default CompaniesTable;
