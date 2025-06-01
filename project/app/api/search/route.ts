import { NextResponse } from 'next/server';
import youtubeMockData from '../../../data/mock_youtube_influencers.json';
import instagramMockData from '../../../data/mock_instagram_influencers.json';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    // Combine and search through mock data
    const allCreators = [
      ...(youtubeMockData.youtube_influencers || []),
      ...(instagramMockData.instagram_influencers || [])
    ];

    // Simple search implementation
    const searchResults = allCreators.filter(creator => {
      const searchTerms: string[] = query.toLowerCase().split(' ');
      const creatorText = `
        ${creator.username.toLowerCase()}
        ${creator.description.toLowerCase()}
        ${creator.niche.toLowerCase()}
        ${creator.location.toLowerCase()}
      `;

      return searchTerms.every((term: string) => creatorText.includes(term));
    });

    // Limit to 9 results per platform
    const youtubeResults = searchResults
      .filter(creator => creator.platform === "YouTube")
      .slice(0, 9);
    
    const instagramResults = searchResults
      .filter(creator => creator.platform === "Instagram")
      .slice(0, 9);

    return NextResponse.json({
      results: [...youtubeResults, ...instagramResults]
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to process search request' },
      { status: 500 }
    );
  }
} 