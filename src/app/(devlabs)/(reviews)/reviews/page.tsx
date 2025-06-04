"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Review = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

export default function DevlabsReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const {data: session} = useSession();

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      const data = await response.json();
      setReviews(data);
    };

    fetchReviews();
  }, [session]);

  return (
    <div className="container py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Project Reviews</h1>
        <Link href="/reviews/create">
          <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create New Review
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex flex-col items-center justify-center text-center p-8">
          <p className="text-muted-foreground mb-4">
            {reviews.length === 0 ?  "No reviews created yet. Create your first review to get started." : 
            reviews.map((review) => (
              <div key={review.id} className="mb-4">
                <h3 className="text-lg font-semibold">{review.name}</h3>
                <p className="text-muted-foreground">{review.startDate}</p>
                <p className="text-muted-foreground">{review.endDate}</p>
              </div>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
