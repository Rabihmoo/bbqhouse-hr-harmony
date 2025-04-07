
import { useState, useEffect } from "react";
import { useEmployeeBasicOperations } from "./use-employee-basic-operations";
import { useEmployeeLeaveOperations } from "./use-employee-leave-operations";
import { useEmployeeDocumentOperations } from "./use-employee-document-operations";
import { useEmployeeAnalytics } from "./use-employee-analytics";
import { useEmployeeStorage } from "./use-employee-storage";

export const useEmployeeOperations = (
  employees: any[],
  setEmployees: React.Dispatch<React.SetStateAction<any[]>>,
  LOCAL_STORAGE_KEY: string
) => {
  // Initialize storage hooks
  const { loadEmployeesFromStorage, saveEmployeesToLocalStorage, setupStorageListener } = useEmployeeStorage(LOCAL_STORAGE_KEY);

  // Initialize specialized hooks
  const {
    showAddForm,
    setShowAddForm,
    editingEmployee,
    setEditingEmployee,
    handleAddEmployee,
    handleEditEmployee,
    handleRowClick,
    filterEmployeesByCompany,
  } = useEmployeeBasicOperations(employees, setEmployees, saveEmployeesToLocalStorage);

  const { handleAddLeaveRecord } = useEmployeeLeaveOperations(employees, setEmployees, saveEmployeesToLocalStorage);
  const { checkMissingDocuments } = useEmployeeDocumentOperations();
  const { checkEmployeeAnniversaries, getEmployeesByDepartment } = useEmployeeAnalytics();

  // Load employees from local storage when component mounts
  useEffect(() => {
    const storedEmployees = loadEmployeesFromStorage();
    if (storedEmployees.length > 0) {
      setEmployees(storedEmployees);
    }
  }, [LOCAL_STORAGE_KEY, setEmployees]);

  // Set up storage change listener
  useEffect(() => {
    return setupStorageListener(setEmployees);
  }, [LOCAL_STORAGE_KEY, setEmployees]);

  return {
    // Export all the operations
    showAddForm,
    setShowAddForm,
    editingEmployee,
    setEditingEmployee,
    handleAddEmployee,
    handleEditEmployee,
    handleRowClick,
    handleAddLeaveRecord,
    checkEmployeeAnniversaries,
    checkMissingDocuments,
    getEmployeesByDepartment,
    filterEmployeesByCompany,
  };
};
