import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useLoginMutation } from "@/features/auth/authApi";
import { handleError } from "@/helpers/handleError";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export function LoginForm() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    shouldFocusError: true,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await login(values).unwrap();
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to login");
      handleError(error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-md p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 dark:text-gray-100">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email@example.com"
                    {...field}
                    className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-600 dark:text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 dark:text-gray-100">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-600 dark:text-red-400" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <div className="text-right mt-2">
            <button
              type="button"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => navigate("/forgot-password")}
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
