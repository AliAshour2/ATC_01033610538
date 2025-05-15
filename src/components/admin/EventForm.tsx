import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";

import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

const eventSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  date: z.date({ required_error: "Event date is required" }),
  location: z.string().min(3, { message: "Location is required" }),
  capacity: z.coerce.number().min(1, { message: "Capacity must be at least 1" }),
  price: z.coerce.number().min(0, { message: "Price cannot be negative" }),
  category: z.string().optional(),
  imageUrl: z.string().url({ message: "Please enter a valid URL" }).optional(),
  tags: z.string().optional(),
  organizerId: z.string().optional(),
});

export type EventFormValues = z.infer<typeof eventSchema>;

// Define the form output type separately to include the transformed tags
export type EventFormSubmitValues = Omit<EventFormValues, 'tags'> & { 
  tags: string[] 
};

interface EventFormProps {
  defaultValues?: Partial<EventFormValues>;
  onSubmit: (data: EventFormSubmitValues) => void;
  isLoading?: boolean;
}

const EventForm = ({ defaultValues, onSubmit, isLoading }: EventFormProps) => {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      date: defaultValues?.date ? new Date(defaultValues.date) : new Date(),
      location: defaultValues?.location || "",
      capacity: defaultValues?.capacity || 1,
      price: defaultValues?.price || 0,
      category: defaultValues?.category || "",
      imageUrl: defaultValues?.imageUrl || "",
      tags: defaultValues?.tags || "",
      organizerId: defaultValues?.organizerId || "",
    },
  });

  const handleSubmit = (data: EventFormValues) => {
    const formattedData: EventFormSubmitValues = {
      ...data,
      tags: data.tags ? (data.tags as string).split(",").map((tag: string) => tag.trim()) : [],
    };
    
    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 p-4 bg-white rounded-xl shadow-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-700">Title</FormLabel>
                <FormControl>
                  <Input
                    className="focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Event title"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-700">Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal focus:ring-blue-500",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      className="bg-gray-700 text-white"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-700">Location</FormLabel>
                <FormControl>
                  <Input
                    className="focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Event location"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-700">Category</FormLabel>
                <FormControl>
                  <Input
                    className="focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Event category"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-700">Capacity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Event capacity"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-700">Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Event price"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-700">Image URL</FormLabel>
                <FormControl>
                  <Input
                    className="focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Event image URL"
                    {...field}
                  />
                </FormControl>
                <FormDescription>URL to the event banner image</FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-700">Tags</FormLabel>
                <FormControl>
                  <Input
                    className="focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Comma-separated tags"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Separate tags with commas (e.g., music, outdoor, family)</FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-700">Description</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[120px] focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Event description"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Event"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
