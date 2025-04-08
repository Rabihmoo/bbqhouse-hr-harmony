
import { toast } from "sonner";
import { sendEmailNotification } from "@/utils/notificationService";

export const sendEmailVia = async (
  type: 'employee' | 'leave',
  data: any
): Promise<void> => {
  try {
    await sendEmailNotification(type, data);
    console.log("Email sent successfully:", data.to);
    toast.success(`Email sent to ${data.to}`);
  } catch (error) {
    console.error("Failed to send email:", error);
    toast.error("Email delivery failed");
    throw new Error("Email delivery failed");
  }
};
