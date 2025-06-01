export interface Influencer {
  platform: "YouTube" | "Instagram";
  username: string;
  followers: number;
  description: string;
  url: string;
  thumbnail: string;
  engagement_rate: number;
  niche: string;
  location: string;
  quality_score: number;
} 