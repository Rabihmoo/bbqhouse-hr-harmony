
import { ChangeEvent } from "react";

// This hook provides utility functions for form operations
export const useFormUtilities = () => {
  // Generic handler for other form fields
  const createHandleInputChange = (
    setter: (updater: (prev: any) => any) => void,
    callback?: () => void
  ) => {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setter((prevState: any) => ({
        ...prevState,
        [name]: value,
      }));
      if (callback) callback();
    };
  };

  // Handle checkbox/switch changes
  const createHandleCheckboxChange = (
    setter: (updater: (prev: any) => any) => void,
    callback?: () => void
  ) => {
    return (name: string, checked: boolean) => {
      setter((prevState: any) => ({
        ...prevState,
        [name]: checked,
      }));
      if (callback) callback();
    };
  };

  // Handle date changes
  const createHandleDateChange = (
    setter: (updater: (prev: any) => any) => void,
    dateFieldName: string,
    callback?: () => void
  ) => {
    return (date: Date | undefined) => {
      if (!date) return;
      setter((prevState: any) => ({
        ...prevState,
        [dateFieldName]: date,
      }));
      if (callback) callback();
    };
  };

  return {
    createHandleInputChange,
    createHandleCheckboxChange,
    createHandleDateChange,
  };
};
