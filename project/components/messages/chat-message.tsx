import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";

export interface MessageProps {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    initials: string;
  };
  timestamp: string;
  isAI?: boolean;
  isSelf?: boolean;
}

export function ChatMessage({
  content,
  sender,
  timestamp,
  isAI = false,
  isSelf = false,
}: MessageProps) {
  return (
    <div
      className={cn(
        "flex w-full gap-3 py-2",
        isSelf && "flex-row-reverse"
      )}
    >
      <div className="flex-shrink-0">
        {isAI ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF00FF]/20">
            <Sparkles className="h-4 w-4 text-[#FF00FF]" />
          </div>
        ) : (
          <Avatar className="h-8 w-8">
            <AvatarImage src={sender.avatar} alt={sender.name} />
            <AvatarFallback>{sender.initials}</AvatarFallback>
          </Avatar>
        )}
      </div>
      
      <div className={cn("flex max-w-[75%] flex-col", isSelf && "items-end")}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {isAI ? "AI Assistant" : sender.name}
          </span>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        
        <div
          className={cn(
            "mt-1 rounded-lg px-4 py-2",
            isAI
              ? "bg-[#FF00FF]/10 text-foreground"
              : isSelf
              ? "bg-[#00FFFF]/10 text-foreground"
              : "bg-muted text-foreground"
          )}
        >
          {content}
        </div>
      </div>
    </div>
  );
}