export type Platform = "Instagram" | "TikTok" | "Instagram + TikTok";

export type Status =
  | "Posted"
  | "Script needed"
  | "Approve needed"
  | "Draft requested"
  | "In progress"
  | "Script is ready";

export interface VideoData {
  link: string;
  postedOn: string;
  views: number;
}

export interface Influencer {
  id: string;
  username: string;
  profileLink: string;
  platform: Platform;
  viewsMedian: number;
  totalViews: number;
  viewsNow: number;
  videos: {
    video1: VideoData;
    video2: VideoData;
    video3: VideoData;
    video4: VideoData;
  };
  status: Status;
}
