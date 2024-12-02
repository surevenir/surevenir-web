"use client";

import { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "@/components/table-skeleton";
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
import { Category, Market, Merchant, Product } from "@/app/types/types";
import { deleteImage } from "@/utils/imageActions";
import Cookies from "js-cookie";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronsUpDown,
  RefreshCcwIcon,
  RefreshCwIcon,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import {
  deleteProduct,
  editProduct,
  getProducts,
  postProduct,
  postProductImages,
} from "@/utils/productActions";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

interface DashboardProductViewProps {
  products: Product[] | [];
  merchants: Merchant[] | [];
  categories: Category[] | [];
}

export default function DashboardProductView({
  products: initialProducts,
  merchants: initialMerchants,
  categories: initialCategories,
}: DashboardProductViewProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [merchants, setMerchants] = useState<Merchant[]>(initialMerchants);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<
    Merchant | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [searchResults, setSearchResults] = useState(products);
  const [searchQuery, setSearchQuery] = useState("");
  const [nameSortOrder, setNameSortOrder] = useState("asc");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [categoryOptions, setCategoryOptions] = useState(categories);
  const [selectedCategory, setSelectedCategory] = useState("");

  const userId = Cookies.get("userId") || "";
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const formSchemaAdd = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    description: z
      .string()
      .min(2, { message: "Description must be at least 2 characters." }),
    price: z.number(),
    merchantId: z.number(),
    categoryIds: z.string(),
    stock: z.number(),
    // images: z.array(z.instanceof(File)),
  });

  type FormDataAdd = z.infer<typeof formSchemaAdd>;

  const formSchemaEdit = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    merchantId: z.number(),
    categoryIds: z.string(),
    stock: z.number(),
    // images: z.array(z.instanceof(File)).optional(),
  });

  type FormDataEdit = z.infer<typeof formSchemaEdit>;

  const formSchemaImages = z.object({
    id: z.number(),
    images: z.array(z.instanceof(File)),
  });

  type FormDataImages = z.infer<typeof formSchemaImages>;

  const formAdd = useForm<FormDataAdd>({
    resolver: zodResolver(formSchemaAdd),
    defaultValues: {
      name: undefined,
      description: undefined,
      price: undefined,
      merchantId: undefined,
      categoryIds: undefined,
      stock: undefined,
      // images: undefined,
    },
  });
  const formEdit = useForm<FormDataEdit>({
    resolver: zodResolver(formSchemaEdit),
    defaultValues: {
      name: undefined,
      description: undefined,
      price: undefined,
      merchantId: undefined,
      categoryIds: undefined,
      stock: undefined,
      // images: undefined,
    },
  });

  const formImages = useForm<FormDataImages>({
    resolver: zodResolver(formSchemaImages),
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (data: FormDataAdd) => {
    setLoading(true);

    try {
      const result = await postProduct(data);

      if (result) {
        toast.success("Product added successfully!");
        formAdd.reset();
        await fetchProducts();
      } else {
        toast.error("Failed to add merchant images. Please try again later.");
      }
    } catch (error: any) {
      console.error("Error adding product:", error.message);
      toast.error(
        error.message || "An error occurred while adding the product."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (selectedFiles: File[] | null) => {
    if (selectedFiles) {
      const validFiles = selectedFiles.filter((file) => {
        if (file.size > 3 * 1024 * 1024) {
          toast.error("File size exceeds 3MB.");
          return false;
        }
        if (!file.type.startsWith("image/")) {
          toast.error("Invalid file type. Only image files are allowed.");
          return false;
        }
        return true;
      });

      setFiles(validFiles);
    }
  };

  const handleAddImages = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const result = await postProductImages({
        id: selectedProduct.id,
        images: files,
      });

      if (result) {
        toast.success("Product images added successfully!");
        setFiles([]);
        await fetchProducts();
      } else {
        toast.error("Failed to add product images. Please try again later.");
      }
    } catch (error: any) {
      console.error("Error adding product images:", error);

      if (error.response) {
        console.error("Response error:", error.response);
        toast.error(
          `Error: ${error.response?.data?.message || "Unknown error occurred."}`
        );
      } else if (error.message) {
        console.error("Error message:", error.message);
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unknown error occurred while adding product images.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (data: FormDataEdit) => {
    if (!selectedProduct) return;

    setLoading(true);
    console.log("Editing product with data:", data);
    const categoryIds =
      typeof data.categoryIds === "string"
        ? data.categoryIds.split(",").map((id) => parseInt(id, 10))
        : data.categoryIds; // Jika sudah berupa array, gunakan langsung

    try {
      const result = await editProduct({
        ...data,
        id: selectedProduct.id,
        categoryIds,
      });

      console.log("result", result);

      if (result) {
        toast.success("Product updated successfully!");
        setSelectedProduct(null);
        await fetchProducts();
      } else {
        toast.error("Failed to update product. Please try again.");
      }
    } catch (error: any) {
      console.error("Error updating product:", error.message);
      toast.error("An error occurred while updating the product.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const result = await deleteProduct(selectedProduct.id);
      if (result) {
        toast("Successfully deleted product");
        setSelectedProduct(null);
        await fetchProducts();
      } else {
        toast("Failed to delete product");
      }
    } catch (error: any) {
      console.error("Error deleting product:", error.message);
      toast("An error occurred while deleting the product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (url: string) => {
    setLoading(true);
    try {
      const result = await deleteImage(url, userId as string);

      console.log("result :", result);

      if (result) {
        toast("Successfully deleted image");
        await fetchProducts();
      } else {
        toast("Failed to delete image");
      }
    } catch (error: any) {
      console.error("Error deleting image:", error.message);
      toast("An error occurred while deleting the image");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: any) => {
    const value = e.target.value;

    // Memastikan bahwa value ada dan tidak null/undefined
    if (value) {
      setNameSortOrder(value);
    }
  };

  useEffect(() => {
    let result = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Urutkan produk berdasarkan nama
    if (nameSortOrder === "asc") {
      result = result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (nameSortOrder === "desc") {
      result = result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (nameSortOrder === "category") {
      // Kelompokkan produk berdasarkan kategori pertama yang ditemukan
      result = result.sort((a, b) => {
        const categoryA = a.product_categories?.[0]?.category?.name || ""; // Pastikan product_categories ada dan kategori pertama ada
        const categoryB = b.product_categories?.[0]?.category?.name || "";
        return categoryA.localeCompare(categoryB);
      });
    }

    setFilteredProducts(result);
  }, [searchQuery, nameSortOrder, products]);

  return (
    <div className="px-8 pb-8">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-xl">Product List</h3>
          <Button variant={"outline"} onClick={() => fetchProducts()}>
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
                <DropdownMenuRadioItem
                  value="category"
                  onSelect={() => {
                    setNameSortOrder("category");
                  }}
                >
                  Category
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  formAdd.reset();
                  setSelectedProduct(null);
                }}
              >
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new product.
                </DialogDescription>
              </DialogHeader>
              <Form {...formAdd}>
                <form
                  className="space-y-4"
                  onSubmit={formAdd.handleSubmit(handleAddProduct)}
                >
                  <FormField
                    control={formAdd.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter product name"
                            type="text"
                            {...field}
                          />
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
                            placeholder="Enter product description"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formAdd.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter product price"
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formAdd.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter product stock"
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formAdd.control}
                    name="merchantId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Merchant</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-[200px] justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                  onChange={() => {
                                    setSelectedMerchant(
                                      merchants.find(
                                        (merchant) =>
                                          merchant.id === field.value
                                      )
                                    );
                                  }}
                                >
                                  {field.value
                                    ? merchants.find(
                                        (merchant) =>
                                          merchant.id === field.value
                                      )?.name
                                    : "Select merchant"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-[200px]">
                              <Command>
                                <CommandInput
                                  placeholder="Search merchant..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    No merchant found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {merchants.map((merchant) => (
                                      <CommandItem
                                        value={merchant.name}
                                        key={merchant.id}
                                        onSelect={() => {
                                          formAdd.setValue(
                                            "merchantId",
                                            merchant.id
                                          );
                                          setSelectedMerchant(merchant);
                                        }}
                                      >
                                        {merchant.name}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            merchant.id === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formAdd.control}
                    name="categoryIds"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Category</FormLabel>
                        </div>
                        {categories.map((item) => (
                          <FormField
                            key={item.id}
                            control={formAdd.control}
                            name="categoryIds"
                            render={({ field }) => {
                              const currentValue = Array.isArray(field.value)
                                ? field.value
                                : field.value?.split(",") || [];

                              return (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={currentValue.includes(
                                        item.id.toString()
                                      )}
                                      onCheckedChange={(checked) => {
                                        let newValue: string[];
                                        if (checked) {
                                          // Tambahkan ID kategori yang dipilih
                                          newValue = [
                                            ...currentValue,
                                            item.id.toString(),
                                          ];
                                        } else {
                                          // Hapus ID kategori yang dibatalkan
                                          newValue = currentValue.filter(
                                            (value) =>
                                              value !== item.id.toString()
                                          );
                                        }

                                        // Update field value dengan string yang dipisahkan koma
                                        // Jika ada lebih dari satu kategori, pisahkan dengan koma
                                        field.onChange(newValue.join(","));
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-sm">
                                    {item.name}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button disabled={loading} type="submit">
                      {loading ? "Adding..." : "Add Product"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading && <TableSkeleton />}

      {!loading && isLoaded && (
        <Table>
          <TableCaption>
            {products.length != 0 ? "Products List" : "No Products Found"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          {!isLoaded && <Skeleton className="w-full h-4" />}

          <TableBody>
            {filteredProducts.map((product, index) => (
              <TableRow key={product.slug}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell className="flex gap-2">
                  {product.product_categories?.map((category) => (
                    <Badge>{category.category.name}</Badge>
                  ))}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant={"outline"}
                        onClick={() => {
                          setSelectedProduct(product);
                          setFiles([]);
                          setLoading(false);
                        }}
                      >
                        {product.images?.length || 0}
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="w-2/3">
                      <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                          <DialogHeader>
                            <DialogTitle>Product Images</DialogTitle>
                            <DialogDescription>
                              {product.name}
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...formImages}>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleAddImages();
                              }}
                              className="space-y-4"
                            >
                              <Input
                                type="file"
                                multiple
                                onChange={(e) => {
                                  if (e.target.files) {
                                    handleFileChange(
                                      Array.from(e.target.files)
                                    );
                                  }
                                }}
                              />
                              <DialogFooter>
                                <Button
                                  type="submit"
                                  disabled={loading || files.length === 0}
                                >
                                  {loading ? "Adding..." : "Add Image"}
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </div>
                        <div className="gap-4 grid grid-cols-3 grid-flow-row">
                          {product.images?.map((image) => (
                            <div
                              className="flex flex-col gap-4 w-32 h-full object-fill"
                              key={image.id}
                            >
                              <img
                                src={image.url}
                                className="w-full"
                                alt={product.name}
                              />

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant={"destructive"}
                                    disabled={loading}
                                  >
                                    {loading ? "Deleting..." : "Delete Image"}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure you want to delete this
                                      image?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {`This action will permanently delete the image`}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteImage(image.url)
                                      }
                                    >
                                      {loading ? "Deleting..." : "Confirm"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>

                <TableCell className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setSelectedProduct(product);
                          console.log(JSON.stringify(product));

                          formEdit.reset({
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            stock: product.stock,
                            merchantId: product.merchant_id,
                            categoryIds: product.product_categories
                              ? product.product_categories
                                  .map((pc) => pc.category.id) // Ambil id dari category yang ada dalam product_categories
                                  .join(",") // Gabungkan ID dengan koma
                              : "",
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>
                          Update the details of the product below.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...formEdit}>
                        <form
                          onSubmit={formEdit.handleSubmit(handleEditProduct)}
                          className="space-y-4"
                        >
                          <FormField
                            control={formEdit.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter merchant name"
                                    type="text"
                                    {...field}
                                  />
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
                                    placeholder="Enter merchant description"
                                    type="text"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={formEdit.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter merchant price"
                                    type="number"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseInt(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={formEdit.control}
                            name="stock"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter merchant stock"
                                    type="number"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseInt(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={formEdit.control}
                            name="merchantId"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Merchant</FormLabel>
                                <FormControl>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant="outline"
                                          role="combobox"
                                          className={cn(
                                            "w-[200px] justify-between",
                                            !field.value &&
                                              "text-muted-foreground"
                                          )}
                                          onChange={() => {
                                            setSelectedMerchant(
                                              merchants.find(
                                                (merchant) =>
                                                  merchant.id === field.value
                                              )
                                            );
                                          }}
                                        >
                                          {field.value
                                            ? merchants.find(
                                                (merchant) =>
                                                  merchant.id === field.value
                                              )?.name
                                            : "Select merchant"}
                                          <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-[200px]">
                                      <Command>
                                        <CommandInput
                                          placeholder="Search merchant..."
                                          className="h-9"
                                        />
                                        <CommandList>
                                          <CommandEmpty>
                                            No merchant found.
                                          </CommandEmpty>
                                          <CommandGroup>
                                            {merchants.map((merchant) => (
                                              <CommandItem
                                                value={merchant.name}
                                                key={merchant.id}
                                                onSelect={() => {
                                                  formEdit.setValue(
                                                    "merchantId",
                                                    merchant.id
                                                  );
                                                  setSelectedMerchant(merchant);
                                                }}
                                              >
                                                {merchant.name}
                                                <Check
                                                  className={cn(
                                                    "ml-auto",
                                                    merchant.id === field.value
                                                      ? "opacity-100"
                                                      : "opacity-0"
                                                  )}
                                                />
                                              </CommandItem>
                                            ))}
                                          </CommandGroup>
                                        </CommandList>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={formEdit.control}
                            name="categoryIds"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel className="text-base">
                                    Category
                                  </FormLabel>
                                </div>
                                {categories.map((item) => (
                                  <FormField
                                    key={item.id}
                                    control={formEdit.control}
                                    name="categoryIds"
                                    render={({ field }) => {
                                      // Mengonversi field.value menjadi array, meskipun ada satu kategori
                                      const currentValue = Array.isArray(
                                        field.value
                                      )
                                        ? field.value
                                        : field.value?.split(",") || [];

                                      return (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                          <FormControl>
                                            <Checkbox
                                              checked={currentValue.includes(
                                                item.id.toString()
                                              )}
                                              onCheckedChange={(checked) => {
                                                let newValue: string[];
                                                if (checked) {
                                                  // Tambahkan ID kategori yang dipilih
                                                  newValue = [
                                                    ...currentValue,
                                                    item.id.toString(),
                                                  ];
                                                } else {
                                                  // Hapus ID kategori yang dibatalkan
                                                  newValue =
                                                    currentValue.filter(
                                                      (value) =>
                                                        value !==
                                                        item.id.toString()
                                                    );
                                                }

                                                // Pastikan nilai kategori disimpan dalam format string yang dipisahkan koma
                                                field.onChange(
                                                  newValue.join(",")
                                                );
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal text-sm">
                                            {item.name}
                                          </FormLabel>
                                        </FormItem>
                                      );
                                    }}
                                  />
                                ))}
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <DialogFooter>
                            <Button type="submit" disabled={loading}>
                              {loading ? "Updating..." : "Update Market"}
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
                        onClick={() => setSelectedProduct(product)}
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this product?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {`This action will permanently delete the product "${selectedProduct?.name}".`}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => setSelectedProduct(product)}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProduct}>
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
