
import { useState, useEffect } from "react";

export const useEmployeeStorage = (LOCAL_STORAGE_KEY: string) => {
  const loadEmployeesFromStorage = () => {
    try {
      const storedEmployees = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedEmployees) {
        return JSON.parse(storedEmployees);
      }
    } catch (error) {
      console.error("Error parsing stored employees:", error);
    }
    return [];
  };

  const saveEmployeesToLocalStorage = (updatedEmployees: any[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedEmployees));
    window.dispatchEvent(new Event('storage'));
  };

  const setupStorageListener = (setEmployees: React.Dispatch<React.SetStateAction<any[]>>) => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOCAL_STORAGE_KEY && event.newValue) {
        try {
          const parsedEmployees = JSON.parse(event.newValue);
          setEmployees(parsedEmployees);
        } catch (error) {
          console.error("Error parsing stored employees from storage event:", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  };

  return {
    loadEmployeesFromStorage,
    saveEmployeesToLocalStorage,
    setupStorageListener
  };
};
