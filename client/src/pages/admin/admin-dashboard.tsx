import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockStats = {
  totalUsers: 157,
  totalJobListings: 86,
  totalApplications: 342,
  newUsersThisWeek: 23,
  newJobsThisWeek: 14,
  completedApplications: 178,
  pendingApplications: 164,
};

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in as admin
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    
    if (!isAdminLoggedIn) {
      toast({
        title: "Access Denied",
        description: "You must be logged in as an admin to view this page",
        variant: "destructive",
      });
      setLocation("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [setLocation, toast]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    toast({
      title: "Logged Out",
      description: "You have been logged out of the admin portal",
      variant: "default",
    });
    setLocation("/admin/login");
  };

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">JobNexus Admin</h1>
          <Button variant="outline" onClick={handleLogout} className="text-white border-white hover:bg-blue-700">
            Logout
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto p-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{mockStats.totalUsers}</p>
              <p className="text-sm text-green-500 mt-1">+{mockStats.newUsersThisWeek} this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Job Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{mockStats.totalJobListings}</p>
              <p className="text-sm text-green-500 mt-1">+{mockStats.newJobsThisWeek} this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{mockStats.totalApplications}</p>
              <p className="text-sm text-blue-500 mt-1">{mockStats.pendingApplications} pending</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="users" className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="jobs">Job Listings</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4 bg-gray-50">
                  <p className="text-center text-gray-500 my-8">
                    This section would display a table of users with actions to edit, delete, or ban users.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Job Listings</CardTitle>
                <CardDescription>Manage all job postings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4 bg-gray-50">
                  <p className="text-center text-gray-500 my-8">
                    This section would display a table of job listings with options to approve, edit, or remove listings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Application Management</CardTitle>
                <CardDescription>Monitor all job applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4 bg-gray-50">
                  <p className="text-center text-gray-500 my-8">
                    This section would show application statistics and allow monitoring of application processes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}