import { useState } from "react";
import { CalendarIcon, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { EventFilters } from "@/types";

interface EventsFilterProps {
  categories: string[];
  tags: string[];
  onFilterChange: (filters: EventFilters) => void;
}

export default function EventsFilter({
  categories,
  tags,
  onFilterChange,
}: EventsFilterProps) {
  const [filters, setFilters] = useState<EventFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const handleSearch = () => {
    const newFilters = { ...filters, search: searchTerm || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCategoryChange = (category: string) => {
    // Create new filters object based on selected category
    const newFilters = { ...filters };

    if (category === "all") {
      // Remove category filter if "all" is selected
      if (newFilters.category) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { category: _, ...rest } = newFilters;
        setFilters(rest);
        onFilterChange(rest);
        return;
      }
    } else {
      // Add category filter
      newFilters.category = category;
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTagToggle = (tag: string) => {
    let newTags: string[];

    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter((t) => t !== tag);
    } else {
      newTags = [...selectedTags, tag];
    }

    setSelectedTags(newTags);

    // Update filters object with new tags or remove tags property if empty
    const newFilters = { ...filters };

    if (newTags.length === 0) {
      // Remove tags property completely if no tags are selected
      if (newFilters.tags) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { tags: _, ...rest } = newFilters;
        setFilters(rest);
        onFilterChange(rest);
      }
    } else {
      // Add tags to filters
      newFilters.tags = newTags;
      setFilters(newFilters);
      onFilterChange(newFilters);
    }
  };

  const handleDateChange = (type: "from" | "to", date?: Date) => {
    let newFilters: EventFilters = { ...filters };

    if (type === "from") {
      setDateFrom(date);

      if (date) {
        newFilters.dateFrom = format(date, "yyyy-MM-dd");
      } else if (filters.dateFrom) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { dateFrom: _, ...rest } = newFilters;
        newFilters = rest;
      }
    } else {
      setDateTo(date);

      if (date) {
        newFilters.dateTo = format(date, "yyyy-MM-dd");
      } else if (filters.dateTo) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { dateTo: _, ...rest } = newFilters;
        newFilters = rest;
      }
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    setFilters({});
    setSearchTerm("");
    setSelectedTags([]);
    setDateFrom(undefined);
    setDateTo(undefined);
    onFilterChange({});
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="w-full md:w-1/3">
          <div className="relative">
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-10"
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground cursor-pointer"
              onClick={handleSearch}
            />
          </div>
        </div>

        <div className="w-full md:w-1/4">
          <Select
            value={filters.category || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-[180px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-primary/50">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-lg">
              <SelectItem
                value="all"
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
              >
                All Categories
              </SelectItem>
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex space-x-2">
  <div>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[140px] justify-start text-left font-normal",
            "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800",
            "text-gray-700 dark:text-gray-300",
            !dateFrom && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          {dateFrom ? format(dateFrom, "PPP") : "From Date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 border-gray-200 dark:border-gray-700 shadow-lg rounded-md" 
        align="start"
      >
        <Calendar
          mode="single"
          selected={dateFrom}
          onSelect={(date) => handleDateChange("from", date)}
          className="pointer-events-auto bg-white dark:bg-gray-800"
          classNames={{
            day_selected: "bg-primary hover:bg-primary/90 text-white",
            day_today: "border border-primary text-primary",
            day_disabled: "text-gray-400 dark:text-gray-500",
          }}
        />
      </PopoverContent>
    </Popover>
  </div>

  <div>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[140px] justify-start text-left font-normal",
            "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800",
            "text-gray-700 dark:text-gray-300",
            !dateTo && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          {dateTo ? format(dateTo, "PPP") : "To Date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 border-gray-200 dark:border-gray-700 shadow-lg rounded-md" 
        align="start"
      >
        <Calendar
          mode="single"
          selected={dateTo}
          onSelect={(date) => handleDateChange("to", date)}
          disabled={(date) => (dateFrom ? date < dateFrom : false)}
          className="pointer-events-auto bg-white dark:bg-gray-800"
          classNames={{
            day_selected: "bg-primary hover:bg-primary/90 text-white",
            day_today: "border border-primary text-primary",
            day_disabled: "text-gray-400 dark:text-gray-500",
          }}
        />
      </PopoverContent>
    </Popover>
  </div>
</div>

        <Button variant="outline" onClick={resetFilters} size="icon">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {tags.length > 0 && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all",
                  selectedTags.includes(tag)
                    ? "bg-primary"
                    : "hover:bg-primary/10"
                )}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {Object.keys(filters).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center mt-2 text-sm text-muted-foreground"
        >
          <span>Active filters:</span>
          <div className="flex flex-wrap gap-2 ml-2">
            {filters.category && (
              <Badge variant="secondary">Category: {filters.category}</Badge>
            )}
            {filters.dateFrom && (
              <Badge variant="secondary">From: {filters.dateFrom}</Badge>
            )}
            {filters.dateTo && (
              <Badge variant="secondary">To: {filters.dateTo}</Badge>
            )}
            {filters.search && (
              <Badge variant="secondary">Search: {filters.search}</Badge>
            )}
            {filters.tags &&
              filters.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  Tag: {tag}
                </Badge>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
