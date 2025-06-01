import json
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from typing import Dict, List, Any
import os
from collections import Counter

def load_data() -> Dict[str, List[Dict[str, Any]]]:
    """Load mock data from JSON files."""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(current_dir)
    
    with open(os.path.join(project_root, 'data', 'mock_youtube_influencers.json'), 'r') as f:
        youtube_data = json.load(f)
    
    with open(os.path.join(project_root, 'data', 'mock_instagram_influencers.json'), 'r') as f:
        instagram_data = json.load(f)
    
    return {
        'youtube': youtube_data['youtube_influencers'],
        'instagram': instagram_data['instagram_influencers']
    }

def analyze_follower_distribution(data: Dict[str, List[Dict[str, Any]]]):
    """Analyze and visualize follower count distribution."""
    plt.figure(figsize=(15, 10))
    
    # Create subplots
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))
    
    # YouTube distribution
    youtube_followers = [creator['followers'] for creator in data['youtube']]
    sns.histplot(youtube_followers, bins=50, ax=ax1, color='red')
    ax1.set_title('YouTube Follower Distribution')
    ax1.set_xlabel('Followers')
    ax1.set_ylabel('Count')
    
    # Instagram distribution
    instagram_followers = [creator['followers'] for creator in data['instagram']]
    sns.histplot(instagram_followers, bins=50, ax=ax2, color='purple')
    ax2.set_title('Instagram Follower Distribution')
    ax2.set_xlabel('Followers')
    ax2.set_ylabel('Count')
    
    plt.tight_layout()
    plt.savefig('follower_distribution.png')
    plt.close()

def analyze_engagement_rates(data: Dict[str, List[Dict[str, Any]]]):
    """Analyze engagement rates across platforms."""
    plt.figure(figsize=(12, 6))
    
    youtube_engagement = [creator['engagement_rate'] for creator in data['youtube']]
    instagram_engagement = [creator['engagement_rate'] for creator in data['instagram']]
    
    plt.boxplot([youtube_engagement, instagram_engagement], 
                labels=['YouTube', 'Instagram'],
                patch_artist=True)
    plt.title('Engagement Rate Distribution by Platform')
    plt.ylabel('Engagement Rate (%)')
    plt.savefig('engagement_rates.png')
    plt.close()

def analyze_niches(data: Dict[str, List[Dict[str, Any]]]):
    """Analyze niche distribution across platforms."""
    youtube_niches = Counter(creator['niche'] for creator in data['youtube'])
    instagram_niches = Counter(creator['niche'] for creator in data['instagram'])
    
    # Create DataFrame for visualization
    niches_df = pd.DataFrame({
        'Niche': list(set(youtube_niches.keys()) | set(instagram_niches.keys())),
        'YouTube': [youtube_niches[niche] for niche in list(set(youtube_niches.keys()) | set(instagram_niches.keys()))],
        'Instagram': [instagram_niches[niche] for niche in list(set(youtube_niches.keys()) | set(instagram_niches.keys()))]
    })
    
    plt.figure(figsize=(15, 8))
    niches_df.set_index('Niche').plot(kind='bar', stacked=True)
    plt.title('Niche Distribution Across Platforms')
    plt.xlabel('Niche')
    plt.ylabel('Number of Creators')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig('niche_distribution.png')
    plt.close()

def analyze_locations(data: Dict[str, List[Dict[str, Any]]]):
    """Analyze location distribution across platforms."""
    youtube_locations = Counter(creator['location'] for creator in data['youtube'])
    instagram_locations = Counter(creator['location'] for creator in data['instagram'])
    
    # Create DataFrame for visualization
    locations_df = pd.DataFrame({
        'Location': list(set(youtube_locations.keys()) | set(instagram_locations.keys())),
        'YouTube': [youtube_locations[loc] for loc in list(set(youtube_locations.keys()) | set(instagram_locations.keys()))],
        'Instagram': [instagram_locations[loc] for loc in list(set(youtube_locations.keys()) | set(instagram_locations.keys()))]
    })
    
    plt.figure(figsize=(15, 8))
    locations_df.set_index('Location').plot(kind='bar', stacked=True)
    plt.title('Location Distribution Across Platforms')
    plt.xlabel('Location')
    plt.ylabel('Number of Creators')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig('location_distribution.png')
    plt.close()

def print_summary_statistics(data: Dict[str, List[Dict[str, Any]]]):
    """Print summary statistics for both platforms."""
    print("\n=== Summary Statistics ===\n")
    
    for platform in ['youtube', 'instagram']:
        creators = data[platform]
        followers = [creator['followers'] for creator in creators]
        engagement = [creator['engagement_rate'] for creator in creators]
        quality = [creator['quality_score'] for creator in creators]
        
        print(f"\n{platform.upper()} STATISTICS:")
        print(f"Total Creators: {len(creators)}")
        print(f"Follower Statistics:")
        print(f"  - Min: {min(followers):,}")
        print(f"  - Max: {max(followers):,}")
        print(f"  - Mean: {sum(followers)/len(followers):,.2f}")
        print(f"  - Median: {sorted(followers)[len(followers)//2]:,}")
        
        print(f"\nEngagement Rate Statistics:")
        print(f"  - Min: {min(engagement):.1f}%")
        print(f"  - Max: {max(engagement):.1f}%")
        print(f"  - Mean: {sum(engagement)/len(engagement):.1f}%")
        print(f"  - Median: {sorted(engagement)[len(engagement)//2]:.1f}%")
        
        print(f"\nQuality Score Statistics:")
        print(f"  - Min: {min(quality)}")
        print(f"  - Max: {max(quality)}")
        print(f"  - Mean: {sum(quality)/len(quality):.1f}")
        print(f"  - Median: {sorted(quality)[len(quality)//2]}")
        
        if platform == 'youtube':
            video_counts = [creator['video_count'] for creator in creators]
            print(f"\nVideo Count Statistics:")
            print(f"  - Min: {min(video_counts)}")
            print(f"  - Max: {max(video_counts)}")
            print(f"  - Mean: {sum(video_counts)/len(video_counts):.1f}")
            print(f"  - Median: {sorted(video_counts)[len(video_counts)//2]}")
        else:
            post_counts = [creator['post_count'] for creator in creators]
            print(f"\nPost Count Statistics:")
            print(f"  - Min: {min(post_counts)}")
            print(f"  - Max: {max(post_counts)}")
            print(f"  - Mean: {sum(post_counts)/len(post_counts):.1f}")
            print(f"  - Median: {sorted(post_counts)[len(post_counts)//2]}")

def analyze_correlation(data: Dict[str, List[Dict[str, Any]]]):
    """Analyze correlation between different metrics."""
    for platform in ['youtube', 'instagram']:
        creators = data[platform]
        df = pd.DataFrame(creators)
        
        # Select relevant columns for correlation
        if platform == 'youtube':
            columns = ['followers', 'engagement_rate', 'quality_score', 'video_count', 'total_views']
        else:
            columns = ['followers', 'engagement_rate', 'quality_score', 'post_count', 'total_likes']
        
        correlation = df[columns].corr()
        
        plt.figure(figsize=(10, 8))
        sns.heatmap(correlation, annot=True, cmap='coolwarm', center=0)
        plt.title(f'{platform.upper()} Metrics Correlation')
        plt.tight_layout()
        plt.savefig(f'{platform}_correlation.png')
        plt.close()

def main():
    # Load data
    data = load_data()
    
    # Create analysis directory
    os.makedirs('analysis', exist_ok=True)
    os.chdir('analysis')
    
    # Run analyses
    print("Starting data analysis...")
    
    # Generate visualizations
    analyze_follower_distribution(data)
    analyze_engagement_rates(data)
    analyze_niches(data)
    analyze_locations(data)
    analyze_correlation(data)
    
    # Print summary statistics
    print_summary_statistics(data)
    
    print("\nAnalysis complete! Check the 'analysis' directory for visualizations.")

if __name__ == "__main__":
    main() 