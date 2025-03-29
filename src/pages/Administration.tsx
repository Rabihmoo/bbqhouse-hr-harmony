
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, UserPlus, Settings, Shield, Database, Users } from "lucide-react";

interface AdministrationProps {
  onLogout?: () => void;
}

const Administration = ({ onLogout }: AdministrationProps) => {
  return (
    <DashboardLayout 
      title="Administration" 
      subtitle="System administration and settings"
      onLogout={onLogout}
    >
      <Tabs defaultValue="system">
        <TabsList className="mb-6">
          <TabsTrigger value="system">System Settings</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="system" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>Configure system-wide settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span>System Name</span>
                    <span className="font-medium">BBQHOUSE HR</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span>Version</span>
                    <span className="font-medium">1.0.0</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span>Language</span>
                    <span className="font-medium">English</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span>Time Zone</span>
                    <span className="font-medium">GMT+2</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Edit Settings</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>Manage security settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span>Password Policy</span>
                    <span className="font-medium">Strong</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span>Two-Factor Auth</span>
                    <span className="font-medium text-orange-500">Disabled</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span>Session Timeout</span>
                    <span className="font-medium">30 minutes</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span>Account Lockout</span>
                    <span className="font-medium">After 5 attempts</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Configure Security</Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                System Status
              </CardTitle>
              <CardDescription>View the current system status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="text-green-600 dark:text-green-400 text-sm font-medium">Database</div>
                    <div className="text-2xl font-bold mt-1">Connected</div>
                  </div>
                  
                  <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="text-green-600 dark:text-green-400 text-sm font-medium">Services</div>
                    <div className="text-2xl font-bold mt-1">Running</div>
                  </div>
                  
                  <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="text-green-600 dark:text-green-400 text-sm font-medium">Storage</div>
                    <div className="text-2xl font-bold mt-1">72% Free</div>
                  </div>
                  
                  <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="text-green-600 dark:text-green-400 text-sm font-medium">Performance</div>
                    <div className="text-2xl font-bold mt-1">Optimal</div>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Last system check: Today at 09:45 AM
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Run System Diagnostics</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                User Accounts
              </CardTitle>
              <CardDescription>Manage system users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-3 bg-muted/50 p-3 font-medium text-sm">
                    <div>Username</div>
                    <div>Role</div>
                    <div>Status</div>
                  </div>
                  
                  <div className="divide-y">
                    <div className="grid grid-cols-3 p-3 text-sm">
                      <div>admin</div>
                      <div>Administrator</div>
                      <div className="text-green-600 dark:text-green-400">Active</div>
                    </div>
                    
                    <div className="grid grid-cols-3 p-3 text-sm">
                      <div>manager</div>
                      <div>HR Manager</div>
                      <div className="text-green-600 dark:text-green-400">Active</div>
                    </div>
                    
                    <div className="grid grid-cols-3 p-3 text-sm">
                      <div>user1</div>
                      <div>HR Staff</div>
                      <div className="text-amber-600 dark:text-amber-400">Inactive</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
              <Button variant="outline">Manage Roles</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Data Backup & Restore
              </CardTitle>
              <CardDescription>Manage system backups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-3 bg-muted/50 p-3 font-medium text-sm">
                    <div>Backup Name</div>
                    <div>Date</div>
                    <div>Size</div>
                  </div>
                  
                  <div className="divide-y">
                    <div className="grid grid-cols-3 p-3 text-sm">
                      <div>Auto Backup</div>
                      <div>Today at 00:00</div>
                      <div>4.2 MB</div>
                    </div>
                    
                    <div className="grid grid-cols-3 p-3 text-sm">
                      <div>Manual Backup</div>
                      <div>Yesterday at 15:30</div>
                      <div>4.1 MB</div>
                    </div>
                    
                    <div className="grid grid-cols-3 p-3 text-sm">
                      <div>Auto Backup</div>
                      <div>2 days ago</div>
                      <div>4.0 MB</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button>Create Backup</Button>
              <Button variant="outline">Restore Backup</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>View and download system logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md h-80 overflow-y-auto p-4 bg-muted/20 font-mono text-xs">
                <div className="space-y-1 text-muted-foreground">
                  <div>[2023-05-30 09:31:36] info: Initializing BBQHOUSE HR Management System</div>
                  <div>[2023-05-30 09:31:43] info: User admin logged in successfully</div>
                  <div>[2023-05-30 10:15:22] info: Employee profile updated (ID: EMP001)</div>
                  <div>[2023-05-30 10:42:17] warning: Failed login attempt for user manager</div>
                  <div>[2023-05-30 11:03:54] info: New leave request created (ID: LV087)</div>
                  <div>[2023-05-30 11:30:12] info: Leave request approved (ID: LV087)</div>
                  <div>[2023-05-30 13:45:36] info: Contract generated for employee (ID: EMP005)</div>
                  <div>[2023-05-30 14:22:19] error: Database connection timeout</div>
                  <div>[2023-05-30 14:22:45] info: Database connection reestablished</div>
                  <div>[2023-05-30 15:10:33] info: System backup completed</div>
                  <div>[2023-05-30 16:45:09] info: User admin logged out</div>
                  <div>[2023-05-30 17:01:27] info: System shutdown initiated</div>
                  <div>[2023-05-31 08:00:05] info: System startup</div>
                  <div>[2023-05-31 08:05:12] info: User admin logged in successfully</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Refresh</Button>
              <Button variant="outline">Download Logs</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Administration;
