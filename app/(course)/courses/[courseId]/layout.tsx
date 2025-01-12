import CourseSideBar from "@/components/layout/CourseSideBar";
import Topbar from "@/components/layout/Topbar";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const CourseDetailsLayout = async ({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: { courseId: string };
  }) => {
    const { userId } = await auth();
    const resolvedParams = await params;

  if (!userId) {
    return redirect("/sign-in");
  }

  const course = await db.course.findUnique({
    where: {
      id: resolvedParams.courseId,
    },
    include: {
      sections: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }
    return (
        <div className="h-full flex flex-col">
        <Topbar />
        <div className="flex-1 flex">
        <CourseSideBar course={course} studentId={userId} />
        <div className="flex-1">{children}</div>
      </div>
        </div>
    );
}

export default CourseDetailsLayout;