import os
import json
import autogen
from typing import List, Dict, Any
from dotenv import load_dotenv
import groq

# Load environment variables
load_dotenv()

__all__ = ['InfluencerSearchEngine']

class InfluencerSearchEngine:
    def __init__(self):
        # Initialize Groq client
        self.groq_api_key = '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'
        if not self.groq_api_key:
            raise ValueError("Groq API key not found in environment variables")
            
        self.groq_client = groq.Groq(api_key=self.groq_api_key)
        
        # Load mock data
        self.load_mock_data()
        
        # Initialize AutoGen assistant with Groq
        self.assistant = autogen.AssistantAgent(
            name="InfluencerSearchEngine",
            llm_config={
                "config_list": [{
                    "model": "llama-3.3-70b-versatile",
                    "api_key": self.groq_api_key,
                    "base_url": "https://api.groq.com/v1",
                    "api_type": "groq"
                }],
                "temperature": 0.7,
            },
            system_message="""You are an Influencer Search Engine agent that helps find relevant influencers 
            based on natural language queries. You can search both YouTube and Instagram platforms."""
        )

    def load_mock_data(self):
        """Load mock data from JSON files."""
        try:
            # Load YouTube mock data
            with open('data/mock_youtube_influencers.json', 'r') as f:
                self.youtube_influencers = json.load(f)['youtube_influencers']
            
            # Load Instagram mock data
            with open('data/mock_instagram_influencers.json', 'r') as f:
                self.instagram_influencers = json.load(f)['instagram_influencers']
        except Exception as e:
            print(f"Error loading mock data: {str(e)}")
            self.youtube_influencers = []
            self.instagram_influencers = []

    def parse_query(self, query: str) -> Dict[str, Any]:
        """Parse natural language query to extract search parameters."""
        try:
            print("[DEBUG] Calling Groq API for query parsing...")
            # Use Groq directly for query parsing
            completion = self.groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "system",
                        "content": """You are a query parser that extracts parameters from influencer search queries. 
                        Return only valid JSON with the following structure:
                        {
                            \"platform\": \"both\" | \"youtube\" | \"instagram\",
                            \"followers\": {
                                \"min\": number,
                                \"max\": number
                            },
                            \"niche\": string | null,
                            \"location\": string | null
                        }"""
                    },
                    {
                        "role": "user",
                        "content": f"""Parse this influencer search query and extract the following parameters:
                        - Platform (Instagram/YouTube)
                        - Minimum and maximum follower count
                        - Niche/topic
                        - Location (if specified)
                        Query: {query}
                        Return the parameters in JSON format."""
                    }
                ],
                temperature=0.7,
                max_tokens=500
            )
            print(f"[DEBUG] Groq API response: {completion}")
            response = completion.choices[0].message.content
            
            # Clean up the response by removing markdown code block formatting
            response = response.replace('```json', '').replace('```', '').strip()
            print(f"[DEBUG] Groq API parsed content: {response}")
            
            return json.loads(response)
        except Exception as e:
            print(f"Error parsing query: {str(e)}")
            return {
                "platform": "both",
                "followers": {"min": 0, "max": float('inf')},
                "niche": None,
                "location": None
            }

    def search_youtube(self, params: Dict[str, Any], creators: List[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Search YouTube channels based on parameters."""
        try:
            filtered_influencers = []
            influencers_to_search = creators if creators else self.youtube_influencers
            
            for influencer in influencers_to_search:
                # Check follower count
                min_followers = params['followers'].get('min', 0)
                max_followers = params['followers'].get('max')
                
                meets_follower_criteria = influencer['followers'] >= min_followers
                if max_followers is not None:
                    meets_follower_criteria = meets_follower_criteria and influencer['followers'] <= max_followers
                
                # Check niche
                niche_matches = True
                if params.get('niche'):
                    niche_matches = params['niche'].lower() in influencer['niche'].lower()
                
                # Check location
                location_matches = True
                if params.get('location'):
                    location_matches = params['location'].lower() in influencer['location'].lower()
                
                if meets_follower_criteria and niche_matches and location_matches:
                    filtered_influencers.append(influencer)
            
            # Sort by quality score, then engagement rate, then followers
            filtered_influencers.sort(key=lambda x: (x['quality_score'], x['engagement_rate'], x['followers']), reverse=True)
            
            return filtered_influencers  # Return all matching results
            
        except Exception as e:
            print(f"Error searching YouTube data: {str(e)}")
            return []

    def search_instagram(self, params: Dict[str, Any], creators: List[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Search Instagram profiles based on parameters."""
        try:
            filtered_influencers = []
            influencers_to_search = creators if creators else self.instagram_influencers
            
            for influencer in influencers_to_search:
                # Check follower count
                min_followers = params['followers'].get('min', 0)
                max_followers = params['followers'].get('max')
                
                meets_follower_criteria = influencer['followers'] >= min_followers
                if max_followers is not None:
                    meets_follower_criteria = meets_follower_criteria and influencer['followers'] <= max_followers
                
                # Check niche
                niche_matches = True
                if params.get('niche'):
                    niche_matches = params['niche'].lower() in influencer['niche'].lower()
                
                # Check location
                location_matches = True
                if params.get('location'):
                    location_matches = params['location'].lower() in influencer['location'].lower()
                
                if meets_follower_criteria and niche_matches and location_matches:
                    filtered_influencers.append(influencer)
            
            # Sort by quality score, then engagement rate, then followers
            filtered_influencers.sort(key=lambda x: (x['quality_score'], x['engagement_rate'], x['followers']), reverse=True)
            
            return filtered_influencers  # Return all matching results
            
        except Exception as e:
            print(f"Error searching Instagram data: {str(e)}")
            return []

    def search(self, query: str, creators: List[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Main search method that handles both platforms."""
        try:
            # Parse the query
            params = self.parse_query(query)
            
            results = []
            
            # If creators list is provided, use it instead of loading from mock data
            if creators:
                # Filter creators based on platform
                youtube_creators = [c for c in creators if c['platform'] == 'YouTube']
                instagram_creators = [c for c in creators if c['platform'] == 'Instagram']
            else:
                # Use mock data if no creators list provided
                youtube_creators = self.youtube_influencers
                instagram_creators = self.instagram_influencers
            
            # Search based on platform preference
            if params['platform'] in ['both', 'youtube']:
                youtube_results = self.search_youtube(params, youtube_creators)
                results.extend(youtube_results)
            
            if params['platform'] in ['both', 'instagram']:
                instagram_results = self.search_instagram(params, instagram_creators)
                results.extend(instagram_results)
            
            return results
            
        except Exception as e:
            print(f"Error in search: {str(e)}")
            return []

# Example usage
if __name__ == "__main__":
    search_engine = InfluencerSearchEngine()
    results = search_engine.search("Show me tech YouTubers with over 1 million subscribers")
    print(json.dumps(results, indent=2)) 