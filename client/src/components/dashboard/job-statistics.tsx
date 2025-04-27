import { useState, useEffect } from "react";
import { JobListing, JobApplication } from "@shared/schema";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from "recharts";

type JobStatisticsProps = {
  data: JobListing[] | (JobApplication & { job: JobListing })[];
  isLoading: boolean;
  type: "seeker" | "employer";
};

export default function JobStatistics({ data, isLoading, type }: JobStatisticsProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  useEffect(() => {
    if (isLoading || !data.length) return;

    if (type === "seeker") {
      // Applications data for job seekers
      const applications = data as (JobApplication & { job: JobListing })[];
      
      // Prepare bar chart data - applications by status
      const statusCounts = applications.reduce((acc: any, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {});
      
      const barData = Object.entries(statusCounts).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
      }));
      
      setChartData(barData);
      
      // Prepare pie chart data - applications by job type
      const jobTypeCounts = applications.reduce((acc: any, app) => {
        const jobType = app.job?.jobType || "Unknown";
        acc[jobType] = (acc[jobType] || 0) + 1;
        return acc;
      }, {});
      
      const pieChartData = Object.entries(jobTypeCounts).map(([jobType, count]) => ({
        name: jobType.charAt(0).toUpperCase() + jobType.slice(1),
        value: count,
      }));
      
      setPieData(pieChartData);
    } else {
      // Jobs data for employers
      const jobs = data as JobListing[];
      
      // Prepare bar chart data - jobs by type
      const jobTypeCounts = jobs.reduce((acc: any, job) => {
        acc[job.jobType] = (acc[job.jobType] || 0) + 1;
        return acc;
      }, {});
      
      const barData = Object.entries(jobTypeCounts).map(([jobType, count]) => ({
        name: jobType.charAt(0).toUpperCase() + jobType.slice(1),
        value: count,
      }));
      
      setChartData(barData);
      
      // Prepare pie chart data - active vs. inactive jobs
      const activeCounts = jobs.reduce(
        (acc: any, job) => {
          if (job.isActive) {
            acc.active += 1;
          } else {
            acc.inactive += 1;
          }
          return acc;
        },
        { active: 0, inactive: 0 }
      );
      
      const pieChartData = [
        { name: "Active", value: activeCounts.active },
        { name: "Inactive", value: activeCounts.inactive },
      ].filter(item => item.value > 0);
      
      setPieData(pieChartData);
    }
  }, [data, isLoading, type]);

  const COLORS = ["#2563eb", "#0ea5e9", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-neutral-400">Loading statistics...</div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral-600">
          No data available to display statistics.
          {type === "seeker" 
            ? " Apply for jobs to see your application stats."
            : " Post jobs to see your job statistics."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-neutral-500 mb-2">
            {type === "seeker" ? "Applications by Status" : "Jobs by Type"}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-neutral-500 mb-2">
            {type === "seeker" ? "Applications by Job Type" : "Job Status Distribution"}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
