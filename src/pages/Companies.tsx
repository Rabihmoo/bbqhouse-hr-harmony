
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CompaniesTable from "@/components/companies/CompaniesTable";
import CompanyForm from "@/components/companies/CompanyForm";
import CompanyProfile from "@/components/companies/CompanyProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompanyData } from "@/hooks/use-company-data";
import { Company } from "@/types/company";

const Companies = ({ onLogout }: { onLogout?: () => void }) => {
  const [activeTab, setActiveTab] = useState("list");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  
  const { 
    companies, 
    addCompany, 
    updateCompany, 
    deleteCompany 
  } = useCompanyData();

  const handleAddCompany = (companyData: Company) => {
    addCompany(companyData);
    setShowAddForm(false);
    setActiveTab("list");
  };

  const handleUpdateCompany = (companyData: Company) => {
    updateCompany(companyData);
    setSelectedCompany(null);
    setActiveTab("list");
  };

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    setActiveTab("view");
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setActiveTab("edit");
  };

  const handleDeleteCompany = (companyId: string) => {
    deleteCompany(companyId);
    if (selectedCompany?.id === companyId) {
      setSelectedCompany(null);
      setActiveTab("list");
    }
  };

  return (
    <DashboardLayout
      title="Companies"
      subtitle="Manage company records and information"
      onLogout={onLogout}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Building className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Companies Management</h1>
          </div>
          <Button 
            onClick={() => {
              setSelectedCompany(null);
              setShowAddForm(true);
              setActiveTab("add");
            }} 
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Company
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="list">
              <Building className="h-4 w-4 mr-2" />
              Companies List
            </TabsTrigger>
            {showAddForm && (
              <TabsTrigger value="add">
                <Plus className="h-4 w-4 mr-2" />
                Add Company
              </TabsTrigger>
            )}
            {selectedCompany && (
              <TabsTrigger value="view">
                <FileText className="h-4 w-4 mr-2" />
                Company Profile
              </TabsTrigger>
            )}
            {selectedCompany && (
              <TabsTrigger value="edit">
                <FileText className="h-4 w-4 mr-2" />
                Edit Company
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="list">
            <CompaniesTable 
              companies={companies} 
              onView={handleViewCompany} 
              onEdit={handleEditCompany} 
              onDelete={handleDeleteCompany}
            />
          </TabsContent>

          <TabsContent value="add">
            <CompanyForm onSubmit={handleAddCompany} onCancel={() => {
              setShowAddForm(false);
              setActiveTab("list");
            }} />
          </TabsContent>

          <TabsContent value="view">
            {selectedCompany && (
              <CompanyProfile 
                company={selectedCompany} 
                onEdit={() => setActiveTab("edit")}
                onDelete={() => {
                  handleDeleteCompany(selectedCompany.id);
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="edit">
            {selectedCompany && (
              <CompanyForm 
                company={selectedCompany} 
                onSubmit={handleUpdateCompany} 
                onCancel={() => {
                  setActiveTab(selectedCompany ? "view" : "list");
                }}
                isEditing
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Companies;
