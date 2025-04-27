import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertEmployerProfileSchema, EmployerProfile as EmployerProfileType } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Building } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Extended schema for the form with validations
const formSchema = insertEmployerProfileSchema.extend({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(1, "Industry is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function EmployerProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Fetch employer profile
  const { data: profile, isLoading } = useQuery<EmployerProfileType>({
    queryKey: ["/api/profile/employer"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/profile/employer");
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      } catch (error) {
        if ((error as any).message.includes("404")) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!user,
  });

  // Initialize form with existing data or defaults
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: user?.id || 0,
      companyName: profile?.companyName || user?.name || "",
      companySize: profile?.companySize || "",
      industry: profile?.industry || "",
      description: profile?.description || "",
      location: profile?.location || "",
      website: profile?.website || "",
      logo: profile?.logo || "",
    },
  });

  // Initialize form values when profile is loaded
  React.useEffect(() => {
    if (profile && !isLoading) {
      form.reset({
        userId: user?.id || 0,
        companyName: profile.companyName,
        companySize: profile.companySize || "",
        industry: profile.industry || "",
        description: profile.description || "",
        location: profile.location || "",
        website: profile.website || "",
        logo: profile.logo || "",
      });
    }
  }, [profile, isLoading, form.reset]);

  // Create profile mutation
  const createProfileMutation = useMutation({
    mutationFn: async (data: EmployerProfileType) => {
      return apiRequest("POST", "/api/profile/employer", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Created Successfully",
        description: "Your company profile has been created.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profile/employer"] });
      setLocation("/dashboard/employer");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Create Profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { id: number; profile: Partial<EmployerProfileType> }) => {
      return apiRequest("PUT", `/api/profile/employer/${data.id}`, data.profile);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated Successfully",
        description: "Your company profile has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profile/employer"] });
      setLocation("/dashboard/employer");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Update Profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    const profileData = {
      userId: user?.id || 0,
      companyName: values.companyName,
      companySize: values.companySize,
      industry: values.industry,
      description: values.description,
      location: values.location,
      website: values.website,
      logo: values.logo,
    };

    if (profile) {
      // Update existing profile
      updateProfileMutation.mutate({
        id: profile.id,
        profile: profileData,
      });
    } else {
      // Create new profile
      createProfileMutation.mutate(profileData as EmployerProfileType);
    }
  };

  const isSubmitting = createProfileMutation.isPending || updateProfileMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-neutral-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-neutral-900">
              {profile ? "Update Company Profile" : "Complete Company Profile"}
            </h1>
            <p className="text-neutral-600">
              {profile
                ? "Keep your company information up to date to attract top talent"
                : "Create your company profile to start posting jobs"}
            </p>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>
                      Tell job seekers about your company
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Acme Corporation" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Technology, Healthcare, Finance" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="companySize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Size</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select company size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1-10">1-10 employees</SelectItem>
                                <SelectItem value="11-50">11-50 employees</SelectItem>
                                <SelectItem value="51-200">51-200 employees</SelectItem>
                                <SelectItem value="201-500">201-500 employees</SelectItem>
                                <SelectItem value="501-1000">501-1000 employees</SelectItem>
                                <SelectItem value="1001+">1001+ employees</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Headquarters Location</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. San Francisco, CA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Website</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. https://www.example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell job seekers about your company, culture, mission, and values..."
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A compelling description helps attract the right candidates
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Logo URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Paste a URL to your company logo"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide a publicly accessible URL to your company logo
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/dashboard/employer")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {profile ? "Updating Profile..." : "Creating Profile..."}
                      </>
                    ) : (
                      profile ? "Update Profile" : "Create Profile"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
