
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, File, FileText, FolderOpen } from "lucide-react";
import { companies } from "@/lib/data";

// Define checklist categories
const checklistCategories = [
  { id: "kitchen", name: "Kitchen Checklists" },
  { id: "bar", name: "Bar Checklists" },
  { id: "sala", name: "Sala Checklists" },
  { id: "manager", name: "Manager Checklists" },
  { id: "cleaning", name: "Cleaning Checklists" },
  { id: "weekly", name: "Weekly Checklists" },
  { id: "monthly", name: "Monthly Checklists" },
];

// Sample checklists for each company and category
const sampleChecklists = {
  "BBQHouse LDA": {
    kitchen: [
      { id: "bbq-k1", name: "Kitchen Opening Procedures", fileType: "PDF" },
      { id: "bbq-k2", name: "Kitchen Closing Procedures", fileType: "PDF" },
      { id: "bbq-k3", name: "Food Safety Standards", fileType: "PDF" },
    ],
    bar: [
      { id: "bbq-b1", name: "Bar Opening Checklist", fileType: "PDF" },
      { id: "bbq-b2", name: "Drink Inventory", fileType: "PDF" },
    ],
    sala: [
      { id: "bbq-s1", name: "Restaurant Floor Setup", fileType: "PDF" },
      { id: "bbq-s2", name: "Guest Service Standards", fileType: "PDF" },
    ],
    manager: [
      { id: "bbq-m1", name: "Manager Daily Tasks", fileType: "PDF" },
      { id: "bbq-m2", name: "Staff Evaluation Form", fileType: "PDF" },
    ],
    cleaning: [
      { id: "bbq-c1", name: "Daily Cleaning Schedule", fileType: "PDF" },
      { id: "bbq-c2", name: "Deep Cleaning Procedure", fileType: "PDF" },
    ],
    weekly: [
      { id: "bbq-w1", name: "Weekly Inventory", fileType: "PDF" },
      { id: "bbq-w2", name: "Weekly Staff Meeting Agenda", fileType: "PDF" },
    ],
    monthly: [
      { id: "bbq-mo1", name: "Monthly Equipment Maintenance", fileType: "PDF" },
      { id: "bbq-mo2", name: "Monthly Performance Review", fileType: "PDF" },
    ],
  },
  "SALT LDA": {
    kitchen: [
      { id: "salt-k1", name: "SALT Kitchen Standards", fileType: "PDF" },
      { id: "salt-k2", name: "Seafood Handling Guidelines", fileType: "PDF" },
    ],
    bar: [
      { id: "salt-b1", name: "Cocktail Preparation Guide", fileType: "PDF" },
      { id: "salt-b2", name: "Bar Inventory Template", fileType: "PDF" },
    ],
    sala: [
      { id: "salt-s1", name: "Fine Dining Service Standards", fileType: "PDF" },
      { id: "salt-s2", name: "Table Setting Guide", fileType: "PDF" },
    ],
    manager: [
      { id: "salt-m1", name: "Manager Responsibilities", fileType: "PDF" },
      { id: "salt-m2", name: "Conflict Resolution Protocol", fileType: "PDF" },
    ],
    cleaning: [
      { id: "salt-c1", name: "Fine Dining Cleaning Standards", fileType: "PDF" },
    ],
    weekly: [
      { id: "salt-w1", name: "Weekly Quality Control", fileType: "PDF" },
    ],
    monthly: [
      { id: "salt-mo1", name: "Monthly Budget Review", fileType: "PDF" },
    ],
  },
  "Executive Cleaning LDA": {
    kitchen: [
      { id: "ec-k1", name: "Kitchen Sanitation Guide", fileType: "PDF" },
    ],
    cleaning: [
      { id: "ec-c1", name: "Professional Cleaning Standards", fileType: "PDF" },
      { id: "ec-c2", name: "Chemical Safety Guidelines", fileType: "PDF" },
      { id: "ec-c3", name: "Equipment Maintenance Checklist", fileType: "PDF" },
    ],
    manager: [
      { id: "ec-m1", name: "Cleaning Team Management", fileType: "PDF" },
      { id: "ec-m2", name: "Quality Inspection Form", fileType: "PDF" },
    ],
    weekly: [
      { id: "ec-w1", name: "Weekly Cleaning Schedule Template", fileType: "PDF" },
    ],
    monthly: [
      { id: "ec-mo1", name: "Monthly Client Satisfaction Survey", fileType: "PDF" },
    ],
  }
};

const ChecklistItem = ({ checklist }: { checklist: { id: string; name: string; fileType: string } }) => {
  const handleDownload = () => {
    // In a real implementation, this would trigger an actual file download
    alert(`Downloading ${checklist.name}`);
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-md mb-2 bg-white dark:bg-black/20">
      <div className="flex items-center gap-3">
        <div className="bg-muted rounded-md p-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="text-left">
          <p className="font-medium">{checklist.name}</p>
          <p className="text-xs text-muted-foreground">{checklist.fileType}</p>
        </div>
      </div>
      <Button size="sm" variant="outline" onClick={handleDownload}>
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
    </div>
  );
};

const ChecklistsPage = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>(companies[0].name);
  const [selectedCategory, setSelectedCategory] = useState<string>("kitchen");

  const availableChecklists = sampleChecklists[selectedCompany as keyof typeof sampleChecklists]?.[selectedCategory as keyof typeof sampleChecklists[keyof typeof sampleChecklists]] || [];

  const handleUploadChecklist = () => {
    // In a real implementation, this would open a file upload dialog
    alert("Upload functionality would be implemented here");
  };

  return (
    <DashboardLayout
      title="Checklists"
      subtitle="Access and manage operational checklists for all companies"
    >
      <Tabs defaultValue={companies[0].name} onValueChange={setSelectedCompany}>
        <TabsList className="mb-6">
          {companies.map((company) => (
            <TabsTrigger key={company.id} value={company.name}>
              {company.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {companies.map((company) => (
          <TabsContent key={company.id} value={company.name} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{company.name} Checklists</h2>
              <Button onClick={handleUploadChecklist}>
                <File className="h-4 w-4 mr-2" />
                Upload New Checklist
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1">
                      {checklistCategories.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "ghost"}
                          className="w-full justify-start text-left"
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <FolderOpen className="h-4 w-4 mr-2" />
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>
                      {checklistCategories.find(cat => cat.id === selectedCategory)?.name || "Checklists"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {availableChecklists.length > 0 ? (
                      <div className="space-y-2">
                        {availableChecklists.map((checklist) => (
                          <ChecklistItem key={checklist.id} checklist={checklist} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                        <p className="mt-2 text-muted-foreground">No checklists found for this category</p>
                        <Button variant="outline" className="mt-4" onClick={handleUploadChecklist}>
                          Upload New Checklist
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </DashboardLayout>
  );
};

export default ChecklistsPage;
