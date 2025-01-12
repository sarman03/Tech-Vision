import EditSectionForm from "@/components/sections/EditSectionForm"
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const SectionsDetailPage = async({
  params,
}: {
  params: { courseId: string; sectionId: string };
}) => {
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
  });

  if (!course) {
    return redirect("/instructor/courses");
  }

  const section = await db.section.findUnique({
    where: {
      id: resolvedParams.sectionId,
      courseId: resolvedParams.courseId,
    },
    include: {
      muxData: true,
      resources: true,
    },
  });

  if (!section) {
    return redirect(`/instructor/courses/${params.courseId}/sections`);
  }

  const isCompleted = false;

  return (
    <div className="px-10">
      <EditSectionForm section={section}
        courseId={resolvedParams.courseId}
        isCompleted={isCompleted}/>
    </div>
  )
}

export default SectionsDetailPage
