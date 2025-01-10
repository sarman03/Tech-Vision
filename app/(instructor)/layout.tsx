import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"


import Topbar from "@/components/layout/Topbar"
import Sidebar from "@/components/layout/Sidebar"



const InstructorLayout = ({ children }: { children: React.ReactNode }) => {
   //@ts-expect-error error
    const { userId } = auth()

    if (!userId) {
        return redirect("/sign-in")
    }

    return (
        <div className="h-full flex flex-col">
            <Topbar />
            <div className="flex flex-1">
                <Sidebar />
                <div className="flex flex-row">{children}</div>
            </div>
        </div>
    )
}

export default InstructorLayout
