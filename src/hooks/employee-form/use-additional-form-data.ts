
import { useState, useEffect } from "react";

export interface OtherFormData {
  id?: string;
  email: string;
  phone: string;
  address: string;
  secondAddress: string;
  picture: string;
  company: string;
  leaveAllowances: any[];
  leaveRecords: any[];
}

export const useAdditionalFormData = (
  open: boolean,
  isEditing: boolean,
  initialData: any | null
) => {
  const [otherFormData, setOtherFormData] = useState<OtherFormData>({
    email: "",
    phone: "",
    address: "",
    secondAddress: "",
    picture: "",
    company: "BBQHouse LDA",
    leaveAllowances: [],
    leaveRecords: [],
  });

  useEffect(() => {
    if (open) {
      if (isEditing && initialData) {
        setOtherFormData({
          id: initialData.id,
          email: initialData.email || "",
          phone: initialData.phone || "",
          address: initialData.address || "",
          secondAddress: initialData.secondAddress || "",
          picture: initialData.picture || "",
          company: initialData.company || "BBQHouse LDA",
          leaveAllowances: initialData.leaveAllowances || [],
          leaveRecords: initialData.leaveRecords || [],
        });
      } else {
        setOtherFormData({
          email: "",
          phone: "",
          address: "",
          secondAddress: "",
          picture: "",
          company: "BBQHouse LDA",
          leaveAllowances: [],
          leaveRecords: [],
        });
      }
    }
  }, [open, isEditing, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOtherFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return {
    otherFormData,
    handleInputChange,
    setOtherFormData,
  };
};
