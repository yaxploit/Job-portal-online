import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface JobFilterProps {
  jobType: string;
  setJobType: (value: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export default function JobFilter({
  jobType,
  setJobType,
  onApplyFilters,
  onClearFilters,
}: JobFilterProps) {
  const handleJobTypeChange = (value: string) => {
    setJobType(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-3">Job Type</h4>
        <RadioGroup
          value={jobType}
          onValueChange={handleJobTypeChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="full-time" id="job-type-full-time" />
            <Label htmlFor="job-type-full-time" className="cursor-pointer">Full-time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="part-time" id="job-type-part-time" />
            <Label htmlFor="job-type-part-time" className="cursor-pointer">Part-time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="contract" id="job-type-contract" />
            <Label htmlFor="job-type-contract" className="cursor-pointer">Contract</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="remote" id="job-type-remote" />
            <Label htmlFor="job-type-remote" className="cursor-pointer">Remote</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      {/* Experience Level - This could be added if schema supported it
      <div>
        <h4 className="text-sm font-medium mb-3">Experience Level</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <Checkbox id="entry-level" className="mr-2" />
            <Label htmlFor="entry-level" className="cursor-pointer">Entry Level</Label>
          </div>
          <div className="flex items-center">
            <Checkbox id="mid-level" className="mr-2" />
            <Label htmlFor="mid-level" className="cursor-pointer">Mid Level</Label>
          </div>
          <div className="flex items-center">
            <Checkbox id="senior-level" className="mr-2" />
            <Label htmlFor="senior-level" className="cursor-pointer">Senior Level</Label>
          </div>
        </div>
      </div>

      <Separator />
      */}

      <div className="space-y-2">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onApplyFilters}
        >
          Apply Filters
        </Button>
        <Button 
          variant="ghost" 
          className="w-full text-neutral-600"
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
