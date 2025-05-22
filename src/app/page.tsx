"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardStats } from "@/components/dashboard/stats";
import { InfluencerTable } from "@/components/dashboard/table";
import { AddVideoDialog } from "@/components/dashboard/add-video-dialog";
import { ProfileLinksModal } from "@/components/profile-links-modal";
import { Influencer, Status, VideoData } from "@/lib/types";

export default function Home() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [filteredInfluencers, setFilteredInfluencers] = useState<Influencer[]>(
    []
  );
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] =
    useState<Influencer | null>(null);
  const [isVideoFormOpen, setIsVideoFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<{
    influencerId: string;
    videoNumber: number;
    videoData: VideoData;
  } | null>(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedInfluencers = localStorage.getItem("influencers");
    if (savedInfluencers) {
      setInfluencers(JSON.parse(savedInfluencers));
    } else {
      // Add sample data if no data exists
      const sampleData: Influencer[] = [
        {
          id: "1",
          username: "cherrylex.x",
          profileLink: "https://www.tiktok.com/",
          platform: "Instagram + TikTok",
          viewsMedian: 24700,
          totalViews: 123500,
          viewsNow: 12029,
          videos: {
            video1: {
              link: "https://www.tiktok.com/video1",
              postedOn: "20.04.2025",
              views: 3791,
            },
            video2: {
              link: "https://www.tiktok.com/video2",
              postedOn: "27.04.2025",
              views: 8238,
            },
            video3: { link: "", postedOn: "", views: 0 },
            video4: { link: "", postedOn: "", views: 0 },
          },
          status: "Approve needed",
        },
        {
          id: "2",
          username: "joylovette",
          profileLink: "https://www.instagram.com/",
          platform: "Instagram",
          viewsMedian: 66200,
          totalViews: 331000,
          viewsNow: 78900,
          videos: {
            video1: {
              link: "https://www.instagram.com/video1",
              postedOn: "31.04.2025",
              views: 13800,
            },
            video2: {
              link: "https://www.instagram.com/video2",
              postedOn: "9.05.2025",
              views: 14100,
            },
            video3: {
              link: "https://www.instagram.com/video3",
              postedOn: "19.05.2025",
              views: 51000,
            },
            video4: { link: "", postedOn: "", views: 0 },
          },
          status: "Script needed",
        },
      ];
      setInfluencers(sampleData);
      localStorage.setItem("influencers", JSON.stringify(sampleData));
    }
  }, []);

  // Update filtered influencers when filter or influencers change
  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredInfluencers(influencers);
    } else {
      setFilteredInfluencers(
        influencers.filter((influencer) => influencer.status === statusFilter)
      );
    }
  }, [statusFilter, influencers]);

  // Handle search
  const handleSearch = (searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    if (!term) {
      setFilteredInfluencers(influencers);
    } else {
      setFilteredInfluencers(
        influencers.filter(
          (inf) =>
            inf.username.toLowerCase().includes(term) ||
            inf.status.toLowerCase().includes(term) ||
            inf.platform.toLowerCase().includes(term)
        )
      );
    }
  };

  // Update influencer status
  const updateStatus = (id: string, newStatus: Status) => {
    const updatedInfluencers = influencers.map((influencer) =>
      influencer.id === id ? { ...influencer, status: newStatus } : influencer
    );
    setInfluencers(updatedInfluencers);
    localStorage.setItem("influencers", JSON.stringify(updatedInfluencers));
  };

  // Add new video to an existing influencer
  const addVideoToInfluencer = (influencerId: string) => {
    // Find the influencer
    const influencer = influencers.find((inf) => inf.id === influencerId);
    if (!influencer) return;

    // Find the first empty video slot
    let emptyVideoSlot: number | null = null;
    for (let i = 1; i <= 4; i++) {
      const videoKey = `video${i}` as keyof typeof influencer.videos;
      if (!influencer.videos[videoKey].link) {
        emptyVideoSlot = i;
        break;
      }
    }

    // If no empty slot, show an alert
    if (emptyVideoSlot === null) {
      alert(
        "This influencer already has 4 videos. Please update an existing video instead."
      );
      return;
    }

    // Set up state for the new video form
    setEditingVideo({
      influencerId,
      videoNumber: emptyVideoSlot,
      videoData: { link: "", postedOn: "", views: 0 },
    });
    setIsVideoFormOpen(true);
  };

  // Handle video data changes
  const handleVideoChange = (
    field: keyof VideoData,
    value: string | number
  ) => {
    if (!editingVideo) return;
    setEditingVideo({
      ...editingVideo,
      videoData: {
        ...editingVideo.videoData,
        [field]: value,
      },
    });
  };

  // Save the new video
  const saveNewVideo = () => {
    if (!editingVideo) return;

    const { influencerId, videoNumber, videoData } = editingVideo;

    const updatedInfluencers = influencers.map((influencer) => {
      if (influencer.id === influencerId) {
        const videoKey =
          `video${videoNumber}` as keyof typeof influencer.videos;

        // Calculate new viewsNow
        const newViewsNow = influencer.viewsNow + videoData.views;

        return {
          ...influencer,
          videos: {
            ...influencer.videos,
            [videoKey]: videoData,
          },
          viewsNow: newViewsNow,
        };
      }
      return influencer;
    });

    setInfluencers(updatedInfluencers);
    localStorage.setItem("influencers", JSON.stringify(updatedInfluencers));
    setIsVideoFormOpen(false);
    setEditingVideo(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-8">
      <Card className="max-w-[1200px] mx-auto overflow-hidden">
        <DashboardHeader
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onSearch={handleSearch}
          isFormOpen={isFormOpen}
          setIsFormOpen={setIsFormOpen}
        />
        <DashboardStats influencers={influencers} />
        <InfluencerTable
          influencers={filteredInfluencers}
          onProfileClick={(influencer) => {
            setSelectedInfluencer(influencer);
            setIsProfileModalOpen(true);
          }}
          onStatusChange={updateStatus}
          onAddVideo={addVideoToInfluencer}
        />
      </Card>

      {selectedInfluencer && (
        <ProfileLinksModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          username={selectedInfluencer.username}
          profileLink={selectedInfluencer.profileLink}
          platform={selectedInfluencer.platform}
        />
      )}

      {editingVideo && (
        <Dialog open={isVideoFormOpen} onOpenChange={setIsVideoFormOpen}>
          <AddVideoDialog
            videoData={editingVideo.videoData}
            onVideoChange={handleVideoChange}
            onSave={saveNewVideo}
            onClose={() => setIsVideoFormOpen(false)}
          />
        </Dialog>
      )}
    </main>
  );
}
