
import { useState, useEffect } from "react";
import { Notification } from "@/types/notification";
import { useAnniversaryNotifications } from "./use-anniversary-notifications";
import { useDocumentNotifications } from "./use-document-notifications";
import { useLeaveNotifications } from "./use-leave-notifications";
import { useMissingInfoNotifications } from "./use-missing-info-notifications";

export const useEmployeeNotifications = (employees: any[]) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Import all specialized notification generators
  const { generateAnniversaryNotifications } = useAnniversaryNotifications();
  const { generateDocumentNotifications } = useDocumentNotifications();
  const { generateLeaveNotifications } = useLeaveNotifications();
  const { generateMissingInfoNotifications } = useMissingInfoNotifications();

  // Generate notifications based on employee data
  useEffect(() => {
    if (!employees || employees.length === 0) {
      setNotifications([]);
      return;
    }

    // Collect notifications from all generators
    const anniversaryNotifications = generateAnniversaryNotifications(employees);
    const documentNotifications = generateDocumentNotifications(employees);
    const leaveNotifications = generateLeaveNotifications(employees);
    const missingInfoNotifications = generateMissingInfoNotifications(employees);

    // Combine all notification types
    const allNotifications = [
      ...anniversaryNotifications,
      ...documentNotifications,
      ...leaveNotifications,
      ...missingInfoNotifications,
    ];
    
    setNotifications(allNotifications);
  }, [employees]);

  return { notifications };
};
