
import React from "react";

interface DepartmentSummaryProps {
  departmentCounts: { [key: string]: number };
}

const DepartmentSummary: React.FC<DepartmentSummaryProps> = ({ departmentCounts }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
      {Object.entries(departmentCounts).map(([dept, count]) => (
        <div key={dept} className="bg-white dark:bg-black/40 rounded-lg p-4 shadow-sm">
          <h3 className="font-medium text-sm text-muted-foreground mb-1">Department</h3>
          <p className="text-lg font-bold">{dept}</p>
          <p className="text-sm mt-1">{count} employees</p>
        </div>
      ))}
    </div>
  );
};

export default DepartmentSummary;
