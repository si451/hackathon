import { Influencer } from '../types/influencer';

export class InfluencerSearchEngine {
  private static instance: InfluencerSearchEngine | null = null;
  private readonly API_URL = 'http://localhost:3001/api/search';

  private constructor() {}

  static getInstance(): InfluencerSearchEngine {
    if (!InfluencerSearchEngine.instance) {
      InfluencerSearchEngine.instance = new InfluencerSearchEngine();
    }
    return InfluencerSearchEngine.instance;
  }

  async search(query: string): Promise<Influencer[]> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }
} 