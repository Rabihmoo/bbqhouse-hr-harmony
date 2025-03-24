
import { useState, useEffect } from "react";

export interface EmployeeBasicInfo {
  fullName: string;
  address: string;
  secondAddress: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  inssNumber: string;
  company: "BBQHouse LDA" | "SALT LDA" | "Executive Cleaning LDA";
  picture: string;
}

export const useEmployeeBasicInfo = (
  open: boolean,
  isEditing: boolean,
  initialData: any | null
) => {
  const [basicInfo, setBasicInfo] = useState<EmployeeBasicInfo>({
    fullName: "",
    address: "",
    secondAddress: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    hireDate: "",
    inssNumber: "",
    company: "BBQHouse LDA",
    picture: "",
  });

  useEffect(() => {
    if (open) {
      if (isEditing && initialData) {
        setBasicInfo({
          fullName: initialData.fullName || "",
          address: initialData.address || "",
          secondAddress: initialData.secondAddress || "",
          email: initialData.email || "",
          phone: initialData.phone || "",
          position: initialData.position || "",
          department: initialData.department || "",
          hireDate: initialData.hireDate || "",
          inssNumber: initialData.inssNumber || "",
          company: initialData.company || "BBQHouse LDA",
          picture: initialData.picture || "",
        });
      } else {
        setBasicInfo({
          fullName: "",
          address: "",
          secondAddress: "",
          email: "",
          phone: "",
          position: "",
          department: "",
          hireDate: "",
          inssNumber: "",
          company: "BBQHouse LDA",
          picture: "",
        });
      }
    }
  }, [open, isEditing, initialData]);

  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBasicInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setBasicInfo((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleImageChange = (imageUrl: string) => {
    setBasicInfo((prevState) => ({
      ...prevState,
      picture: imageUrl,
    }));
  };

  return {
    basicInfo,
    handleBasicInfoChange,
    handleSelectChange,
    handleImageChange,
    setBasicInfo,
  };
};
