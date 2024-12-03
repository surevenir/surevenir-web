"use client";

import { User } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { getUsers, updateUser } from "@/utils/userActions";
import { RefreshCwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import TableSkeleton from "@/components/table-skeleton";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface DashboardUserViewProps {
  users: User[] | [];
}

export default function DashboardUserView({
  users: initialUsers,
}: DashboardUserViewProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>();
  const [selectedRole, setSelectedRole] = useState<string | null>("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [nameSortOrder, setNameSortOrder] = useState("asc");

  const token = Cookies.get("userId");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers(token as string);
      setUsers(data || []);
    } catch (error: any) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };

  const handleEditUser = async () => {
    if (!selectedUser || !selectedRole) return;

    // Call the updateUser function with user ID and selected role
    setLoading(true);
    console.log("selectedUser", selectedUser);
    console.log("selectedRole", selectedRole);

    try {
      const result = await updateUser(
        { id: selectedUser?.id as string, role: selectedRole as string },
        token as string,
        undefined
      );
      if (result) {
        toast.success("Successfully updated user");
        setSelectedUser(null);
        setSelectedRole(null);
        await fetchUsers();
      } else {
        toast.error("Failed to update");
      }
    } catch (error: any) {
      console.error("Error updating product:", error.message);
      toast("An error occurred while updating the user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = users.filter(
      (user) =>
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (nameSortOrder === "asc") {
      result = result.sort((a, b) => a.full_name.localeCompare(b.full_name));
    } else if (nameSortOrder === "desc") {
      result = result.sort((a, b) => b.full_name.localeCompare(a.full_name));
    } else if (nameSortOrder === "category") {
      result = result.sort((a, b) => {
        // Membandingkan berdasarkan role
        const roleA = a.role || "";
        const roleB = b.role || "";

        // Jika role A adalah "Admin" dan role B bukan, maka A ditempatkan di depan
        if (roleA === "Admin" && roleB !== "Admin") {
          return -1; // A lebih dulu
        }
        if (roleA !== "Admin" && roleB === "Admin") {
          return 1; // B lebih dulu
        }

        return roleA.localeCompare(roleB);
      });
    }

    setFilteredUsers(result);
  }, [searchQuery, users, nameSortOrder]);

  return (
    <>
      <div className="px-8">
        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-xl">User List</h3>
            <Button variant={"outline"} onClick={() => fetchUsers()}>
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
          </div>
        </div>

        {loading && <TableSkeleton />}

        {!loading && (
          <Table>
            <TableCaption>
              Users List ({filteredUsers.length} / {users.length})
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Fullname</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Addresses</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>
                    {user.role == "ADMIN" ? (
                      <Badge className="bg-green-500 text-white">Admin</Badge>
                    ) : user.role == "USER" ? (
                      <Badge variant={"outline"}>User</Badge>
                    ) : (
                      <Badge>Merchant</Badge>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setSelectedUser(user);
                          }}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                          <DialogDescription>
                            Update the role of user {user.full_name}.
                          </DialogDescription>
                        </DialogHeader>
                        <Select
                          value={selectedRole || user.role}
                          onValueChange={setSelectedRole}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue
                              placeholder={
                                user.role.charAt(0).toUpperCase() +
                                user.role.slice(1).toLowerCase()
                              }
                              defaultValue={user.role}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Role</SelectLabel>
                              <SelectItem value="USER">User</SelectItem>
                              <SelectItem value="MERCHANT">Merchant</SelectItem>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <Button onClick={handleEditUser}>Submit</Button>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
