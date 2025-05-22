export interface Video {
  id: 1 | 2 | 3 | 4;
  link: string;
  postedOn: string;
  views?: number;
  status: "script" | "approve" | "posted";
}

export interface Influencer {
  id: string;
  username: string;
  tiktokUsername?: string;
  platform: "Instagram" | "TikTok" | "Both";
  viewsMedian: number;
  viewsTotal: number;
  viewsNow: number;
  videos: Video[];
  paid: boolean;
}

export interface FormState {
  username: string;
  tiktokUsername?: string;
  platform: "Instagram" | "TikTok" | "Both";
  viewsMedian: string;
  viewsNow: string;
  sameUsername?: boolean;
  videos: {
    link: string;
    postedOn: string;
    views?: string;
    status: "script" | "approve" | "posted";
  }[];
}

export interface StatusInfo {
  text: string;
  className: string;
} 