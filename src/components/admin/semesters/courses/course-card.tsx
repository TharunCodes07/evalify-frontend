import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Course } from "@/types/types";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{course.name}</CardTitle>
        <CardDescription>{course.code}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{course.description}</p>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
