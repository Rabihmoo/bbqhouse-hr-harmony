
import { useState, useEffect } from "react";
import { format } from "date-fns";

interface EmployeeFormData {
  fullName: string;
  biNumber: string;
  biValidUntil: string;
  address: string;
  secondAddress: string;
  position: string;
  department: string;
  salary: string;
  healthCardValid: boolean;
  healthCardValidUntil: string;
  biValid: boolean;
  email: string;
  phone: string;
  hireDate: string;
  picture: string;
  inssNumber: string;
}

interface UseEmployeeFormProps {
  initialData?: any;
  isEditing?: boolean;
  open: boolean;
}

export const useEmployeeForm = ({ initialData = {}, isEditing = false, open }: UseEmployeeFormProps) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    fullName: "",
    biNumber: "",
    biValidUntil: "",
    address: "",
    secondAddress: "",
    position: "",
    department: "",
    salary: "",
    healthCardValid: false,
    healthCardValidUntil: "",
    biValid: false,
    email: "",
    phone: "",
    hireDate: "",
    picture: "",
    inssNumber: "",
  });

  useEffect(() => {
    if (open) {
      if (isEditing && initialData && Object.keys(initialData).length > 0) {
        setFormData({
          fullName: initialData.fullName || "",
          biNumber: initialData.biNumber || "",
          biValidUntil: initialData.biValidUntil || "",
          address: initialData.address || "",
          secondAddress: initialData.secondAddress || "",
          position: initialData.position || "",
          department: initialData.department || "",
          salary: initialData.salary ? String(initialData.salary) : "",
          healthCardValid: initialData.healthCardValid || false,
          healthCardValidUntil: initialData.healthCardValidUntil || "",
          biValid: initialData.biValid || false,
          email: initialData.email || "",
          phone: initialData.phone || "",
          hireDate: initialData.hireDate || "",
          picture: initialData.picture || "",
          inssNumber: initialData.inssNumber || "",
        });
      } else if (!isEditing) {
        // Reset form when adding new employee
        setFormData({
          fullName: "",
          biNumber: "",
          biValidUntil: "",
          address: "",
          secondAddress: "",
          position: "",
          department: "",
          salary: "",
          healthCardValid: false,
          healthCardValidUntil: "",
          biValid: false,
          email: "",
          phone: "",
          hireDate: "",
          picture: "",
          inssNumber: "",
        });
      }
    }
  }, [open, isEditing, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [name]: format(date, "yyyy-MM-dd"),
      }));
    }
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      picture: imageUrl,
    }));
  };

  return {
    formData,
    handleInputChange,
    handleSelectChange,
    handleSwitchChange,
    handleDateChange,
    handleImageChange,
  };
};
