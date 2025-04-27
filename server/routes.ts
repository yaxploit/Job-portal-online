import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertJobListingSchema, 
  insertJobApplicationSchema,
  insertSeekerProfileSchema,
  insertEmployerProfileSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes (/api/register, /api/login, /api/logout, /api/user)
  setupAuth(app);

  // Job Listings Routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const filters = {
        keyword: req.query.keyword as string | undefined,
        location: req.query.location as string | undefined,
        jobType: req.query.jobType as string | undefined,
        employerId: req.query.employerId ? parseInt(req.query.employerId as string) : undefined
      };
      
      const jobListings = await storage.getJobListings(filters);
      res.json(jobListings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching job listings" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      const job = await storage.getJobListing(jobId);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Error fetching job details" });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.userType !== "employer") {
      return res.status(403).json({ message: "Only employers can post jobs" });
    }

    try {
      const validatedData = insertJobListingSchema.parse({
        ...req.body,
        employerId: req.user.id
      });
      
      const newJob = await storage.createJobListing(validatedData);
      res.status(201).json(newJob);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid job data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating job listing" });
    }
  });

  app.put("/api/jobs/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const jobId = parseInt(req.params.id);
      const job = await storage.getJobListing(jobId);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      if (job.employerId !== req.user.id) {
        return res.status(403).json({ message: "You can only update your own job listings" });
      }
      
      const updatedJob = await storage.updateJobListing(jobId, req.body);
      res.json(updatedJob);
    } catch (error) {
      res.status(500).json({ message: "Error updating job listing" });
    }
  });

  app.delete("/api/jobs/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const jobId = parseInt(req.params.id);
      const job = await storage.getJobListing(jobId);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      if (job.employerId !== req.user.id) {
        return res.status(403).json({ message: "You can only delete your own job listings" });
      }
      
      await storage.deleteJobListing(jobId);
      res.json({ message: "Job listing deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting job listing" });
    }
  });

  // Job Applications Routes
  app.post("/api/applications", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.userType !== "seeker") {
      return res.status(403).json({ message: "Only job seekers can apply for jobs" });
    }

    try {
      const validatedData = insertJobApplicationSchema.parse({
        ...req.body,
        seekerId: req.user.id
      });
      
      // Check if job exists
      const job = await storage.getJobListing(validatedData.jobId);
      if (!job || !job.isActive) {
        return res.status(404).json({ message: "Job not found or no longer active" });
      }
      
      // Check if user has already applied
      const userApplications = await storage.getJobApplicationsBySeeker(req.user.id);
      const alreadyApplied = userApplications.some(app => app.jobId === validatedData.jobId);
      
      if (alreadyApplied) {
        return res.status(400).json({ message: "You have already applied for this job" });
      }
      
      const newApplication = await storage.createJobApplication(validatedData);
      res.status(201).json(newApplication);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      res.status(500).json({ message: "Error submitting application" });
    }
  });

  app.get("/api/applications/seeker", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const applications = await storage.getJobApplicationsBySeeker(req.user.id);
      
      // Get job details for each application
      const applicationsWithJobs = await Promise.all(
        applications.map(async (app) => {
          const job = await storage.getJobListing(app.jobId);
          return { ...app, job };
        })
      );
      
      res.json(applicationsWithJobs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching applications" });
    }
  });

  app.get("/api/applications/job/:jobId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.userType !== "employer") {
      return res.status(403).json({ message: "Only employers can view job applications" });
    }

    try {
      const jobId = parseInt(req.params.jobId);
      const job = await storage.getJobListing(jobId);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      if (job.employerId !== req.user.id) {
        return res.status(403).json({ message: "You can only view applications for your own jobs" });
      }
      
      const applications = await storage.getJobApplicationsByJob(jobId);
      
      // Get seeker details for each application
      const applicationsWithSeekers = await Promise.all(
        applications.map(async (app) => {
          const seeker = await storage.getUser(app.seekerId);
          const seekerProfile = await storage.getSeekerProfile(app.seekerId);
          return { ...app, seeker, seekerProfile };
        })
      );
      
      res.json(applicationsWithSeekers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching applications" });
    }
  });

  app.put("/api/applications/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.userType !== "employer") {
      return res.status(403).json({ message: "Only employers can update application status" });
    }

    try {
      const applicationId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["applied", "reviewing", "interview", "rejected", "accepted"].includes(status)) {
        return res.status(400).json({ message: "Invalid application status" });
      }
      
      const application = await storage.getJobApplication(applicationId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      const job = await storage.getJobListing(application.jobId);
      if (!job || job.employerId !== req.user.id) {
        return res.status(403).json({ message: "You can only update applications for your own jobs" });
      }
      
      const updatedApplication = await storage.updateJobApplicationStatus(applicationId, status);
      res.json(updatedApplication);
    } catch (error) {
      res.status(500).json({ message: "Error updating application status" });
    }
  });

  // Profile Routes
  app.get("/api/profile/seeker", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const profile = await storage.getSeekerProfile(req.user.id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile" });
    }
  });

  app.post("/api/profile/seeker", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.userType !== "seeker") {
      return res.status(403).json({ message: "Only job seekers can create a seeker profile" });
    }

    try {
      // Check if profile already exists
      const existingProfile = await storage.getSeekerProfile(req.user.id);
      if (existingProfile) {
        return res.status(400).json({ message: "Profile already exists. Use PUT to update." });
      }
      
      const validatedData = insertSeekerProfileSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const newProfile = await storage.createSeekerProfile(validatedData);
      res.status(201).json(newProfile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating profile" });
    }
  });

  app.put("/api/profile/seeker/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const profileId = parseInt(req.params.id);
      const profile = await storage.getSeekerProfile(req.user.id);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      if (profile.id !== profileId) {
        return res.status(403).json({ message: "You can only update your own profile" });
      }
      
      const updatedProfile = await storage.updateSeekerProfile(profileId, req.body);
      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Error updating profile" });
    }
  });

  app.get("/api/profile/employer", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const profile = await storage.getEmployerProfile(req.user.id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile" });
    }
  });

  app.post("/api/profile/employer", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.userType !== "employer") {
      return res.status(403).json({ message: "Only employers can create an employer profile" });
    }

    try {
      // Check if profile already exists
      const existingProfile = await storage.getEmployerProfile(req.user.id);
      if (existingProfile) {
        return res.status(400).json({ message: "Profile already exists. Use PUT to update." });
      }
      
      const validatedData = insertEmployerProfileSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const newProfile = await storage.createEmployerProfile(validatedData);
      res.status(201).json(newProfile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating profile" });
    }
  });

  app.put("/api/profile/employer/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const profileId = parseInt(req.params.id);
      const profile = await storage.getEmployerProfile(req.user.id);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      if (profile.id !== profileId) {
        return res.status(403).json({ message: "You can only update your own profile" });
      }
      
      const updatedProfile = await storage.updateEmployerProfile(profileId, req.body);
      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Error updating profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
