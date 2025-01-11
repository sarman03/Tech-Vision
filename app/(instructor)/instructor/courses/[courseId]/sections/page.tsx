import CreateSectionForm from "@/components/sections/CreateSectionForm";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const CourseCurriculumPage = async ({params}: {params: {courseId: string}}) => {
  const { userId } = await auth();
  const resolvedParams = await params;

  if (!userId) {
    return redirect("/sign-in");
  }

  const course = await db.course.findUnique({
    where: {
      id: resolvedParams.courseId,
      instructorId: userId,
    },
    include: {
        sections: {
            orderBy: {
            position: "asc",
            },
        },
    }
  });

  if (!course) {
    return redirect("/instructor/courses");
  }

  return <CreateSectionForm course={course} />;
};

export default CourseCurriculumPage;
