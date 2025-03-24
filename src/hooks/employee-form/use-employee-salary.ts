
import { useState, useEffect } from "react";

export interface SalaryStructure {
  salary: string;
  salaryStructure: {
    basicSalary: string;
    transportAllowance: string;
    accommodationAllowance: string;
    bonus: string;
    totalSalary: string;
  };
}

export const useEmployeeSalary = (
  open: boolean,
  isEditing: boolean,
  initialData: any | null
) => {
  const [salaryInfo, setSalaryInfo] = useState<SalaryStructure>({
    salary: "",
    salaryStructure: {
      basicSalary: "",
      transportAllowance: "",
      accommodationAllowance: "",
      bonus: "",
      totalSalary: ""
    }
  });

  useEffect(() => {
    if (open) {
      if (isEditing && initialData) {
        setSalaryInfo({
          salary: initialData.salary ? String(initialData.salary) : "",
          salaryStructure: {
            basicSalary: initialData.salaryStructure?.basicSalary ? String(initialData.salaryStructure.basicSalary) : "",
            transportAllowance: initialData.salaryStructure?.transportAllowance ? String(initialData.salaryStructure.transportAllowance) : "",
            accommodationAllowance: initialData.salaryStructure?.accommodationAllowance ? String(initialData.salaryStructure.accommodationAllowance) : "",
            bonus: initialData.salaryStructure?.bonus ? String(initialData.salaryStructure.bonus) : "",
            totalSalary: initialData.salaryStructure?.totalSalary ? String(initialData.salaryStructure.totalSalary) : ""
          }
        });
      } else {
        setSalaryInfo({
          salary: "",
          salaryStructure: {
            basicSalary: "",
            transportAllowance: "",
            accommodationAllowance: "",
            bonus: "",
            totalSalary: ""
          }
        });
      }
    }
  }, [open, isEditing, initialData]);

  const handleSalaryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Handle nested salary structure
    if (name.startsWith('salaryStructure.')) {
      const salaryField = name.split('.')[1];
      
      setSalaryInfo((prevState) => ({
        ...prevState,
        salaryStructure: {
          ...prevState.salaryStructure,
          [salaryField]: value
        }
      }));

      // Calculate total salary if any of the salary components changes
      if (['basicSalary', 'transportAllowance', 'accommodationAllowance', 'bonus'].includes(salaryField)) {
        calculateTotalSalary(salaryField, value);
      }
    } else {
      setSalaryInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const calculateTotalSalary = (changedField: string, newValue: string) => {
    const basicSalary = Number(changedField === 'basicSalary' ? newValue : salaryInfo.salaryStructure.basicSalary) || 0;
    const transportAllowance = Number(changedField === 'transportAllowance' ? newValue : salaryInfo.salaryStructure.transportAllowance) || 0;
    const accommodationAllowance = Number(changedField === 'accommodationAllowance' ? newValue : salaryInfo.salaryStructure.accommodationAllowance) || 0;
    const bonus = Number(changedField === 'bonus' ? newValue : salaryInfo.salaryStructure.bonus) || 0;

    const totalSalary = basicSalary + transportAllowance + accommodationAllowance + bonus;

    setSalaryInfo((prevState) => ({
      ...prevState,
      salaryStructure: {
        ...prevState.salaryStructure,
        totalSalary: String(totalSalary)
      },
      salary: String(totalSalary) // Update the legacy salary field too
    }));
  };

  const processSalaryData = () => {
    return {
      salary: Number(salaryInfo.salaryStructure.totalSalary),
      salaryStructure: {
        basicSalary: Number(salaryInfo.salaryStructure.basicSalary),
        transportAllowance: Number(salaryInfo.salaryStructure.transportAllowance),
        accommodationAllowance: Number(salaryInfo.salaryStructure.accommodationAllowance),
        bonus: Number(salaryInfo.salaryStructure.bonus),
        totalSalary: Number(salaryInfo.salaryStructure.totalSalary)
      }
    };
  };

  return {
    salaryInfo,
    handleSalaryChange,
    processSalaryData,
    setSalaryInfo
  };
};
