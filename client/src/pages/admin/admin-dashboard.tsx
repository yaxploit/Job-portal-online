import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { User, FileText, Briefcase, Users, Globe, Search, Award, CheckCircle, Clock, Calendar, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobListing, User as UserType } from "@shared/schema";

// Statistics data
const stats = {
  totalUsers: 157,
  totalJobListings: 86,
  totalApplications: 342,
  newUsersThisWeek: 23,
  newJobsThisWeek: 14,
  completedApplications: 178,
  pendingApplications: 164,
};

// Chart data
const userActivityData = [
  { name: 'Jan', seekers: 40, employers: 24 },
  { name: 'Feb', seekers: 30, employers: 13 },
  { name: 'Mar', seekers: 20, employers: 28 },
  { name: 'Apr', seekers: 27, employers: 18 },
  { name: 'May', seekers: 18, employers: 12 },
  { name: 'Jun', seekers: 23, employers: 17 },
  { name: 'Jul', seekers: 34, employers: 21 },
];

const applicationStatusData = [
  { name: 'Submitted', value: 45, color: '#6366f1' },
  { name: 'Under Review', value: 25, color: '#f43f5e' },
  { name: 'Interview', value: 15, color: '#10b981' },
  { name: 'Offered', value: 10, color: '#f97316' },
  { name: 'Rejected', value: 5, color: '#6b7280' },
];

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("users");
  const [localJobs, setLocalJobs] = useState<JobListing[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  // Fetch local jobs and users data
  useEffect(() => {
    try {
      // Dynamically import to avoid issues with window/localStorage
      import("@/lib/local-jobs").then(({ initLocalJobs, getJobs }) => {
        // Initialize jobs
        initLocalJobs();
        
        // Get all jobs
        const jobs = getJobs();
        setLocalJobs(jobs);
      });
      
      import("@/lib/local-auth").then(({ getUsers }) => {
        const allUsers = getUsers();
        setUsers(allUsers);
      });
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, []);

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
  
  // Filter jobs based on searchTerm and filterType
  const filteredJobs = localJobs.filter(job => {
    const matchesSearchTerm = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "all") return matchesSearchTerm;
    return matchesSearchTerm && job.jobType === filterType;
  });
  
  // Filter users based on searchTerm
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>;
      case "full-time":
        return <Badge className="bg-blue-500">Full-time</Badge>;
      case "part-time":
        return <Badge className="bg-purple-500">Part-time</Badge>;
      case "remote":
        return <Badge className="bg-indigo-500">Remote</Badge>;
      case "contract":
        return <Badge className="bg-orange-500">Contract</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  <p className="text-sm text-green-500 mt-1">+{stats.newUsersThisWeek} this week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Job Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-indigo-500 mr-3" />
                <div>
                  <p className="text-3xl font-bold">{stats.totalJobListings}</p>
                  <p className="text-sm text-green-500 mt-1">+{stats.newJobsThisWeek} this week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-rose-500 mr-3" />
                <div>
                  <p className="text-3xl font-bold">{stats.totalApplications}</p>
                  <p className="text-sm text-blue-500 mt-1">{stats.pendingApplications} pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-emerald-500 mr-3" />
                <div>
                  <p className="text-3xl font-bold">52%</p>
                  <p className="text-sm text-gray-500 mt-1">+5% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Registrations over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={userActivityData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="seekers" fill="#6366f1" name="Job Seekers" />
                    <Bar dataKey="employers" fill="#ec4899" name="Employers" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Current applications by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={applicationStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {applicationStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="users" className="mt-6" onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="users" className="flex items-center">
              <User className="h-4 w-4 mr-2" /> Users
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center">
              <Briefcase className="h-4 w-4 mr-2" /> Job Listings
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" /> Applications
            </TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative md:w-1/3">
              <Input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            {activeTab === "jobs" && (
              <div className="md:w-1/4">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>User Type</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.userType === "seeker" ? "default" : "outline"}>
                            {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {getStatusBadge("active")}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">Previous</Button>
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{filteredUsers.length}</span> of{" "}
                  <span className="font-medium">{users.length}</span> users
                </div>
                <Button variant="outline" size="sm">Next</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Job Listings</CardTitle>
                <CardDescription>Manage all job postings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Salary Range</TableHead>
                      <TableHead>Posted Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>{job.id}</TableCell>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{getStatusBadge(job.jobType)}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>
                          {formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)}
                        </TableCell>
                        <TableCell>{formatDate(job.postedAt)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">Previous</Button>
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{filteredJobs.length}</span> of{" "}
                  <span className="font-medium">{localJobs.length}</span> jobs
                </div>
                <Button variant="outline" size="sm">Next</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Application Management</CardTitle>
                <CardDescription>Monitor all job applications</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Application Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>1</TableCell>
                      <TableCell className="font-medium">Frontend Developer</TableCell>
                      <TableCell>John Doe</TableCell>
                      <TableCell>15 Apr 2023</TableCell>
                      <TableCell><Badge className="bg-blue-500">Under Review</Badge></TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="outline" size="sm">Update</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2</TableCell>
                      <TableCell className="font-medium">Backend Engineer</TableCell>
                      <TableCell>Jane Doe</TableCell>
                      <TableCell>12 Apr 2023</TableCell>
                      <TableCell><Badge className="bg-green-500">Interview</Badge></TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="outline" size="sm">Update</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>3</TableCell>
                      <TableCell className="font-medium">QA Engineer</TableCell>
                      <TableCell>Mike Brown</TableCell>
                      <TableCell>10 Apr 2023</TableCell>
                      <TableCell><Badge className="bg-yellow-500">Offered</Badge></TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="outline" size="sm">Update</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">Previous</Button>
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">3</span> of{" "}
                  <span className="font-medium">{stats.totalApplications}</span> applications
                </div>
                <Button variant="outline" size="sm">Next</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}