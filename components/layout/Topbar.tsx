"use client";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const Topbar = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const topRoutes = [
    { label: "Instructor", path: "/instructor/courses", requiresAuth: true },
    { label: "Learning", path: "/learning", requiresAuth: false },
  ];

  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    if (searchInput.trim() !== "") {
      router.push(`/search?query=${searchInput}`);
    }
    setSearchInput("");
  };

  const handleInstructorClick = () => {
    if (!isSignedIn) {
      window.location.href = "/sign-in";
    } else {
      window.location.href = "/instructor/courses";
    }
  };

  return (
    <div className="flex justify-between items-center p-4">
      <Link href="/">
        <div>Logo</div>
      </Link>

      <div className="max-md:hidden w-[400px] rounded-full flex">
        <input
          className="flex-grow bg-[#FFF8EB] rounded-l-full border-none outline-bnone text-sm pl-4 py-3 "
          placeholder="Search for courses"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <button
          className="bg-[#FDAB04] rounded-r-full border-none outline-none cursor-pointer px-4 py-3 hover:bg-[#FDAB04]/70"
          disabled={searchInput.trim() === ""}
          onClick={handleSearch}
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-6 items-center">
        <div className="max-sm:hidden flex gap-6">
          {topRoutes.map((route) => (
            <Link
              href={route.path}
              key={route.path}
              className="text-sm font-medium hover:text-[#FDAB04]"
              onClick={
                route.requiresAuth && route.label === "Instructor"
                  ? handleInstructorClick
                  : undefined
              }
            >
              {route.label}
            </Link>
          ))}
        </div>
        {isSignedIn ? (
          <UserButton />
        ) : (
          <Link href="/sign-in">
            {" "}
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Topbar;
