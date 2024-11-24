"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Schema untuk validasi menggunakan Zod
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

// Tipe form berdasarkan schema Zod
type FormData = z.infer<typeof formSchema>;

export default function ProfileForm() {
  // Inisialisasi useForm dengan resolver Zod
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Fungsi untuk menangani submit form
  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
  };

  return (
    <>
      <div className="px-8">
        <h3 className="scroll-m-20 pb-4 font-semibold text-xl tracking-tight">
          Add Detail Product
        </h3>
        <div className="flex justify-between gap-4 w-full">
          <div className="w-full">
            <h1></h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
          <div className="w-full">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
