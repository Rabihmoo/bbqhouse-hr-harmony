
import { jsPDF } from "jspdf";

/**
 * Adds the title to the PDF document
 */
export const addTitle = (doc: jsPDF): void => {
  doc.setFontSize(12); // Reduced from 14 to save space
  doc.text("DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS", 105, 12, { align: "center" });
};

/**
 * Adds the declaration text to the PDF document
 */
export const addDeclarationText = (doc: jsPDF, declarationText: string): void => {
  // Further reduce font size to 8 for the declaration text
  doc.setFontSize(8);
  
  // Center the declaration text as a whole block
  doc.text(declarationText, 105, 25, { 
    maxWidth: 180, // Increased max width to use more page space
    align: "center"
  });
};

/**
 * Adds the signature section at the bottom of the PDF
 */
export const addSignatureSection = (doc: jsPDF, y: number): void => {
  const columnWidths = [45, 25, 25, 25, 30, 30];
  const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);
  
  // Add signature text in a merged cell spanning the full width
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  
  // Create rectangle for the signature confirmation text
  doc.rect(10, y, totalWidth, 10);
  
  // Add confirmation text inside the merged cell with text wrapping
  doc.text(
    "Ao assinar este documento, confirmo que estou ciente das datas e horários específicos em que as horas extras serão executadas e concordo em cumpri-las conforme indicado na tabela acima.",
    10 + totalWidth / 2, 
    y + 5, 
    { 
      align: "center",
      maxWidth: totalWidth - 10
    }
  );
  
  // Move down for signature line
  y += 10;
  
  // Create merged cell for signature (columns A to C)
  const signatureWidth = columnWidths[0] + columnWidths[1] + columnWidths[2];
  doc.rect(10, y, signatureWidth, 8);
  doc.text("Assinatura do Funcionário: _______________________________", 10 + signatureWidth / 2, y + 4, { align: "center" });
  
  // Create merged cell for date (columns E to F)
  const dateWidth = columnWidths[4] + columnWidths[5];
  const dateX = 10 + signatureWidth + columnWidths[3];
  doc.rect(dateX, y, dateWidth, 8);
  doc.text(`Data: ${getFormattedSignatureDate()}`, dateX + dateWidth / 2, y + 4, { align: "center" });
};

/**
 * Gets the formatted date for the signature section
 */
export const getFormattedSignatureDate = (): string => {
  const date = new Date();
  const day = date.getDate();
  const monthNames = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
                      "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} DE ${month} DE ${year}`;
};

/**
 * Creates a new PDF document with A4 portrait format
 */
export const createPdfDocument = (): jsPDF => {
  return new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
};
