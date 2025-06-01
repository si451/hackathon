import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, DollarSign, FileText, Clock } from "lucide-react";

interface SuggestionProps {
  title: string;
  description: string;
  onAccept: () => void;
  type: "rate" | "deliverable" | "timeline";
}

function Suggestion({
  title,
  description,
  onAccept,
  type,
}: SuggestionProps) {
  const getIcon = () => {
    switch (type) {
      case "rate":
        return <DollarSign className="h-4 w-4 text-[#00FFFF]" />;
      case "deliverable":
        return <FileText className="h-4 w-4 text-[#FF00FF]" />;
      case "timeline":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-start gap-3 rounded-lg border p-3">
      <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-muted">
        {getIcon()}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 rounded-full"
        onClick={onAccept}
      >
        <Check className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface SuggestionPanelProps {
  suggestions: {
    id: string;
    title: string;
    description: string;
    type: "rate" | "deliverable" | "timeline";
  }[];
  onSuggestionAccept: (suggestion: any) => void;
  className?: string;
}

export function SuggestionPanel({
  suggestions,
  onSuggestionAccept,
  className,
}: SuggestionPanelProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">AI Suggestions</CardTitle>
        <CardDescription className="text-xs">
          Based on market rates and the campaign requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-3">
        {suggestions.map((suggestion) => (
          <Suggestion
            key={suggestion.id}
            title={suggestion.title}
            description={suggestion.description}
            type={suggestion.type}
            onAccept={() => onSuggestionAccept(suggestion)}
          />
        ))}
      </CardContent>
    </Card>
  );
}