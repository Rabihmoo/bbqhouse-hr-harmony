
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
  company: string;
  picture: string;
  status?: string; // Adding status here to ensure it's included in the state
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
    status: "Active", // Default status
  });

  useEffect(() => {
    if (open) {
      if (isEditing && initialData) {
        console.log("Setting initial data in basicInfo:", initialData);
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
          status: initialData.status || "Active", // Make sure status is included
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
          status: "Active",
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
    console.log(`Setting ${field} to:`, value);
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
