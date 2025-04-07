
/**
 * Utilities for handling file operations (MIME types, file conversions)
 */

/**
 * Get MIME type from file extension
 */
export const getMimeTypeFromExtension = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch(extension) {
    case 'pdf': 
      return 'application/pdf';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'doc':
      return 'application/msword';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'xls':
      return 'application/vnd.ms-excel';
    default:
      return 'application/octet-stream';
  }
};

/**
 * Create a downloadable blob from file data
 */
export const createDownloadableBlob = (fileData: ArrayBuffer, mimeType: string): Blob => {
  return new Blob([fileData], { type: mimeType });
};
