"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

interface UserFormData {
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  password: string;
  isActive: boolean;
}

export function UserDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    role: "",
    password: "",
    isActive: true,
  });
  const {data: session} = useSession();
  const queryClient = useQueryClient();

  const { error, success } = useToast();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      error("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      error("Email is required");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      error("Phone is required");
      return;
    }

    if (!formData.role) {
      error("Role is required");
      return;
    }

    setIsLoading(true);
    formData.password = formData.name;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create user");
      }

      const newUser = await response.json();

      success("User created successfully!");

      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        role: "",
        password: "",
        isActive: true,
      });
      setIsOpen(false);

      await queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (e) {
      console.error("Error creating user:", e);
      error("Failed to create user. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof UserFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4" variant={"outline"}>
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-4">
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new user account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input
                id="name-1"
                name="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email-1">Email</Label>
              <Input
                id="email-1"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="phone-1">Phone</Label>
              <Input
                id="phone-1"
                name="phone"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="flex gap-3">
              <div className="grid gap-3">
                <Label htmlFor="role-1" className="px-1">
                  Role
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Roles</SelectLabel>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="FACULTY">Faculty</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="isActive-1">Active</Label>
                <Switch
                  id="isActive-1"
                  name="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    handleInputChange("isActive", checked)
                  }
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
