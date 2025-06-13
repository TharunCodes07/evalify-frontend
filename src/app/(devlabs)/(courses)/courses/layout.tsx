import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CoursesLayout({
  student,
  faculty,
}: {
  student: React.ReactNode;
  faculty: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return redirect("/login");
  }

  const role = user?.role;

  if (role === "STUDENT") {
    return <>{student}</>;
  }

  if (role === "FACULTY" || role === "MANAGER" || role === "ADMIN") {
    return <>{faculty}</>;
  }

  return <div>Unauthorized</div>;
}
