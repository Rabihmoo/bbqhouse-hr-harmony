
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
  // Add signature text with smaller font
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8); // Reduced font size
  doc.text("Ao assinar este documento, confirmo que estou ciente das datas e horários específicos em que as horas extras serão executadas e concordo em cumpri-las conforme indicado na tabela acima.", 10, y, { maxWidth: 190 });
  
  // Add signature line with less vertical spacing
  y += 10; // Reduced from 20
  doc.text("Assinatura do Funcionário: _______________________________", 10, y);
  doc.text(`Data: ${getFormattedSignatureDate()}`, 150, y);
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
