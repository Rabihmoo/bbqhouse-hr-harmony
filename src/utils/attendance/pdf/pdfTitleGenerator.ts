
import { jsPDF } from "jspdf";

/**
 * Adds the title and declaration text to the PDF document
 */
export const addPdfTitleAndDeclaration = (
  doc: jsPDF,
  declarationText: string
): void => {
  // Set title
  doc.setFontSize(14);
  doc.text("DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS", 105, 15, { align: "center" });
  
  // Set declaration text
  doc.setFontSize(10);
  doc.text(declarationText.replace("DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS\n\n", ""), 10, 30, { 
    maxWidth: 190, 
    align: "left"
  });
};
