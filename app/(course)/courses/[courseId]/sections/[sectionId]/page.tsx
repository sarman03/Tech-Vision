import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const SectionDetailsPage = async ({
  params,
}: {
  params: { courseId: string; sectionId: string };
}) => {
  const { courseId, sectionId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      isPublished: true,
    },
    // include: {
    //   sections: {
    //     where: {
    //       isPublished: true,
    //     },
    //   },
    // },
  });

  if (!course) {
    return redirect("/");
  }

  const section = await db.section.findUnique({
    where: {
      id: sectionId,
      courseId,
      isPublished: true,
    },
  });

  if (!section) {
    return redirect(`/courses/${courseId}/overview`);
  }
  

  return <div></div>;
};

export default SectionDetailsPage;
