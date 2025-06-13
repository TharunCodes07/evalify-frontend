"use client";

import { StudentCourse } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StudentCourseCardProps {
  course: StudentCourse;
}

const getScoreColor = (score: number) => {
  if (score >= 90) return "bg-green-500";
  if (score >= 80) return "bg-yellow-500";
  if (score >= 70) return "bg-orange-500";
  return "bg-red-500";
};

export const StudentCourseCard = ({ course }: StudentCourseCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{course.name}</span>
          <Badge variant="outline">{course.code}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{course.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-700">Reviews</p>
            <p className="text-lg font-bold">{course.reviewCount}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">Average Score</p>
            <p
              className={`text-lg font-bold text-white px-2 py-1 rounded ${getScoreColor(
                course.averageScorePercentage
              )}`}
            >
              {course.averageScorePercentage.toFixed(2)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
