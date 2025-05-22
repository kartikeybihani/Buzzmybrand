import { Influencer, Video, StatusInfo } from "../types";

export const STORAGE_KEY = "influencers";

// Demo influencer for first-time users
const DEMO_INFLUENCER: Influencer = {
  id: "demo",
  username: "demo_influencer (delete me)",
  platform: "Both",
  tiktokUsername: "demo.creator",
  viewsMedian: 50000,
  viewsTotal: 250000,
  viewsNow: 100000,
  paid: false,
  videos: [
    {
      id: 1,
      link: "https://instagram.com/p/demo1",
      postedOn: "2024-03-15",
      status: "posted",
      views: 55000
    },
    {
      id: 2,
      link: "https://instagram.com/p/demo2",
      postedOn: "2024-03-20",
      status: "posted",
      views: 45000
    },
    {
      id: 3,
      link: "",
      postedOn: "",
      status: "approve",
      views: 0
    },
    {
      id: 4,
      link: "",
      postedOn: "",
      status: "script",
      views: 0
    }
  ]
};

export const getStatusColor = (status: Video["status"], isPaid: boolean = false) => {
  if (isPaid) return "bg-gray-100 text-gray-600";

  switch (status) {
    case "script":
      return "bg-red-100 text-red-800";
    case "approve":
      return "bg-yellow-100 text-yellow-800";
    case "posted":
      return "bg-green-100 text-green-800";
  }
};

export const getInfluencerStatus = (influencer: Influencer): StatusInfo => {
  if (influencer.paid) {
    return {
      text: "Paid",
      className: "bg-gray-100 text-gray-600"
    };
  }
  
  if (influencer.videos.some(v => v.status === "script")) {
    return {
      text: "Script Needed",
      className: "bg-red-100 text-red-800"
    };
  }
  
  if (influencer.videos.some(v => v.status === "approve")) {
    return {
      text: "Needs Approval",
      className: "bg-yellow-100 text-yellow-800"
    };
  }
  
  return {
    text: "Posted",
    className: "bg-green-100 text-green-800"
  };
};

export const calculateViewsNow = (videos: Video[]): number => {
  return videos.reduce((total, video) => total + (video.views || 0), 0);
};

export const loadInfluencers = (): Influencer[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed demo data only if localStorage is empty
      const demoData = [DEMO_INFLUENCER];
      saveInfluencers(demoData);
      return demoData;
    }
    
    const influencers = JSON.parse(raw) as Influencer[];
    // Update viewsNow based on video views
    return influencers.map(inf => ({
      ...inf,
      viewsNow: calculateViewsNow(inf.videos)
    }));
  } catch (e) {
    console.warn("Failed to parse influencers from localStorage", e);
    return [];
  }
};

export const saveInfluencers = (influencers: Influencer[]) => {
  if (typeof window === "undefined") return;
  // Update viewsNow before saving
  const updatedInfluencers = influencers.map(inf => ({
    ...inf,
    viewsNow: calculateViewsNow(inf.videos)
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInfluencers));
};

export const resetData = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}; 