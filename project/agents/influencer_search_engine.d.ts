export interface Influencer {
  platform: string;
  username: string;
  followers: number;
  description: string;
  url: string;
  thumbnail: string;
  engagement_rate: number;
  quality_score: number;
  niche: string;
  location: string;
  error?: boolean;
}

export class InfluencerSearchEngine {
  constructor();
  search(query: string): Promise<Influencer[]>;
} 