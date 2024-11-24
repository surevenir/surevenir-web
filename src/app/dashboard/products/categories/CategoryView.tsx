"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  deleteCategories,
  postCategories,
  editCategories,
} from "@/utils/actions";
import { toast } from "sonner";

type Category = {
  id: number;
  name: string;
};

interface CategoryViewProps {
  categories: Category[];
}

// Schema untuk validasi form
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
});
type FormData = z.infer<typeof formSchema>;

export default function CategoryView({
  categories: initialCategories,
}: CategoryViewProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State untuk edit mode

  // Form handling
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleDelete = async () => {
    if (!selectedCategory) return;

    setLoading(true);
    try {
      const result = await deleteCategories(selectedCategory.id);
      if (result) {
        setCategories((prev) =>
          prev.filter((category) => category.id !== selectedCategory.id)
        );
        setSelectedCategory(null);
        toast("Successfully deleted category");
      } else {
        toast("Failed to delete category");
      }
    } catch (error: any) {
      console.error("Error deleting category:", error.message);
      toast("An error occurred while deleting the category");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await postCategories(data);
      if (result) {
        setCategories((prev) => [...prev, result]);
        toast("Category added successfully!");
        form.reset();
      } else {
        toast("Failed to add category. Please try again.");
      }
    } catch (error: any) {
      console.error("Error adding category:", error.message);
      toast("An error occurred while adding the category.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async (data: FormData) => {
    if (!selectedCategory) return;

    setLoading(true);
    try {
      const result = await editCategories({
        id: selectedCategory.id,
        name: data.name,
      });
      if (result) {
        setCategories((prev) =>
          prev.map((category) =>
            category.id === selectedCategory.id
              ? { ...category, name: data.name }
              : category
          )
        );
        toast("Category updated successfully!");
        setSelectedCategory(null);
        setIsEditing(false); // Keluar dari mode edit
      } else {
        toast("Failed to update category. Please try again.");
      }
    } catch (error: any) {
      console.error("Error updating category:", error.message);
      toast("An error occurred while updating the category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-8">
      <div className="flex justify-between">
        <h3 className="scroll-m-20 pb-4 font-semibold text-xl tracking-tight">
          Category List
        </h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Category</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new category.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleAddCategory)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Category"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableCaption>Products Categories List</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category, index) => (
            <TableRow key={category.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell className="flex gap-2 w-20">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsEditing(true);
                        form.setValue("name", category.name); // Set nilai form untuk edit
                      }}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Category</DialogTitle>
                      <DialogDescription>
                        Update the details of the category below.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleEditCategory)}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update Category"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      onClick={() => setSelectedCategory(category)}
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete this category?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {`This action will permanently delete the category "${selectedCategory?.name}".`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setSelectedCategory(null)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        {loading ? "Deleting..." : "Confirm"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
