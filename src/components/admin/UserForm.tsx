import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserRole, type User, type UserFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { FC } from "react";

const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.nativeEnum(UserRole),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
});

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const UserForm: FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const isEditing = !!user;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || UserRole.USER,
      password: "",
    },
  });

  const handleSubmit = async (data: UserFormData) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-700">Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isLoading}
                  className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                />
              </FormControl>
              <FormMessage className="text-red-600 text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-700">Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  disabled={isLoading || isEditing}
                  className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                />
              </FormControl>
              <FormMessage className="text-red-600 text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-700">Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={UserRole.USER}>User</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                  <SelectItem value={UserRole.ORGANIZER}>Organizer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-600 text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-700">
                {isEditing
                  ? "New Password (leave empty to keep current)"
                  : "Password"}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  disabled={isLoading}
                  required={!isEditing}
                  className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                />
              </FormControl>
              <FormMessage className="text-red-600 text-sm" />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="border-gray-400 hover:bg-gray-100 text-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isEditing
              ? isLoading
                ? "Updating..."
                : "Update User"
              : isLoading
              ? "Creating..."
              : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
