"use client";

import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { Category } from "@/app/types/types";
import {
  deleteCategory,
  editCategory,
  getCategories,
  postCategory,
} from "@/utils/categoryActions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TableSkeleton from "@/components/table-skeleton";
import Cookies from "js-cookie";
import { RefreshCwIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoryViewProps {
  categories: Category[];
}

// Schema untuk validasi form
const formSchemaAdd = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters." }),
  rangePrice: z
    .string()
    .min(2, { message: "Range Price must be at least 2 characters." }),
  image: z.instanceof(File),
});
type FormDataAdd = z.infer<typeof formSchemaAdd>;

const formSchemaEdit = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  rangePrice: z.string().optional(),
  image: z.instanceof(File).optional(),
});
type FormDataEdit = z.infer<typeof formSchemaEdit>;

export default function DashboardProductCategoryView({
  categories: initialCategories,
}: CategoryViewProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [nameSortOrder, setNameSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const token = Cookies.get("userId");

  // Form handling
  const formAdd = useForm<FormDataAdd>({
    resolver: zodResolver(formSchemaAdd),
    defaultValues: {
      name: "",
      description: "",
      rangePrice: "",
      image: undefined,
    },
  });

  const formEdit = useForm<FormDataEdit>({
    resolver: zodResolver(formSchemaEdit),
    defaultValues: {
      name: "",
      description: "",
      rangePrice: "",
      image: undefined,
    },
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories(token as string);
      setCategories(data || []);
    } catch (error: any) {
      console.error("Error fetching categories:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSingleFileChange = (selectedFile: File) => {
    if (selectedFile.size > 3 * 1024 * 1024) {
      toast.error("File size exceeds 3MB.");
      return false;
    }
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Invalid file type. Only image files are allowed.");
      return false;
    }
    setFile(selectedFile);
    return true;
  };

  const handleAddCategory = async (data: FormDataAdd) => {
    setLoading(true);

    try {
      const result = await postCategory(data, token as string);
      if (result) {
        toast.success("Category added successfully!");
        formAdd.reset();
        await fetchCategories();
        setFile(undefined);
      } else {
        toast.error("Failed to post category");
      }
    } catch (error: any) {
      console.error("Error adding category:", error.message);
      toast.error("An error occurred while adding the category.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async (data: FormDataEdit) => {
    if (!selectedCategory) return;

    setLoading(true);

    // Validasi file gambar jika ada
    const file = data.image as File | null;

    if (file && file.size > 3 * 1024 * 1024) {
      toast.error("File size exceeds 3MB.");
      setLoading(false);
      return;
    }

    if (file && !file.type.startsWith("image/")) {
      toast.error("Invalid file type. Only image files are allowed.");
      setLoading(false);
      return;
    }
    try {
      const updatedCategory = {
        id: selectedCategory.id,
        name: data.name as string,
        description: data.description as string,
        rangePrice: data.rangePrice as string,
        image: data.image ? data.image : undefined,
      };
      const result = await editCategory(updatedCategory, token as string);

      if (result) {
        toast.success("Category updated successfully!");
        setSelectedCategory(null);
        await fetchCategories();
      } else {
        toast.error("Failed to update category. Please try again.");
      }
    } catch (error: any) {
      console.error("Error updating category:", error.message);
      toast.error("An error occurred while updating the category.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    setLoading(true);
    try {
      const result = await deleteCategory(selectedCategory.id, token as string);
      if (result) {
        setCategories((prev) =>
          prev.filter((category) => category.id !== selectedCategory.id)
        );
        setSelectedCategory(null);
        toast.success("Successfully deleted category");
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error: any) {
      console.error("Error deleting category:", error.message);
      toast.error("An error occurred while deleting the category");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    let result = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (nameSortOrder === "asc") {
      result = result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (nameSortOrder === "desc") {
      result = result.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredCategories(result);
  }, [searchQuery, nameSortOrder, categories]);

  return (
    <div className="px-8 pb-8">
      <div className="flex flex-wrap justify-between items-center pb-4">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-xl">Category List</h3>
          <Button variant={"outline"} onClick={() => fetchCategories()}>
            <RefreshCwIcon />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search for..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Filter & Sort</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Sort and Filter</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuRadioGroup value={nameSortOrder}>
                <DropdownMenuRadioItem
                  value="asc"
                  onSelect={() => {
                    setNameSortOrder("asc");
                  }}
                >
                  Name Ascending
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="desc"
                  onSelect={() => {
                    setNameSortOrder("desc");
                  }}
                >
                  Name Descending
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
              <Form {...formAdd}>
                <form
                  onSubmit={formAdd.handleSubmit(handleAddCategory)}
                  className="space-y-4"
                >
                  <FormField
                    control={formAdd.control}
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

                  <FormField
                    control={formAdd.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter category description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formAdd.control}
                    name="rangePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Range Price</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter category range price"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formAdd.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            required
                            onChange={(e) => {
                              const selectedFile = e.target.files
                                ? e.target.files[0]
                                : null;
                              if (selectedFile) {
                                const isValid =
                                  handleSingleFileChange(selectedFile);
                                if (isValid) {
                                  formAdd.setValue("image", selectedFile);
                                }
                              }
                            }}
                          />
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
      </div>

      {loading && <TableSkeleton />}

      {!loading && (
        <Table>
          <TableCaption className="pb-4">
            Categories List ({filteredCategories.length} / {categories.length})
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Range Price</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  {category.range_price
                    .split("-")
                    .map((price) =>
                      new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(Number(price))
                    )
                    .join(" - ")}
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline">Image</Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="w-16">
                          <img src={category.image_url} alt={category.name} />
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="flex gap-2 w-20">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setSelectedCategory(category);
                          formEdit.reset({
                            name: category.name,
                            description: category.description,
                            rangePrice: category.range_price,
                          });
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
                      <Form {...formEdit}>
                        <form
                          onSubmit={formEdit.handleSubmit(handleEditCategory)}
                          className="space-y-4"
                        >
                          <FormField
                            control={formEdit.control}
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

                          <FormField
                            control={formEdit.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter category description"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={formEdit.control}
                            name="rangePrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Range Price</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter category range price"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={formEdit.control}
                            name="image"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                  <Input
                                    type="file"
                                    onChange={(e) => {
                                      const selectedFile = e.target.files
                                        ? e.target.files[0]
                                        : null;
                                      if (selectedFile) {
                                        const isValid =
                                          handleSingleFileChange(selectedFile);
                                        if (isValid) {
                                          formEdit.setValue(
                                            "image",
                                            selectedFile
                                          );
                                        }
                                      }
                                    }}
                                  />
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
      )}
    </div>
  );
}
