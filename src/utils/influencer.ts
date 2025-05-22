import { Influencer, Video, StatusInfo } from "../types";

const STORAGE_KEY = "influencers";
const DEMO_FLAG_KEY = "influencer_demo_seeded";

const getDefaultDemoData = (): Influencer[] => {
  return [
    {
      id: "demo-1",
      username: "buzzmybrand_demo",
      platform: "Both",
      tiktokUsername: "buzzmybrand",
      viewsMedian: 150000,
      viewsTotal: 750000,
      viewsNow: 487000,
      paid: false,
      videos: [
        {
          id: 1,
          link: "https://www.instagram.com/reel/demo1",
          postedOn: new Date("2024-03-01").toISOString().split('T')[0],
          views: 185000,
          status: "posted"
        },
        {
          id: 2,
          link: "https://www.tiktok.com/@buzzmybrand/demo2",
          postedOn: new Date("2024-03-10").toISOString().split('T')[0],
          views: 142000,
          status: "posted"
        },
        {
          id: 3,
          link: "https://www.instagram.com/reel/demo3",
          postedOn: new Date("2024-03-15").toISOString().split('T')[0],
          views: 160000,
          status: "posted"
        },
        {
          id: 4,
          link: "https://www.tiktok.com/@buzzmybrand/demo4",
          postedOn: "",
          views: 0,
          status: "approve"
        }
      ]
    }
  ];
};

export const getStatusColor = (
  status: "script" | "approve" | "posted",
  paid: boolean
): string => {
  if (paid) return "bg-gray-100 text-gray-800";

  switch (status) {
    case "posted":
      return "bg-green-100 text-green-800";
    case "approve":
      return "bg-yellow-100 text-yellow-800";
    case "script":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getInfluencerStatus = (influencer: Influencer): StatusInfo => {
  // Count videos in each status
  const statusCounts = influencer.videos.reduce(
    (acc, video) => {
      acc[video.status]++;
      return acc;
    },
    { script: 0, approve: 0, posted: 0 }
  );

  if (influencer.paid) {
    return {
      text: "Paid",
      className: "bg-gray-100 text-gray-800",
    };
  }

  // All videos posted
  if (statusCounts.posted === 4) {
    return {
      text: "Posted",
      className: "bg-green-100 text-green-800",
    };
  }

  // Has videos needing approval
  if (statusCounts.approve > 0) {
    return {
      text: "Needs Approval",
      className: "bg-yellow-100 text-yellow-800",
    };
  }

  // Has videos needing scripts
  return {
    text: "Script Needed",
    className: "bg-red-100 text-red-800",
  };
};

export const calculateViewsNow = (videos: Video[]): number => {
  return videos.reduce((total, video) => total + (video.views || 0), 0);
};

export const loadInfluencers = (): Influencer[] => {
  try {
    if (typeof window === "undefined") return [];

    const saved     = localStorage.getItem(STORAGE_KEY);
    const demoSeeded = localStorage.getItem(DEMO_FLAG_KEY) === "true";

    // ---------- first ever launch ----------
    if (!saved && !demoSeeded) {
      const demo = getDefaultDemoData();
      saveInfluencers(demo);
      localStorage.setItem(DEMO_FLAG_KEY, "true");   // remember we seeded
      return demo;
    }

    // ---------- normal cases ----------
    return saved ? JSON.parse(saved) : [];           // may be []
  } catch (err) {
    console.error("loadInfluencers()", err);
    return [];
  }
};


export const saveInfluencers = (influencers: Influencer[]): void => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(influencers));
  } catch (error) {
    console.error("Error saving influencers:", error);
  }
};

export const resetData = (): void => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.clear(); // Clear all data first
    const demoData = getDefaultDemoData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
    window.location.reload();
  } catch (error) {
    console.error("Error resetting data:", error);
  }
}; 