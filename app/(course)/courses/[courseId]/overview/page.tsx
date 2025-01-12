import { db } from "@/lib/db";
import Image from "next/image";
import { redirect } from "next/navigation";


const CourseOverview = async ({ params }: { params: { courseId: string } }) => {
    const resolvedParams = await params;
    const course = await db.course.findUnique({
        where: {
          id: resolvedParams.courseId,
        //   isPublished: true,
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

      let level;

  if (course.levelId) {
    level = await db.level.findUnique({
      where: {
        id: course.levelId,
      },
    });
  }

  return (
    <div className="px-6 py-4 flex flex-col gap-5 text-sm">
      <div className="flex justify-between">

      <h1 className="text-2xl font-bold">{course.title}</h1>

      </div>

      <p className="font-medium">{course.subtitle}</p>

      <div className="flex gap-2 items-center">
      <Image
          src= "/avatar_placeholder.jpg"
          alt={"Instructor photo"}
          width={30}
          height={30}
          className="rounded-full"
        />
        <p className="font-bold">Instructor:</p>
        <p>Random Instructor</p>

      </div>

      <div className="flex gap-2">
      <p className="font-bold">Price:</p>
      <p>${course.price}</p>
      </div>

      <div className="flex gap-2">
        <p className="font-bold">Level:</p>
        <p>{level?.name}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-bold">Description:</p>
        <p>{course.description}</p>
      </div>



    </div>
  )
}

export default CourseOverview
