import json
import random
from typing import List, Dict, Any
import os
import requests
from PIL import Image
from io import BytesIO
import time

# Constants for data generation
NICHES = [
    "tech", "gaming", "fitness", "travel", "food", "fashion", "beauty",
    "music", "education", "business", "lifestyle", "sports", "art",
    "photography", "comedy", "news", "science", "health", "automotive",
    "entertainment"
]

LOCATIONS = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany",
    "France", "Japan", "South Korea", "Brazil", "India", "Spain",
    "Italy", "Mexico", "Netherlands", "Sweden"
]

# Specific image queries for each niche
NICHE_IMAGE_QUERIES = {
    "tech": ["tech influencer portrait", "tech professional", "software developer", "tech entrepreneur", "tech expert"],
    "gaming": ["gaming streamer", "gaming content creator", "esports player", "gaming personality", "gaming influencer"],
    "fitness": ["fitness trainer", "fitness influencer", "personal trainer", "fitness model", "athlete"],
    "travel": ["travel blogger", "travel influencer", "travel photographer", "adventure seeker", "travel content creator"],
    "food": ["food blogger", "chef", "food influencer", "culinary expert", "food content creator"],
    "fashion": ["fashion blogger", "fashion model", "fashion influencer", "style expert", "fashion content creator"],
    "beauty": ["beauty influencer", "makeup artist", "beauty blogger", "skincare expert", "beauty content creator"],
    "music": ["musician", "music producer", "singer", "band member", "music artist"],
    "education": ["teacher", "professor", "educator", "academic", "education expert"],
    "business": ["entrepreneur", "business professional", "executive", "business leader", "startup founder"],
    "lifestyle": ["lifestyle blogger", "lifestyle influencer", "wellness expert", "lifestyle content creator", "life coach"],
    "sports": ["athlete", "sports player", "sports personality", "sports expert", "sports content creator"],
    "art": ["artist", "creative professional", "art influencer", "designer", "art content creator"],
    "photography": ["photographer", "photo artist", "camera expert", "photo influencer", "photography content creator"],
    "comedy": ["comedian", "comedy performer", "funny person", "comedy content creator", "entertainer"],
    "news": ["journalist", "news anchor", "reporter", "media personality", "news content creator"],
    "science": ["scientist", "researcher", "science educator", "science communicator", "science content creator"],
    "health": ["health expert", "doctor", "health influencer", "wellness coach", "health content creator"],
    "automotive": ["car enthusiast", "auto expert", "automotive influencer", "car reviewer", "auto content creator"],
    "entertainment": ["entertainer", "performer", "content creator", "media personality", "entertainment expert"]
}

# Unsplash API configuration
UNSPLASH_ACCESS_KEY = "G3gaIvYM5iashicZUhuHMco2FxMk6-anP8JV4WpxzBY"
UNSPLASH_API_URL = "https://api.unsplash.com/photos/random"

def get_profile_picture(niche: str, index: int) -> str:
    """Get a profile picture URL based on the niche."""
    try:
        # Get specific image queries for the niche
        queries = NICHE_IMAGE_QUERIES.get(niche, ["professional portrait"])
        query = random.choice(queries)
        
        # Query Unsplash for a relevant image
        params = {
            'query': query,
            'orientation': 'portrait',
            'count': 1,
            'content_filter': 'high',  # Get high-quality images
            'order_by': 'relevant'  # Get most relevant images
        }
        headers = {
            'Authorization': f'Client-ID {UNSPLASH_ACCESS_KEY}'
        }
        
        response = requests.get(UNSPLASH_API_URL, params=params, headers=headers)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                return data[0]['urls']['regular']
    except Exception as e:
        print(f"Error fetching from Unsplash: {e}")
    
    # Fallback to a default professional portrait if Unsplash fails
    return f"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"

def generate_follower_count() -> int:
    """Generate a balanced distribution of follower counts."""
    # 20% micro-influencers (1K-10K)
    # 30% small influencers (10K-100K)
    # 25% medium influencers (100K-500K)
    # 15% large influencers (500K-1M)
    # 10% mega influencers (1M+)
    distribution = random.random()
    if distribution < 0.2:
        return random.randint(1000, 10000)
    elif distribution < 0.5:
        return random.randint(10000, 100000)
    elif distribution < 0.75:
        return random.randint(100000, 500000)
    elif distribution < 0.9:
        return random.randint(500000, 1000000)
    else:
        return random.randint(1000000, 10000000)

def generate_engagement_rate(followers: int) -> float:
    """Generate realistic engagement rate based on follower count."""
    # Higher engagement for smaller accounts
    if followers < 10000:
        return round(random.uniform(5.0, 10.0), 1)
    elif followers < 100000:
        return round(random.uniform(3.0, 7.0), 1)
    elif followers < 500000:
        return round(random.uniform(2.0, 5.0), 1)
    elif followers < 1000000:
        return round(random.uniform(1.5, 3.0), 1)
    else:
        return round(random.uniform(1.0, 2.5), 1)

def generate_quality_score(followers: int, engagement_rate: float) -> int:
    """Generate quality score based on followers and engagement."""
    base_score = min(100, int((followers / 1000000) * 50 + (engagement_rate * 10)))
    return min(100, max(50, base_score + random.randint(-10, 10)))

def generate_youtube_profile(index: int) -> Dict[str, Any]:
    """Generate a YouTube creator profile."""
    followers = generate_follower_count()
    engagement_rate = generate_engagement_rate(followers)
    quality_score = generate_quality_score(followers, engagement_rate)
    niche = random.choice(NICHES)
    
    return {
        "platform": "YouTube",
        "username": f"YouTuber{index}",
        "followers": followers,
        "description": f"Creating amazing content about {niche}! Join our community of {format_number(followers)} subscribers.",
        "url": f"https://youtube.com/c/YouTuber{index}",
        "thumbnail": get_profile_picture(niche, index),
        "engagement_rate": engagement_rate,
        "video_count": random.randint(50, 1000),
        "total_views": int(followers * random.uniform(2, 10)),
        "quality_score": quality_score,
        "niche": niche,
        "location": random.choice(LOCATIONS),
        "subscriber_growth_rate": round(random.uniform(1.0, 10.0), 1),
        "average_views_per_video": int(followers * random.uniform(0.1, 0.5)),
        "upload_frequency": f"{random.randint(1, 7)} videos per week"
    }

def generate_instagram_profile(index: int) -> Dict[str, Any]:
    """Generate an Instagram creator profile."""
    followers = generate_follower_count()
    engagement_rate = generate_engagement_rate(followers)
    quality_score = generate_quality_score(followers, engagement_rate)
    niche = random.choice(NICHES)
    
    return {
        "platform": "Instagram",
        "username": f"Instagrammer{index}",
        "followers": followers,
        "description": f"Sharing {niche} content with {format_number(followers)} followers!",
        "url": f"https://instagram.com/instagrammer{index}",
        "thumbnail": get_profile_picture(niche, index),
        "engagement_rate": engagement_rate,
        "post_count": random.randint(100, 2000),
        "total_likes": int(followers * random.uniform(0.5, 2.0)),
        "quality_score": quality_score,
        "niche": niche,
        "location": random.choice(LOCATIONS),
        "follower_growth_rate": round(random.uniform(1.0, 8.0), 1),
        "average_likes_per_post": int(followers * random.uniform(0.05, 0.2)),
        "post_frequency": f"{random.randint(1, 5)} posts per week"
    }

def format_number(num: int) -> str:
    """Format number with K/M suffix."""
    if num >= 1000000:
        return f"{num/1000000:.1f}M"
    elif num >= 1000:
        return f"{num/1000:.1f}K"
    return str(num)

def generate_mock_data():
    """Generate 1000 profiles for each platform."""
    print("Generating mock data with profile pictures...")
    
    youtube_profiles = []
    instagram_profiles = []
    
    # Generate profiles with rate limiting for API calls
    for i in range(1000):
        print(f"Generating profile {i+1}/1000...")
        youtube_profiles.append(generate_youtube_profile(i))
        instagram_profiles.append(generate_instagram_profile(i))
        time.sleep(0.1)  # Rate limiting for API calls
    
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    
    # Save YouTube data
    with open('data/mock_youtube_influencers.json', 'w') as f:
        json.dump({"youtube_influencers": youtube_profiles}, f, indent=2)
    
    # Save Instagram data
    with open('data/mock_instagram_influencers.json', 'w') as f:
        json.dump({"instagram_influencers": instagram_profiles}, f, indent=2)
    
    print("Generated 1000 YouTube profiles and 1000 Instagram profiles")
    print(f"Follower count distribution in YouTube profiles:")
    print_distribution([p['followers'] for p in youtube_profiles])
    print(f"\nFollower count distribution in Instagram profiles:")
    print_distribution([p['followers'] for p in instagram_profiles])

def print_distribution(followers: List[int]):
    """Print the distribution of follower counts."""
    ranges = [
        (0, 10000, "1K-10K"),
        (10000, 100000, "10K-100K"),
        (100000, 500000, "100K-500K"),
        (500000, 1000000, "500K-1M"),
        (1000000, float('inf'), "1M+")
    ]
    
    for min_f, max_f, label in ranges:
        count = sum(1 for f in followers if min_f <= f < max_f)
        percentage = (count / len(followers)) * 100
        print(f"{label}: {count} profiles ({percentage:.1f}%)")

def update_existing_data():
    """Update existing mock data with profile pictures."""
    print("Updating existing mock data with profile pictures...")
    
    # Load existing data
    with open('data/mock_youtube_influencers.json', 'r') as f:
        youtube_data = json.load(f)
    
    with open('data/mock_instagram_influencers.json', 'r') as f:
        instagram_data = json.load(f)
    
    # Update YouTube profiles
    for i, profile in enumerate(youtube_data['youtube_influencers']):
        print(f"Updating YouTube profile {i+1}/{len(youtube_data['youtube_influencers'])}...")
        profile['thumbnail'] = get_profile_picture(profile['niche'], i)
        time.sleep(0.1)  # Rate limiting for API calls
    
    # Update Instagram profiles
    for i, profile in enumerate(instagram_data['instagram_influencers']):
        print(f"Updating Instagram profile {i+1}/{len(instagram_data['instagram_influencers'])}...")
        profile['thumbnail'] = get_profile_picture(profile['niche'], i)
        time.sleep(0.1)  # Rate limiting for API calls
    
    # Save updated data
    with open('data/mock_youtube_influencers.json', 'w') as f:
        json.dump(youtube_data, f, indent=2)
    
    with open('data/mock_instagram_influencers.json', 'w') as f:
        json.dump(instagram_data, f, indent=2)
    
    print("Successfully updated all profiles with new profile pictures!")

if __name__ == "__main__":
    update_existing_data() 