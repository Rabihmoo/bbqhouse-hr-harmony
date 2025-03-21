
import React from "react";

interface AttendanceFileInputProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AttendanceFileInput = ({ fileInputRef, onChange }: AttendanceFileInputProps) => {
  return (
    <input
      type="file"
      ref={fileInputRef}
      onChange={onChange}
      accept=".csv,.xlsx,.xls"
      className="hidden"
    />
  );
};

export default AttendanceFileInput;
