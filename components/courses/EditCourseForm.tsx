"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ComboBox } from "../custom/ComboBox";
import FileUpload from "../custom/FileUpload";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import Delete from "../custom/Delete";
import PublishButton from "../custom/PublishButton";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required and must be at least 2 characters long",
  }),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
  subCategoryId: z.string().min(1, {
    message: "Subcategory is required",
  }),
  levelId: z.string().optional(),
  imageUrl: z.string().optional(),
  price: z.coerce.number().optional(),
});

interface EditCourseFormProps {
  course: Course;
  categories: {
    label: string; // name of category
    value: string; // categoryId
    subCategories: { label: string; value: string }[];
  }[];
  levels: { label: string; value: string }[];
  isCompleted: boolean;
} 

const EditCourseForm = ({
  course,
  categories,
  levels,
  isCompleted,
}: EditCourseFormProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [price, setPrice] = useState(course.price !== undefined ? String(course.price) : "");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course.title || "",
      subtitle: course.subtitle || "",
      description: course.description || "",
      categoryId: course.categoryId || "",
      subCategoryId: course.subCategoryId || "",
      levelId: course.levelId || "",
      imageUrl: course.imageUrl || "",
      //@ts-expect-error error
      price: course.price !== undefined ? String(course.price) : "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${course.id}`, values);
      toast.success("Course Updated");
      router.refresh();
    } catch (err) {
      console.log("Failed to update the course", err);
      toast.error("Something went wrong!");
    }
  };

  const routes = [
    {
      label: "Basic Information",
      path: `/instructor/courses/${course.id}/basic`,
    },
    { label: "Curriculum", path: `/instructor/courses/${course.id}/sections` },
  ];

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between mb-7">
        <div className="flex gap-5">
          {routes.map((route) => (
            <Link key={route.path} href={route.path}>
              <Button variant={pathname === route.path ? "default" : "outline"}>
                {route.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex gap-5 items-start">
        <PublishButton
            disabled={!isCompleted}
            courseId={course.id}
            isPublished={course.isPublished}
            page="Course"
          />
          <Delete item="course" courseId={course.id} />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Web Development for Beginners"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Become a Full-stack Developer with just ONE course. HTML, CSS, Javascript, Node, React, MongoDB and more!"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Become a Full-stack Developer with just ONE course. HTML, CSS, Javascript, Node, React, MongoDB and more!"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap gap-10">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Category <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <ComboBox options={categories} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subCategoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Subcategory <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <ComboBox
                      options={
                        categories.find(
                          (category) =>
                            category.value === form.watch("categoryId")
                        )?.subCategories || []
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="levelId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Level <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <ComboBox options={levels} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Couse Banner <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value || ""}
                    onChange={(url) => field.onChange(url)}
                    endpoint="courseBanner"
                    page="Edit Course"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Price <span className="text-red-500">*</span> (INR)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="5000"
                    value={price}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPrice(value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-5">
            <Link href="/instructor/courses">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default EditCourseForm;
