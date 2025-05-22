import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Influencer, Platform, Status, VideoData } from "@/lib/types";

interface AddInfluencerDialogProps {
  onClose: () => void;
}

export function AddInfluencerDialog({ onClose }: AddInfluencerDialogProps) {
  const [newInfluencer, setNewInfluencer] = useState<Partial<Influencer>>({
    username: "",
    profileLink: "",
    platform: "Instagram",
    viewsMedian: 0,
    videos: {
      video1: { link: "", postedOn: "", views: 0 },
      video2: { link: "", postedOn: "", views: 0 },
      video3: { link: "", postedOn: "", views: 0 },
      video4: { link: "", postedOn: "", views: 0 },
    },
    status: "Script needed",
  });

  const handleInputChange = (field: string, value: string | number) => {
    setNewInfluencer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleVideoChange = (
    videoNumber: number,
    field: keyof VideoData,
    value: string | number
  ) => {
    setNewInfluencer((prev) => {
      if (!prev.videos) return prev;
      const videoKey = `video${videoNumber}` as keyof typeof prev.videos;
      return {
        ...prev,
        videos: {
          ...prev.videos,
          [videoKey]: {
            ...prev.videos[videoKey],
            [field]: value,
          },
        },
      };
    });
  };

  const handleAddInfluencer = () => {
    // Calculate total views (viewsMedian * 5)
    const viewsMedian = Number(newInfluencer.viewsMedian) || 0;
    const totalViews = viewsMedian * 5;

    // Calculate views now (sum of all video views)
    const viewsNow =
      (Number(newInfluencer.videos?.video1?.views) || 0) +
      (Number(newInfluencer.videos?.video2?.views) || 0) +
      (Number(newInfluencer.videos?.video3?.views) || 0) +
      (Number(newInfluencer.videos?.video4?.views) || 0);

    const influencer: Influencer = {
      id: Date.now().toString(),
      username: newInfluencer.username || "",
      profileLink: newInfluencer.profileLink || "",
      platform: (newInfluencer.platform as Platform) || "Instagram",
      viewsMedian,
      totalViews,
      viewsNow,
      videos: {
        video1: newInfluencer.videos?.video1 || {
          link: "",
          postedOn: "",
          views: 0,
        },
        video2: newInfluencer.videos?.video2 || {
          link: "",
          postedOn: "",
          views: 0,
        },
        video3: newInfluencer.videos?.video3 || {
          link: "",
          postedOn: "",
          views: 0,
        },
        video4: newInfluencer.videos?.video4 || {
          link: "",
          postedOn: "",
          views: 0,
        },
      },
      status: (newInfluencer.status as Status) || "Script needed",
    };

    // TODO: Add the influencer to the list (this will be handled by the parent component)
    onClose();
  };

  return (
    <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add New Influencer</DialogTitle>
        <DialogDescription>
          Enter the details of the influencer to add to the campaign.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={newInfluencer.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="e.g., influencer_name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profileLink">Profile Link</Label>
            <Input
              id="profileLink"
              value={newInfluencer.profileLink}
              onChange={(e) => handleInputChange("profileLink", e.target.value)}
              placeholder="e.g., https://instagram.com/username"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select
              value={newInfluencer.platform as string}
              onValueChange={(value) => handleInputChange("platform", value)}
            >
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="Instagram + TikTok">
                  Instagram + TikTok
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="viewsMedian">Views Median</Label>
            <Input
              id="viewsMedian"
              type="number"
              value={newInfluencer.viewsMedian || ""}
              onChange={(e) =>
                handleInputChange("viewsMedian", Number(e.target.value))
              }
              placeholder="e.g., 50000"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={newInfluencer.status as string}
            onValueChange={(value) => handleInputChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Posted">Posted</SelectItem>
              <SelectItem value="Script needed">Script needed</SelectItem>
              <SelectItem value="Approve needed">Approve needed</SelectItem>
              <SelectItem value="Draft requested">Draft requested</SelectItem>
              <SelectItem value="In progress">In progress</SelectItem>
              <SelectItem value="Script is ready">Script is ready</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Video Details</h3>
          {[1, 2, 3, 4].map((videoNum) => (
            <div key={videoNum} className="space-y-4 border p-3 rounded-md">
              <h4 className="font-medium">Video #{videoNum}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`video${videoNum}Link`}>Link</Label>
                  <Input
                    id={`video${videoNum}Link`}
                    value={
                      newInfluencer.videos?.[
                        `video${videoNum}` as keyof typeof newInfluencer.videos
                      ]?.link || ""
                    }
                    onChange={(e) =>
                      handleVideoChange(videoNum, "link", e.target.value)
                    }
                    placeholder="Video link"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`video${videoNum}PostedOn`}>Posted On</Label>
                  <Input
                    id={`video${videoNum}PostedOn`}
                    value={
                      newInfluencer.videos?.[
                        `video${videoNum}` as keyof typeof newInfluencer.videos
                      ]?.postedOn || ""
                    }
                    onChange={(e) =>
                      handleVideoChange(videoNum, "postedOn", e.target.value)
                    }
                    placeholder="DD.MM.YYYY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`video${videoNum}Views`}>Views</Label>
                  <Input
                    id={`video${videoNum}Views`}
                    type="number"
                    value={
                      newInfluencer.videos?.[
                        `video${videoNum}` as keyof typeof newInfluencer.videos
                      ]?.views || ""
                    }
                    onChange={(e) =>
                      handleVideoChange(
                        videoNum,
                        "views",
                        Number(e.target.value)
                      )
                    }
                    placeholder="e.g., 10000"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleAddInfluencer}>Add Influencer</Button>
      </DialogFooter>
    </DialogContent>
  );
}
