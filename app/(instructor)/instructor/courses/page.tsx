

import Link from "next/link";

import { Button } from "@/components/ui/button";


const CoursesPage = () => {
  
  return (
    <div className="px-6 py-4">
      <Link href="/instructor/create-course">
        <Button>Create New Course</Button>
      </Link>
    </div>
  )
}

export default CoursesPage
