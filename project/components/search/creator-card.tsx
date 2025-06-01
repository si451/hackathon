import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export interface CreatorProps {
  id: string;
  name: string;
  handle: string;
  image: string;
  platforms: string[];
  niche: string;
  followers: string;
  engagementRate: string;
  location: string;
}

export function CreatorCard({
  id,
  name,
  handle,
  image,
  platforms,
  niche,
  followers,
  engagementRate,
  location,
}: CreatorProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-full">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm text-muted-foreground">@{handle}</p>
            </div>
          </div>
          <div className="flex gap-1">
            {platforms.map((platform) => (
              <span
                key={platform}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs"
                title={platform}
              >
                {platform.charAt(0)}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm font-medium">{followers}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div>
            <p className="text-sm font-medium">{engagementRate}</p>
            <p className="text-xs text-muted-foreground">Engagement</p>
          </div>
          <div>
            <p className="text-sm font-medium">{location}</p>
            <p className="text-xs text-muted-foreground">Location</p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
            {niche}
          </p>
        </div>
        
        <div className="mt-4 flex items-center justify-between gap-2">
          <Link href={`/creator/${id}`} className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1">
            View profile <ExternalLink className="h-3 w-3" />
          </Link>
          <Link href={`/messages/new?creator=${id}`}>
            <Button
              size="sm"
              className="bg-[#00FFFF] text-black hover:bg-[#00DDDD]"
            >
              Start Negotiation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}