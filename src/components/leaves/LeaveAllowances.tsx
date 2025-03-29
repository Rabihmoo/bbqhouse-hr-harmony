
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LeaveAllowance } from "@/types/notification";

interface LeaveAllowancesProps {
  employees: any[];
  activeCompany: string;
}

const LeaveAllowances = ({ employees, activeCompany }: LeaveAllowancesProps) => {
  const filteredEmployees = employees
    .filter(emp => emp.status === 'Active')
    .filter(emp => {
      if (activeCompany === 'all') return true;
      return emp.company?.toLowerCase().includes(activeCompany);
    });
    
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Allowances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map(employee => {
            const allowance = employee.leaveAllowances?.find(a => a.year === new Date().getFullYear());
            
            return (
              <div 
                key={employee.id} 
                className="border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{employee.fullName}</h3>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs",
                    allowance?.status === 'unused' 
                      ? "bg-amber-100 text-amber-800" 
                      : allowance?.status === 'fully-used'
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                  )}>
                    {allowance?.status === 'unused' 
                      ? "Unused" 
                      : allowance?.status === 'fully-used'
                        ? "Fully Used"
                        : "Partially Used"}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-2 text-sm">
                  <div className="bg-background p-2 rounded text-center">
                    <div className="font-semibold">{allowance?.daysEntitled || 21}</div>
                    <div className="text-xs text-muted-foreground">Entitled</div>
                  </div>
                  <div className="bg-background p-2 rounded text-center">
                    <div className="font-semibold">{allowance?.daysTaken || 0}</div>
                    <div className="text-xs text-muted-foreground">Taken</div>
                  </div>
                  <div className="bg-background p-2 rounded text-center">
                    <div className="font-semibold">{allowance?.remaining || 21}</div>
                    <div className="text-xs text-muted-foreground">Remaining</div>
                  </div>
                </div>
                
                <progress 
                  className="w-full h-2 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-bar]:bg-secondary [&::-webkit-progress-value]:bg-primary"
                  value={(allowance?.daysTaken || 0)} 
                  max={(allowance?.daysEntitled || 21)}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveAllowances;
