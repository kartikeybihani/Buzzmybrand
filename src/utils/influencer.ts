import { Influencer, Video, StatusInfo } from "../types";

export const STORAGE_KEY = "influencers";

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

export const loadInfluencers = (): Influencer[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Influencer[];
  } catch (e) {
    console.warn("Failed to parse influencers from localStorage", e);
    return [];
  }
};

export const saveInfluencers = (influencers: Influencer[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(influencers));
}; 