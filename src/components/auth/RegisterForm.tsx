import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";


import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { useRegisterMutation } from "@/features/auth/authApi";
import { useNavigate } from "react-router";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Must be a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegisterForm() {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await register({
        email: values.email,
        password: values.password,
        name: values.name
      }).unwrap();
      
      toast.success("You've successfully registered! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error("There was an error creating your account.");
      console.error("Registration error:", error);
    }
  };

  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="w-full max-w-md mx-auto border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-shadow duration-300 pb-0 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">Create an account</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">Enter your details to register</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-gray-200">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-gray-200">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
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
                  <FormLabel className="text-gray-800 dark:text-gray-200">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="******"
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-gray-200">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="******"
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
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center bg-gray-50 dark:bg-gray-700/50">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0 text-blue-600 dark:text-blue-400 hover:underline"
            onClick={() => navigate("/login")}
            disabled={isLoading}
          >
            Login
          </Button>
        </div>
      </CardFooter>
    </Card>
  </motion.div> 
  );
}