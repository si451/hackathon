"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface SearchFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  platforms: string[];
  niches: string[];
  followers: [number, number];
  engagement: [number, number];
  locations: string[];
}

const INITIAL_FILTERS: FilterState = {
  platforms: [],
  niches: [],
  followers: [0, 1000000],
  engagement: [0, 10],
  locations: [],
};

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // Check if any filters are active
  useEffect(() => {
    const isActive = 
      filters.platforms.length > 0 ||
      filters.niches.length > 0 ||
      filters.locations.length > 0 ||
      filters.followers[0] !== INITIAL_FILTERS.followers[0] ||
      filters.followers[1] !== INITIAL_FILTERS.followers[1] ||
      filters.engagement[0] !== INITIAL_FILTERS.engagement[0] ||
      filters.engagement[1] !== INITIAL_FILTERS.engagement[1];
    
    setHasActiveFilters(isActive);
  }, [filters]);

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
    onFilterChange(INITIAL_FILTERS);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
              onClick={handleReset}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
              <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Platforms */}
        <div className="space-y-3">
          <Label>Platforms</Label>
          <div className="space-y-2">
            {["Instagram", "YouTube", "TikTok", "Twitter"].map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                  id={platform}
                      checked={filters.platforms.includes(platform)}
                  onCheckedChange={(checked) => {
                    const newPlatforms = checked
                      ? [...filters.platforms, platform]
                      : filters.platforms.filter((p) => p !== platform);
                    handleFilterChange({ ...filters, platforms: newPlatforms });
                  }}
                    />
                <Label htmlFor={platform} className="text-sm font-normal">
                      {platform}
                    </Label>
                  </div>
                ))}
              </div>
        </div>

        {/* Niches */}
        <div className="space-y-3">
          <Label>Niches</Label>
          <div className="space-y-2">
            {["Fashion", "Beauty", "Lifestyle", "Tech", "Food", "Travel"].map((niche) => (
                  <div key={niche} className="flex items-center space-x-2">
                    <Checkbox
                  id={niche}
                      checked={filters.niches.includes(niche)}
                  onCheckedChange={(checked) => {
                    const newNiches = checked
                      ? [...filters.niches, niche]
                      : filters.niches.filter((n) => n !== niche);
                    handleFilterChange({ ...filters, niches: newNiches });
                  }}
                    />
                <Label htmlFor={niche} className="text-sm font-normal">
                      {niche}
                    </Label>
                  </div>
                ))}
              </div>
        </div>

        {/* Followers Range */}
        <div className="space-y-3">
          <Label>Followers Range</Label>
          <div className="space-y-4">
            <Slider
              min={0}
              max={1000000}
              step={10000}
              value={filters.followers}
              onValueChange={(value) => handleFilterChange({ ...filters, followers: value as [number, number] })}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.followers[0].toLocaleString()}</span>
              <span>{filters.followers[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
          
        {/* Engagement Rate */}
        <div className="space-y-3">
          <Label>Engagement Rate</Label>
              <div className="space-y-4">
                <Slider
                  min={0}
                  max={10}
                  step={0.1}
              value={filters.engagement}
              onValueChange={(value) => handleFilterChange({ ...filters, engagement: value as [number, number] })}
                />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.engagement[0]}%</span>
              <span>{filters.engagement[1]}%</span>
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="space-y-3">
          <Label>Locations</Label>
          <div className="space-y-2">
            {["New York", "Los Angeles", "London", "Tokyo", "Paris"].map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={location}
                  checked={filters.locations.includes(location)}
                  onCheckedChange={(checked) => {
                    const newLocations = checked
                      ? [...filters.locations, location]
                      : filters.locations.filter((l) => l !== location);
                    handleFilterChange({ ...filters, locations: newLocations });
                  }}
                />
                <Label htmlFor={location} className="text-sm font-normal">
                  {location}
                </Label>
              </div>
            ))}
      </div>
    </div>
      </CardContent>
    </Card>
  );
}