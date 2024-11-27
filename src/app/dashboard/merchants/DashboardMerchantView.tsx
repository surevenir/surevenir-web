// "use client";

// import { useState, useEffect } from "react";
// import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Select } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   getUsers,
//   getMarkets,
//   postMerchant,
//   editMerchant,
//   deleteMerchant,
// } from "@/utils/actions";
// import { toast } from "sonner";

// type Merchant = {
//   id: number;
//   name: string;
//   description: string | null;
//   longitude: string | null;
//   latitude: string | null;
//   profile_image_url: string | null;
//   user_id: string;
//   market_id: number;
// };

// interface MerchantViewProps {
//   merchants: Merchant[];
// }

// // Schema untuk validasi form
// const formSchema = z.object({
//   name: z.string().min(3, { message: "Name must be at least 3 characters." }),
//   description: z
//     .string()
//     .min(3, { message: "Description must be at least 3 characters." })
//     .nullable()
//     .optional(),
//   longitude: z.string().nullable().optional(),
//   latitude: z.string().nullable().optional(),
//   user_id: z.string({ required_error: "User is required." }),
//   market_id: z.number({ required_error: "Market is required." }),
// });
// type FormData = z.infer<typeof formSchema>;

// const mapContainerStyle = {
//   width: "100%",
//   height: "300px",
// };

// const defaultCenter = {
//   lat: -8.65,
//   lng: 115.216,
// };

// export default function DashboardMerchantView({
//   merchants: initialMerchants,
// }: MerchantViewProps) {
//   const [merchants, setMerchants] = useState<Merchant[]>(initialMerchants);
//   const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
//   const [markets, setMarkets] = useState<{ id: number; name: string }[]>([]);
//   const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(
//     null
//   );
//   const [loading, setLoading] = useState(false);
//   const [mapCoordinates, setMapCoordinates] = useState(defaultCenter);

//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
//   });

//   const form = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       description: "",
//       longitude: "",
//       latitude: "",
//       user_id: "",
//       market_id: 0, // Ensure default is compatible with `z.number()`
//     },
//   });

//   useEffect(() => {
//     const fetchDropdownData = async () => {
//       try {
//         const usersData = await getUsers();
//         const marketsData = await getMarkets();
//         setUsers(usersData || []);
//         setMarkets(marketsData || []);
//       } catch (error) {
//         console.error("Failed to fetch dropdown data:", error);
//       }
//     };

//     fetchDropdownData();
//   }, []);

//   const handleMapClick = (event: google.maps.MapMouseEvent) => {
//     const lat = event.latLng?.lat();
//     const lng = event.latLng?.lng();
//     if (lat && lng) {
//       form.setValue("latitude", lat.toString());
//       form.setValue("longitude", lng.toString());
//       setMapCoordinates({ lat, lng });
//     }
//   };

//   const handleAddMerchant = async (data: FormData) => {
//     setLoading(true);
//     try {
//       const result = await postMerchant(data);
//       if (result) {
//         setMerchants((prev) => [...prev, result]);
//         toast.success("Merchant added successfully!");
//         form.reset();
//       } else {
//         toast.error("Failed to add merchant. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error adding merchant:", error);
//       toast.error("An error occurred while adding the merchant.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditMerchant = async (data: FormData) => {
//     if (!selectedMerchant) return;

//     setLoading(true);
//     try {
//       const result = await editMerchant({
//         id: selectedMerchant.id,
//         ...data,
//       });
//       if (result) {
//         setMerchants((prev) =>
//           prev.map((merchant) =>
//             merchant.id === selectedMerchant.id
//               ? { ...merchant, ...data }
//               : merchant
//           )
//         );
//         toast.success("Merchant updated successfully!");
//         setSelectedMerchant(null);
//       } else {
//         toast.error("Failed to update merchant. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error updating merchant:", error);
//       toast.error("An error occurred while updating the merchant.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteMerchant = async (merchantId: number) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this merchant?"
//     );
//     if (!confirmed) return;

//     setLoading(true);
//     try {
//       const result = await deleteMerchant(merchantId);
//       if (result) {
//         setMerchants((prev) =>
//           prev.filter((merchant) => merchant.id !== merchantId)
//         );
//         toast.success("Merchant deleted successfully!");
//       } else {
//         toast.error("Failed to delete merchant. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error deleting merchant:", error);
//       toast.error("An error occurred while deleting the merchant.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isLoaded) return <p>Loading map...</p>;

//   return (
//     <div className="px-8">
//       <div className="flex justify-between mb-4">
//         <h3 className="font-semibold text-xl">Merchants List</h3>
//         <Dialog>
//           <DialogTrigger asChild>
//             <Button>Add Merchant</Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>Add New Merchant</DialogTitle>
//               <DialogDescription>
//                 Fill in the details below to create a new Merchant. Use the map
//                 to set coordinates.
//               </DialogDescription>
//             </DialogHeader>
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(handleAddMerchant)}
//                 className="space-y-4"
//               >
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter merchant name" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Description</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Enter merchant description"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="user_id"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>User</FormLabel>
//                       <FormControl>
//                         <select
//                           placeholder="Select user"
//                           onChange={(e) => field.onChange(e.target.value)}
//                           value={field.value}
//                           className="input"
//                         >
//                           <option value="" disabled>
//                             Select user
//                           </option>
//                           {users.map((user) => (
//                             <option key={user.id} value={user.id}>
//                               {user.name}
//                             </option>
//                           ))}
//                         </select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="market_id"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Market</FormLabel>
//                       <FormControl>
//                         <select
//                           placeholder="Select market"
//                           onChange={(e) =>
//                             field.onChange(Number(e.target.value))
//                           }
//                           value={field.value}
//                           className="input"
//                         >
//                           <option value={0} disabled>
//                             Select market
//                           </option>
//                           {markets.map((market) => (
//                             <option key={market.id} value={market.id}>
//                               {market.name}
//                             </option>
//                           ))}
//                         </select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <div className="border rounded w-full h-[300px]">
//                   <GoogleMap
//                     mapContainerStyle={mapContainerStyle}
//                     zoom={12}
//                     center={mapCoordinates}
//                     onClick={handleMapClick}
//                   >
//                     <Marker position={mapCoordinates} />
//                   </GoogleMap>
//                 </div>
//                 <DialogFooter>
//                   <Button type="submit" disabled={loading}>
//                     {loading ? "Adding..." : "Add Merchant"}
//                   </Button>
//                 </DialogFooter>
//               </form>
//             </Form>
//           </DialogContent>
//         </Dialog>
//       </div>
//       <Table>
//         <TableCaption>Merchants List</TableCaption>
//         <TableHeader>
//           <TableRow>
//             <TableHead>No</TableHead>
//             <TableHead>Name</TableHead>
//             <TableHead>Description</TableHead>
//             <TableHead>User</TableHead>
//             <TableHead>Market</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {merchants.map((merchant, index) => (
//             <TableRow key={merchant.id}>
//               <TableCell>{index + 1}</TableCell>
//               <TableCell>{merchant.name}</TableCell>
//               <TableCell>{merchant.description}</TableCell>
//               <TableCell>
//                 {users.find((u) => u.id === merchant.user_id)?.name || "N/A"}
//               </TableCell>
//               <TableCell>
//                 {markets.find((m) => m.id === merchant.market_id)?.name ||
//                   "N/A"}
//               </TableCell>
//               <TableCell className="flex gap-2">
//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <Button
//                       onClick={() => {
//                         setSelectedMerchant(merchant);
//                         form.reset({
//                           name: merchant.name,
//                           description: merchant.description,
//                           longitude: merchant.longitude,
//                           latitude: merchant.latitude,
//                           user_id: merchant.user_id,
//                           market_id: merchant.market_id,
//                         });
//                         setMapCoordinates({
//                           lat: parseFloat(merchant.latitude || "0"),
//                           lng: parseFloat(merchant.longitude || "0"),
//                         });
//                       }}
//                     >
//                       Edit
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="sm:max-w-[425px]">
//                     <DialogHeader>
//                       <DialogTitle>Edit Merchant</DialogTitle>
//                       <DialogDescription>
//                         Update the details of the Merchant below.
//                       </DialogDescription>
//                     </DialogHeader>
//                     <Form {...form}>
//                       <form
//                         onSubmit={form.handleSubmit(handleEditMerchant)}
//                         className="space-y-4"
//                       >
//                         <FormField
//                           control={form.control}
//                           name="name"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Name</FormLabel>
//                               <FormControl>
//                                 <Input
//                                   placeholder="Enter merchant name"
//                                   {...field}
//                                 />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name="description"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Description</FormLabel>
//                               <FormControl>
//                                 <Input
//                                   placeholder="Enter merchant description"
//                                   {...field}
//                                 />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name="user_id"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>User</FormLabel>
//                               <FormControl>
//                                 <select
//                                   placeholder="Select user"
//                                   onChange={(e) =>
//                                     field.onChange(e.target.value)
//                                   }
//                                   value={field.value}
//                                   className="input"
//                                 >
//                                   <option value="" disabled>
//                                     Select user
//                                   </option>
//                                   {users.map((user) => (
//                                     <option key={user.id} value={user.id}>
//                                       {user.name}
//                                     </option>
//                                   ))}
//                                 </select>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name="market_id"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Market</FormLabel>
//                               <FormControl>
//                                 <select
//                                   placeholder="Select market"
//                                   onChange={(e) =>
//                                     field.onChange(Number(e.target.value))
//                                   }
//                                   value={field.value}
//                                   className="input"
//                                 >
//                                   <option value={0} disabled>
//                                     Select market
//                                   </option>
//                                   {markets.map((market) => (
//                                     <option key={market.id} value={market.id}>
//                                       {market.name}
//                                     </option>
//                                   ))}
//                                 </select>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <div className="border rounded w-full h-[300px]">
//                           <GoogleMap
//                             mapContainerStyle={mapContainerStyle}
//                             zoom={12}
//                             center={mapCoordinates}
//                             onClick={handleMapClick}
//                           >
//                             <Marker position={mapCoordinates} />
//                           </GoogleMap>
//                         </div>
//                         <DialogFooter>
//                           <Button type="submit" disabled={loading}>
//                             {loading ? "Updating..." : "Update Merchant"}
//                           </Button>
//                         </DialogFooter>
//                       </form>
//                     </Form>
//                   </DialogContent>
//                 </Dialog>
//                 <Button
//                   variant="destructive"
//                   onClick={() => handleDeleteMerchant(merchant.id)}
//                 >
//                   Delete
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
