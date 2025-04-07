
import { format } from "date-fns";

export const formatDateToPortuguese = (date: Date): string => {
  try {
    const day = date.getDate();
    const months = [
      "janeiro", "fevereiro", "março", "abril",
      "maio", "junho", "julho", "agosto",
      "setembro", "outubro", "novembro", "dezembro"
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} de ${month} de ${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return format(new Date(), 'dd/MM/yyyy');
  }
};
