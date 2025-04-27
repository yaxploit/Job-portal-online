import { 
  User, InsertUser, 
  SeekerProfile, InsertSeekerProfile,
  EmployerProfile, InsertEmployerProfile,
  JobListing, InsertJobListing,
  JobApplication, InsertJobApplication
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Seeker Profile methods
  getSeekerProfile(userId: number): Promise<SeekerProfile | undefined>;
  createSeekerProfile(profile: InsertSeekerProfile): Promise<SeekerProfile>;
  updateSeekerProfile(id: number, profile: Partial<InsertSeekerProfile>): Promise<SeekerProfile | undefined>;
  
  // Employer Profile methods
  getEmployerProfile(userId: number): Promise<EmployerProfile | undefined>;
  createEmployerProfile(profile: InsertEmployerProfile): Promise<EmployerProfile>;
  updateEmployerProfile(id: number, profile: Partial<InsertEmployerProfile>): Promise<EmployerProfile | undefined>;
  
  // Job Listing methods
  getJobListing(id: number): Promise<JobListing | undefined>;
  getJobListings(filters?: {
    keyword?: string;
    location?: string;
    jobType?: string;
    employerId?: number;
  }): Promise<JobListing[]>;
  createJobListing(job: InsertJobListing): Promise<JobListing>;
  updateJobListing(id: number, job: Partial<InsertJobListing>): Promise<JobListing | undefined>;
  deleteJobListing(id: number): Promise<boolean>;
  
  // Job Application methods
  getJobApplication(id: number): Promise<JobApplication | undefined>;
  getJobApplicationsBySeeker(seekerId: number): Promise<JobApplication[]>;
  getJobApplicationsByJob(jobId: number): Promise<JobApplication[]>;
  createJobApplication(application: InsertJobApplication): Promise<JobApplication>;
  updateJobApplicationStatus(id: number, status: string): Promise<JobApplication | undefined>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private seekerProfiles: Map<number, SeekerProfile>;
  private employerProfiles: Map<number, EmployerProfile>;
  private jobListings: Map<number, JobListing>;
  private jobApplications: Map<number, JobApplication>;
  
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private seekerProfileIdCounter: number;
  private employerProfileIdCounter: number;
  private jobListingIdCounter: number;
  private jobApplicationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.seekerProfiles = new Map();
    this.employerProfiles = new Map();
    this.jobListings = new Map();
    this.jobApplications = new Map();
    
    this.userIdCounter = 1;
    this.seekerProfileIdCounter = 1;
    this.employerProfileIdCounter = 1;
    this.jobListingIdCounter = 1;
    this.jobApplicationIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Seeker Profile methods
  async getSeekerProfile(userId: number): Promise<SeekerProfile | undefined> {
    return Array.from(this.seekerProfiles.values()).find(
      (profile) => profile.userId === userId
    );
  }
  
  async createSeekerProfile(profile: InsertSeekerProfile): Promise<SeekerProfile> {
    const id = this.seekerProfileIdCounter++;
    const newProfile: SeekerProfile = { ...profile, id };
    this.seekerProfiles.set(id, newProfile);
    return newProfile;
  }
  
  async updateSeekerProfile(id: number, profile: Partial<InsertSeekerProfile>): Promise<SeekerProfile | undefined> {
    const existingProfile = this.seekerProfiles.get(id);
    if (!existingProfile) return undefined;
    
    const updatedProfile = { ...existingProfile, ...profile };
    this.seekerProfiles.set(id, updatedProfile);
    return updatedProfile;
  }
  
  // Employer Profile methods
  async getEmployerProfile(userId: number): Promise<EmployerProfile | undefined> {
    return Array.from(this.employerProfiles.values()).find(
      (profile) => profile.userId === userId
    );
  }
  
  async createEmployerProfile(profile: InsertEmployerProfile): Promise<EmployerProfile> {
    const id = this.employerProfileIdCounter++;
    const newProfile: EmployerProfile = { ...profile, id };
    this.employerProfiles.set(id, newProfile);
    return newProfile;
  }
  
  async updateEmployerProfile(id: number, profile: Partial<InsertEmployerProfile>): Promise<EmployerProfile | undefined> {
    const existingProfile = this.employerProfiles.get(id);
    if (!existingProfile) return undefined;
    
    const updatedProfile = { ...existingProfile, ...profile };
    this.employerProfiles.set(id, updatedProfile);
    return updatedProfile;
  }
  
  // Job Listing methods
  async getJobListing(id: number): Promise<JobListing | undefined> {
    return this.jobListings.get(id);
  }
  
  async getJobListings(filters?: {
    keyword?: string;
    location?: string;
    jobType?: string;
    employerId?: number;
  }): Promise<JobListing[]> {
    let listings = Array.from(this.jobListings.values()).filter(job => job.isActive);
    
    if (filters) {
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        listings = listings.filter(job => 
          job.title.toLowerCase().includes(keyword) ||
          job.description.toLowerCase().includes(keyword) ||
          (job.skills && job.skills.some(skill => skill.toLowerCase().includes(keyword)))
        );
      }
      
      if (filters.location) {
        const location = filters.location.toLowerCase();
        listings = listings.filter(job => job.location.toLowerCase().includes(location));
      }
      
      if (filters.jobType) {
        listings = listings.filter(job => job.jobType === filters.jobType);
      }
      
      if (filters.employerId) {
        listings = listings.filter(job => job.employerId === filters.employerId);
      }
    }
    
    // Sort by posted date, newest first
    return listings.sort((a, b) => 
      new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    );
  }
  
  async createJobListing(job: InsertJobListing): Promise<JobListing> {
    const id = this.jobListingIdCounter++;
    const now = new Date();
    const jobListing: JobListing = { 
      ...job, 
      id, 
      postedAt: now, 
      isActive: true 
    };
    this.jobListings.set(id, jobListing);
    return jobListing;
  }
  
  async updateJobListing(id: number, job: Partial<InsertJobListing>): Promise<JobListing | undefined> {
    const existingJob = this.jobListings.get(id);
    if (!existingJob) return undefined;
    
    const updatedJob = { ...existingJob, ...job };
    this.jobListings.set(id, updatedJob);
    return updatedJob;
  }
  
  async deleteJobListing(id: number): Promise<boolean> {
    const job = this.jobListings.get(id);
    if (!job) return false;
    
    // Soft delete by setting isActive to false
    job.isActive = false;
    this.jobListings.set(id, job);
    return true;
  }
  
  // Job Application methods
  async getJobApplication(id: number): Promise<JobApplication | undefined> {
    return this.jobApplications.get(id);
  }
  
  async getJobApplicationsBySeeker(seekerId: number): Promise<JobApplication[]> {
    return Array.from(this.jobApplications.values())
      .filter(app => app.seekerId === seekerId)
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
  }
  
  async getJobApplicationsByJob(jobId: number): Promise<JobApplication[]> {
    return Array.from(this.jobApplications.values())
      .filter(app => app.jobId === jobId)
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
  }
  
  async createJobApplication(application: InsertJobApplication): Promise<JobApplication> {
    const id = this.jobApplicationIdCounter++;
    const now = new Date();
    const jobApplication: JobApplication = { 
      ...application, 
      id, 
      status: "applied", 
      appliedAt: now 
    };
    this.jobApplications.set(id, jobApplication);
    return jobApplication;
  }
  
  async updateJobApplicationStatus(id: number, status: string): Promise<JobApplication | undefined> {
    const application = this.jobApplications.get(id);
    if (!application) return undefined;
    
    application.status = status;
    this.jobApplications.set(id, application);
    return application;
  }
}

export const storage = new MemStorage();
