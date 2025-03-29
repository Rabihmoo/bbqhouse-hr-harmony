
/**
 * Utility functions for generating and downloading contract documents
 */

/**
 * Creates a Word document XML string for the given contract data
 */
export const createWordDocument = (contract: any): string => {
  // Create properly formatted content for Word document
  // This is a simple XML representation of a Word document
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<?mso-application progid="Word.Document"?>
<w:wordDocument xmlns:w="http://schemas.microsoft.com/office/word/2003/wordml">
  <w:body>
    <w:p><w:r><w:t>EMPLOYMENT CONTRACT</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:t>Employee: ${contract.employeeName}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Position: ${contract.position}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Company: ${contract.company}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Start Date: ${contract.startDate}</w:t></w:r></w:p>
    <w:p><w:r><w:t>BI Number: ${contract.employeeInfo.biNumber || "N/A"}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Address: ${contract.employeeInfo.address || "N/A"}</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:t>Base Salary: 8,900.00 MT</w:t></w:r></w:p>
    <w:p><w:r><w:t>Transport Allowance: ${contract.employeeInfo.transportAllowance || 0} MT</w:t></w:r></w:p>
    <w:p><w:r><w:t>Bonus: ${contract.employeeInfo.bonus || 0} MT</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:t>Notes: ${contract.notes || "N/A"}</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:t>Signature Date: ${contract.signatureDate}</w:t></w:r></w:p>
  </w:body>
</w:wordDocument>`;
};

/**
 * Downloads a contract as a Word document
 */
export const downloadContract = (contract: any) => {
  const wordXmlContent = createWordDocument(contract);
  
  // Create a blob with Word document MIME type
  const blob = new Blob([wordXmlContent], { type: 'application/vnd.ms-word' });
  
  // Create a link to download the blob
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Contract_${contract.employeeName.replace(/ /g, '_')}.doc`);
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  URL.revokeObjectURL(url);
  document.body.removeChild(link);
};
