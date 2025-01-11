import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { userId } = await auth();
    const resolvedParams = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
        where: { id: resolvedParams.courseId, instructorId: userId },
      });
  
      if (!course) {
        return new NextResponse("Course Not Found", { status: 404 });
      }

      const lastSection = await db.section.findFirst({
        where: { courseId: resolvedParams.courseId },
        orderBy: { position: "desc" },
      });

      const newPosition = lastSection ? lastSection.position + 1 : 0;

      const {title} = await req.json();

      const newSection = await db.section.create({
        data: {
          title,
          courseId: resolvedParams.courseId,
          position: newPosition,
        },
      });
  
      return NextResponse.json(newSection, { status: 200 });
  } catch (err) {
    console.log("[sections_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
