import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  userType: text("user_type", { enum: ["seeker", "employer", "admin"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Job Seeker Profile Schema
export const seekerProfiles = pgTable("seeker_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title"),
  skills: text("skills").array(),
  education: json("education"),
  experience: json("experience"),
  bio: text("bio"),
  location: text("location"),
  phone: text("phone"),
  resume: text("resume"), // Store file path or content
});

export const insertSeekerProfileSchema = createInsertSchema(seekerProfiles).omit({
  id: true,
});

// Employer Profile Schema
export const employerProfiles = pgTable("employer_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  companyName: text("company_name").notNull(),
  companySize: text("company_size"),
  industry: text("industry"),
  description: text("description"),
  location: text("location"),
  website: text("website"),
  logo: text("logo"), // Store file path or content
});

export const insertEmployerProfileSchema = createInsertSchema(employerProfiles).omit({
  id: true,
});

// Job Listing Schema
export const jobListings = pgTable("job_listings", {
  id: serial("id").primaryKey(),
  employerId: integer("employer_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  jobType: text("job_type", { enum: ["full-time", "part-time", "contract", "remote"] }).notNull(),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  skills: text("skills").array(),
  applicationDeadline: timestamp("application_deadline"),
  postedAt: timestamp("posted_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const insertJobListingSchema = createInsertSchema(jobListings).omit({
  id: true,
  postedAt: true,
  isActive: true,
});

// Job Application Schema
export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  seekerId: integer("seeker_id").notNull(),
  status: text("status", { enum: ["applied", "reviewing", "interview", "rejected", "accepted"] }).default("applied"),
  coverLetter: text("cover_letter"),
  resume: text("resume"),
  appliedAt: timestamp("applied_at").defaultNow(),
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  status: true,
  appliedAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type SeekerProfile = typeof seekerProfiles.$inferSelect;
export type InsertSeekerProfile = z.infer<typeof insertSeekerProfileSchema>;

export type EmployerProfile = typeof employerProfiles.$inferSelect;
export type InsertEmployerProfile = z.infer<typeof insertEmployerProfileSchema>;

export type JobListing = typeof jobListings.$inferSelect;
export type InsertJobListing = z.infer<typeof insertJobListingSchema>;

export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
