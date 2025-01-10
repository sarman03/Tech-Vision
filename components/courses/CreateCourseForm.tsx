"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ComboBox } from "../custom/ComboBox"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useAuth } from "@clerk/nextjs"

const formSchema = z.object({
    title: z.string().min(2, {
      message: "Title is required and minimum 2 characters",
    }),
    categoryId: z.string().min(1, {
      message: "Category is required",
    }),
    subCategoryId: z.string().min(1, {
      message: "Subcategory is required",
    }),
});

interface CreateCourseFormProps {
    categories: {
      label: string; 
      value: string; 
      subCategories: { label: string; value: string }[];
    }[]; 
} 

const CreateCourseForm = ({ categories }: CreateCourseFormProps) => {
    const router = useRouter();
    const { isSignedIn } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
          categoryId: "",
          subCategoryId: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      if (!isSignedIn) {
        toast.error("You must be signed in to create a course.");
        return;
      }

      try {
        const response = await axios.post("/api/courses", values);
        router.push(`/instructor/courses/${response.data.id}/basic`);
        toast.success("New Course Created");
      } catch (err) {
        console.log("Failed to create new course", err);
        toast.error("Something went wrong!");
      }
    };

    return (
      <div className="p-10">
        <h1 className="text-xl font-bold">
          Let give some basics for your course
        </h1>
        <p className="text-sm mt-3">
          It is ok if you cannot think of a good title or correct category now.
          You can change them later.
        </p>
  
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-10"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
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
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Category</FormLabel>
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
                  <FormLabel>Subcategory</FormLabel>
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
  
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    );
};

export default CreateCourseForm;