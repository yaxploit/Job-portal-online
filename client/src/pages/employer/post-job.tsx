import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import BaseLayout from '@/components/layout/base-layout';
import AddJobForm from '@/components/employer/add-job-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * This page handles job posting for employers.
 * It includes authorization checks to ensure only employers can access it.
 */
export default function PostJobPage() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Check if user is authorized (is an employer)
  const isEmployer = user && user.userType === 'employer';
  
  // Redirect non-authenticated or non-employer users
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return (
      <BaseLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </BaseLayout>
    );
  }

  if (!isEmployer) {
    return (
      <BaseLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              Only employers can post job listings. If you are an employer, please make sure you are using an employer account.
            </AlertDescription>
          </Alert>
          <div className="flex justify-center">
            <Button onClick={() => navigate('/')} variant="outline">
              Return to Home
            </Button>
          </div>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="bg-neutral-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
            <p className="mt-2 text-gray-600">
              Create a job listing to find the best candidates for your company.
            </p>
          </div>
          
          <AddJobForm />
        </div>
      </div>
    </BaseLayout>
  );
}