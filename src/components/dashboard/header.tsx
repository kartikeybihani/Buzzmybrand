import { PlusCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Status } from "@/lib/types";
import { AddInfluencerDialog } from "./add-influencer-dialog";

interface HeaderProps {
  statusFilter: Status | "All";
  setStatusFilter: (status: Status | "All") => void;
  onSearch: (searchTerm: string) => void;
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
}

export function DashboardHeader({
  statusFilter,
  setStatusFilter,
  onSearch,
  isFormOpen,
  setIsFormOpen,
}: HeaderProps) {
  return (
    <CardHeader className="flex flex-col space-y-4 p-4 sm:p-6 bg-white border-b">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Influencer Post Tracker
          </CardTitle>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Track and manage influencer campaign posts
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <PlusCircle className="h-4 w-4" />
              Add Influencer
            </Button>
          </DialogTrigger>
          <AddInfluencerDialog onClose={() => setIsFormOpen(false)} />
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-grow">
          <div className="relative flex-grow">
            <Input
              placeholder="Search influencers..."
              className="pl-10"
              onChange={(e) => onSearch(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as Status | "All")}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Posted">Posted</SelectItem>
              <SelectItem value="Script needed">Script needed</SelectItem>
              <SelectItem value="Approve needed">Approve needed</SelectItem>
              <SelectItem value="Draft requested">Draft requested</SelectItem>
              <SelectItem value="In progress">In progress</SelectItem>
              <SelectItem value="Script is ready">Script is ready</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardHeader>
  );
}
