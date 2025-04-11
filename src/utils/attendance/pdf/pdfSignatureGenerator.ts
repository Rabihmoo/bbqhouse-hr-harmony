
import { jsPDF } from "jspdf";

/**
 * Helper function to get the formatted signature date
 */
export function getFormattedSignatureDate(): string {
  const date = new Date();
  const day = date.getDate();
  const monthNames = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
                      "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} DE ${month} DE ${year}`;
}

/**
 * Adds the signature section to the PDF document
 */
export const addPdfSignature = (
  doc: jsPDF,
  startY: number
): void => {
  let y = startY + 20;
  
  // Add signature text
  // Use setFont instead of setFontStyle
  doc.setFont("helvetica", "normal");
  doc.text("Ao assinar este documento, confirmo que estou ciente das datas e horários específicos em que as horas extras serão executadas e concordo em cumpri-las conforme indicado na tabela acima.", 10, y, { maxWidth: 190 });
  
  // Add signature line
  y += 20;
  doc.text("Assinatura do Funcionário: _______________________________", 10, y);
  doc.text(`Data: ${getFormattedSignatureDate()}`, 150, y);
};
