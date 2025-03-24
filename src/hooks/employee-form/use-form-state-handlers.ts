
import { useState, ChangeEvent } from "react";
import { useFormUtilities } from "./use-form-utilities";

export const useFormStateHandlers = (
  setIsDirty: (isDirty: boolean) => void,
  handleBasicInfoChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void,
  handleBIInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  handleBICheckboxChange: (name: string, checked: boolean) => void,
  handleBIDateChange: (field: string, date: Date | undefined) => void,
  handleSalaryChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  handleSelectChange: (name: string, value: string) => void,
  handleImageChange: (imageUrl: string) => void,
  handleDocumentSwitchChange: (name: string, checked: boolean) => void,
  handleDocumentDateChange: (field: string, date: Date | undefined) => void,
  handleOtherInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void,
  processSalaryData: () => any
) => {
  // Wrapper methods to ensure all changes mark the form as dirty
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    handleOtherInputChange(e);
    setIsDirty(true);
  };

  const handleBasicInfoInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    handleBasicInfoChange(e);
    setIsDirty(true);
  };

  const handleSelectInputChange = (name: string, value: string) => {
    handleSelectChange(name, value);
    setIsDirty(true);
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    if (name.startsWith('bi')) {
      handleBICheckboxChange(name, checked);
    } else {
      handleDocumentSwitchChange(name, checked);
    }
    setIsDirty(true);
  };

  const handleDateChange = (field: string, date: Date | undefined) => {
    if (field.startsWith('biDetails.')) {
      handleBIDateChange(field, date);
    } else {
      handleDocumentDateChange(field, date);
    }
    setIsDirty(true);
  };

  const handleSalaryInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleSalaryChange(e);
    setIsDirty(true);
  };

  const handleImageUploadChange = (imageUrl: string) => {
    handleImageChange(imageUrl);
    setIsDirty(true);
  };

  // Calculate total salary for the form
  const calculateTotalSalary = () => {
    processSalaryData();
    setIsDirty(true);
  };

  return {
    handleInputChange,
    handleBasicInfoChange: handleBasicInfoInputChange,
    handleSelectChange: handleSelectInputChange,
    handleImageChange: handleImageUploadChange,
    handleSalaryChange: handleSalaryInputChange,
    handleCheckboxChange,
    handleDateChange,
    calculateTotalSalary
  };
};
