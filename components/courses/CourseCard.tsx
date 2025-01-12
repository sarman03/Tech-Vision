import { db } from "@/lib/db";
import { Course } from "@prisma/client";
import { Gem } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CourseCard =async ({ course }: { course: Course }) => {
  let level = null;
  if (course.levelId) {
    level = await db.level.findUnique({
      where: {
        id: course.levelId,
      },
    });
  }

  return (
    <Link
      href={`/courses/${course.id}/overview`}
      className="border rounded-lg cursor-pointer"
    >
      <Image
        src={course.imageUrl ? course.imageUrl : "/image_placeholder.webp"}
        alt={course.title}
        width={500}
        height={300}
        className="rounded-t-xl w-[320px] h-[180px] object-cover"
      />

      <div className="px-4 py-3 flex flex-col gap-2">
        <h2 className="text-lg font-bold hover:[#FDAB04]">{course.title}</h2>
        <div className="flex justify-between text-sm font-medium">
          {level && (
            <div className="flex gap-2">
              <Gem size={20} />
              <p>{level.name}</p>
            </div>
          )}
        </div>
        <p className="text-sm font-bold">₹ {course.price}</p>
      </div>
    </Link>
  );
};

export default CourseCard;
