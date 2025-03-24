
import { useState, useEffect } from "react";
import { format } from "date-fns";

export interface EmployeeFormData {
  fullName: string;
  biNumber: string;
  biValidUntil: string;
  biValid: boolean;
  biDetails: {
    issueDate: string;
    expiryDate: string;
  };
  address: string;
  secondAddress: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: string;
  salaryStructure: {
    basicSalary: string;
    transportAllowance: string;
    accommodationAllowance: string;
    bonus: string;
    totalSalary: string;
  };
  hireDate: string;
  healthCardValid: boolean;
  healthCardValidUntil: string;
  picture: string;
  inssNumber: string;
  company: "BBQHouse LDA" | "SALT LDA" | "Executive Cleaning LDA";
}

interface UseEmployeeFormStateProps {
  open: boolean;
  initialData: any | null;
  isEditing: boolean;
}

export const useEmployeeFormState = ({ open, initialData, isEditing }: UseEmployeeFormStateProps) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    fullName: "",
    biNumber: "",
    biValidUntil: "",
    biValid: false,
    biDetails: {
      issueDate: "",
      expiryDate: ""
    },
    address: "",
    secondAddress: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    salary: "",
    salaryStructure: {
      basicSalary: "",
      transportAllowance: "",
      accommodationAllowance: "",
      bonus: "",
      totalSalary: ""
    },
    hireDate: "",
    healthCardValid: false,
    healthCardValidUntil: "",
    picture: "",
    inssNumber: "",
    company: "BBQHouse LDA",
  });
  
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (open) {
      if (isEditing && initialData) {
        setFormData({
          fullName: initialData.fullName || "",
          biNumber: initialData.biNumber || "",
          biValidUntil: initialData.biValidUntil || "",
          biValid: initialData.biValid || false,
          biDetails: {
            issueDate: initialData.biDetails?.issueDate || "",
            expiryDate: initialData.biDetails?.expiryDate || initialData.biValidUntil || ""
          },
          address: initialData.address || "",
          secondAddress: initialData.secondAddress || "",
          email: initialData.email || "",
          phone: initialData.phone || "",
          position: initialData.position || "",
          department: initialData.department || "",
          salary: initialData.salary ? String(initialData.salary) : "",
          salaryStructure: {
            basicSalary: initialData.salaryStructure?.basicSalary ? String(initialData.salaryStructure.basicSalary) : "",
            transportAllowance: initialData.salaryStructure?.transportAllowance ? String(initialData.salaryStructure.transportAllowance) : "",
            accommodationAllowance: initialData.salaryStructure?.accommodationAllowance ? String(initialData.salaryStructure.accommodationAllowance) : "",
            bonus: initialData.salaryStructure?.bonus ? String(initialData.salaryStructure.bonus) : "",
            totalSalary: initialData.salaryStructure?.totalSalary ? String(initialData.salaryStructure.totalSalary) : ""
          },
          hireDate: initialData.hireDate || "",
          healthCardValid: initialData.healthCardValid || false,
          healthCardValidUntil: initialData.healthCardValidUntil || "",
          picture: initialData.picture || "",
          inssNumber: initialData.inssNumber || "",
          company: initialData.company || "BBQHouse LDA",
        });
        setIsDirty(false);
      } else {
        setFormData({
          fullName: "",
          biNumber: "",
          biValidUntil: "",
          biValid: false,
          biDetails: {
            issueDate: "",
            expiryDate: ""
          },
          address: "",
          secondAddress: "",
          email: "",
          phone: "",
          position: "",
          department: "",
          salary: "",
          salaryStructure: {
            basicSalary: "",
            transportAllowance: "",
            accommodationAllowance: "",
            bonus: "",
            totalSalary: ""
          },
          hireDate: "",
          healthCardValid: false,
          healthCardValidUntil: "",
          picture: "",
          inssNumber: "",
          company: "BBQHouse LDA",
        });
        setIsDirty(false);
      }
    }
  }, [open, isEditing, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Handle nested salary structure
    if (name.startsWith('salaryStructure.')) {
      const salaryField = name.split('.')[1];
      setFormData(prevState => ({
        ...prevState,
        salaryStructure: {
          ...prevState.salaryStructure,
          [salaryField]: value
        }
      }));

      // Calculate total salary if any of the salary components changes
      if (['basicSalary', 'transportAllowance', 'accommodationAllowance', 'bonus'].includes(salaryField)) {
        const basicSalary = Number(salaryField === 'basicSalary' ? value : formData.salaryStructure.basicSalary) || 0;
        const transportAllowance = Number(salaryField === 'transportAllowance' ? value : formData.salaryStructure.transportAllowance) || 0;
        const accommodationAllowance = Number(salaryField === 'accommodationAllowance' ? value : formData.salaryStructure.accommodationAllowance) || 0;
        const bonus = Number(salaryField === 'bonus' ? value : formData.salaryStructure.bonus) || 0;

        const totalSalary = basicSalary + transportAllowance + accommodationAllowance + bonus;

        setFormData(prevState => ({
          ...prevState,
          salaryStructure: {
            ...prevState.salaryStructure,
            totalSalary: String(totalSalary)
          },
          salary: String(totalSalary) // Update the legacy salary field too
        }));
      }
    } 
    // Handle nested BI details
    else if (name.startsWith('biDetails.')) {
      const biField = name.split('.')[1];
      setFormData(prevState => ({
        ...prevState,
        biDetails: {
          ...prevState.biDetails,
          [biField]: value
        },
        // Update biValidUntil for backward compatibility
        ...(biField === 'expiryDate' ? { biValidUntil: value } : {})
      }));
    } 
    else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
    
    setIsDirty(true);
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: checked,
    }));
    setIsDirty(true);
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData(prevState => ({
      ...prevState,
      picture: imageUrl,
    }));
    setIsDirty(true);
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }));
    setIsDirty(true);
  };

  const handleDateChange = (field: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');

    // Handle BI dates
    if (field === 'biDetails.issueDate') {
      setFormData(prevState => ({
        ...prevState,
        biDetails: {
          ...prevState.biDetails,
          issueDate: dateStr
        }
      }));
    } 
    else if (field === 'biDetails.expiryDate') {
      setFormData(prevState => ({
        ...prevState,
        biDetails: {
          ...prevState.biDetails,
          expiryDate: dateStr
        },
        biValidUntil: dateStr // For backward compatibility
      }));
    } 
    else {
      setFormData(prevState => ({
        ...prevState,
        [field]: dateStr,
      }));
    }
    
    setIsDirty(true);
  };

  const processFormData = () => {
    return {
      ...formData,
      salaryStructure: {
        basicSalary: Number(formData.salaryStructure.basicSalary),
        transportAllowance: Number(formData.salaryStructure.transportAllowance),
        accommodationAllowance: Number(formData.salaryStructure.accommodationAllowance),
        bonus: Number(formData.salaryStructure.bonus),
        totalSalary: Number(formData.salaryStructure.totalSalary)
      },
      salary: Number(formData.salaryStructure.totalSalary), // For backward compatibility
      id: initialData?.id || undefined,
    };
  };

  return {
    formData,
    isDirty,
    setIsDirty,
    handleInputChange,
    handleCheckboxChange,
    handleImageChange,
    handleSelectChange,
    handleDateChange,
    processFormData
  };
};
