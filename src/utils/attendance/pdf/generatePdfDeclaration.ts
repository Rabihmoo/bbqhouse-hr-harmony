import { jsPDF } from "jspdf";
import { EmployeeReport } from "@/utils/attendance/types";
import { getFormattedSignatureDate } from "@/utils/attendance/declarationGenerator";

export const generateEmployeeDeclarationPdf = (
  employeeReport: EmployeeReport,
  month: string,
  year: string
): jsPDF => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Title
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(
    "DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS",
    105,
    12,
    { align: "center" }
  );

  // Declaration paragraph
  const declarationText = `Eu, ${employeeReport.employeeName}, portador(a) do documento de identificação ${employeeReport.biNumber} e funcionário(a) da empresa ${employeeReport.companyName}, venho por meio deste documento declarar o meu consentimento e aceitação para realizar horas extras de trabalho de acordo com as condições e termos estabelecidos pela legislação vigente e pela política interna da empresa. Entendo que a necessidade de laborar horas extras pode surgir devido a circunstâncias excepcionais e/ou necessidades operacionais da empresa. Estou ciente de que serei compensado(a) adequadamente pelas horas extras trabalhadas de acordo com as regras e regulamentos aplicáveis. A tabela a seguir detalha as horas extras a serem trabalhadas durante o mês de ${month} de ${year}:`;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(declarationText, 10, 20, { maxWidth: 190, align: "justify" });

  // Table headers
  const headers = ["Name", "Date", "Clock In", "Clock Out", "Work Time", "EXTRA HOURS"];
  const columnWidths = [45, 25, 25, 25, 30, 30];
  let x = 10;
  let y = 65;

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  headers.forEach((header, i) => {
    doc.rect(x, y, columnWidths[i], 8, "FD");
    doc.text(header, x + columnWidths[i] / 2, y + 5, { align: "center" });
    x += columnWidths[i];
  });

  // Table data rows
  y += 8;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");

  employeeReport.dailyData.forEach((row) => {
    x = 10;
    const isFolga = row.clockIn === "FOLGA";

    const rowData = [
      employeeReport.employeeName,
      row.date,
      row.clockIn,
      row.clockOut,
      row.totalHours,
      row.extraHours
    ];

    rowData.forEach((cell, i) => {
      const cellText =
        typeof cell === "number"
          ? (() => {
              const mins = Math.round(cell * 24 * 60);
              const h = Math.floor(mins / 60);
              const m = mins % 60;
              return `${h.toString().padStart(2, "0")}:${m
                .toString()
                .padStart(2, "0")}`;
            })()
          : String(cell);

      if (isFolga && i === 2) {
        doc.rect(x, y, columnWidths[2] + columnWidths[3], 6);
        doc.text("FOLGA", x + (columnWidths[2] + columnWidths[3]) / 2, y + 4, {
          align: "center"
        });
        x += columnWidths[2] + columnWidths[3];
        return;
      }

      if (isFolga && i === 3) return;

      doc.rect(x, y, columnWidths[i], 6);
      doc.text(cellText, x + columnWidths[i] / 2, y + 4, { align: "center" });
      x += columnWidths[i];
    });

    y += 6;
  });

  // Totals
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL WORKING HOURS", 10, y + 6);
  const totalHours = Math.floor(employeeReport.totalHours);
  const totalMinutes = Math.round((employeeReport.totalHours - totalHours) * 60);
  const formattedTotalTime = `${totalHours}:${totalMinutes.toString().padStart(2, "0")}`;
  doc.rect(130, y + 3, 30, 7);
  doc.text(formattedTotalTime, 145, y + 7, { align: "center" });

  doc.text("WORKING DAYS", 10, y + 14);
  doc.rect(130, y + 11, 30, 7);
  doc.text(`${employeeReport.workingDays}`, 145, y + 15, { align: "center" });

  // Confirmation block
  const confirmationText =
    "Ao assinar este documento, confirmo que estou ciente das datas e horários específicos em que as horas extras serão executadas e concordo em cumpri-las conforme indicado na tabela acima.";

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.rect(10, y + 20, 190, 14);
  doc.text(confirmationText, 12, y + 29, { maxWidth: 186, align: "justify" });

  // Signature lines
  doc.setFontSize(9);
  doc.rect(10, y + 38, 90, 8);
  doc.text("Assinatura do Funcionário: ______________________________", 12, y + 43);

  doc.rect(115, y + 38, 60, 8);
  doc.text(`Data: ${getFormattedSignatureDate()}`, 117, y + 43);

  return doc;
};
