
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SalaryStructureFieldsProps {
  formData: {
    salaryStructure: {
      basicSalary: string;
      transportAllowance: string;
      accommodationAllowance: string;
      bonus: string;
      totalSalary: string;
    };
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SalaryStructureFields = ({ formData, handleInputChange }: SalaryStructureFieldsProps) => {
  return (
    <div className="mt-6">
      <h4 className="font-medium mb-3">Salary Structure*</h4>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="basicSalary" className="mb-1">
              Basic Salary*
            </Label>
            <Input
              type="number"
              id="basicSalary"
              name="salaryStructure.basicSalary"
              value={formData.salaryStructure.basicSalary}
              onChange={handleInputChange}
              required
              placeholder="Enter basic salary amount"
            />
          </div>

          <div>
            <Label htmlFor="transportAllowance" className="mb-1">
              Transport Allowance*
            </Label>
            <Input
              type="number"
              id="transportAllowance"
              name="salaryStructure.transportAllowance"
              value={formData.salaryStructure.transportAllowance}
              onChange={handleInputChange}
              required
              placeholder="Enter transport allowance"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="accommodationAllowance" className="mb-1">
              Accommodation Allowance*
            </Label>
            <Input
              type="number"
              id="accommodationAllowance"
              name="salaryStructure.accommodationAllowance"
              value={formData.salaryStructure.accommodationAllowance}
              onChange={handleInputChange}
              required
              placeholder="Enter accommodation allowance"
            />
          </div>

          <div>
            <Label htmlFor="bonus" className="mb-1">
              Bonus*
            </Label>
            <Input
              type="number"
              id="bonus"
              name="salaryStructure.bonus"
              value={formData.salaryStructure.bonus}
              onChange={handleInputChange}
              required
              placeholder="Enter bonus amount"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="totalSalary" className="mb-1">
            Total Salary
          </Label>
          <Input
            type="number"
            id="totalSalary"
            name="salaryStructure.totalSalary"
            value={formData.salaryStructure.totalSalary}
            readOnly
            className="bg-muted"
          />
        </div>
      </div>
    </div>
  );
};

export default SalaryStructureFields;
