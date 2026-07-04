import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  className?: string;
}

export function StarRating({ rating, maxStars = 5, className }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxStars }).map((_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= rating;

        return (
          <Star
            key={index}
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              isFilled ? "fill-gold-500 text-gold-500" : "text-sage-200 fill-none"
            )}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}
