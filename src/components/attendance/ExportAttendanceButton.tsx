import React from 'react';
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";

export const ExportAttendanceButton = () => {
  const handleDownload = () => {
    const doc = new jsPDF();

    doc.setFontSize(12);
    doc.text("TEST PDF DOWNLOAD", 20, 20);

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "test_export.pdf";
    a.click();
    URL.revokeObjectURL(url);

    console.log("✅ Download triggered");
  };

  return (
    <Button onClick={handleDownload}>
      Export PDF
    </Button>
  );
};
