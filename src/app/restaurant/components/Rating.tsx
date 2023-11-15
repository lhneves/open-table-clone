import Stars from "@/app/components/Stars";
import { calculateReviewRatingAvg } from "@/utils/calculateReviewRatingAvg";
import { Review } from "@prisma/client";
import React from "react";

interface RatingProps {
  reviews: Review[];
}

export default function Rating({ reviews }: RatingProps) {
  return (
    <div className="flex items-end">
      <div className="ratings mt-2 flex items-center">
        <Stars reviews={reviews} />
        <p className="text-reg ml-3">
          {calculateReviewRatingAvg(reviews).toFixed(1)}
        </p>
      </div>
      <div>
        <p className="text-reg ml-4">
          {reviews.length} Review{reviews.length === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}
