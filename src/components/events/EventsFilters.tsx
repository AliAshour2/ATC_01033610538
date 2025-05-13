import { useState } from "react";
import { Search, X } from "lucide-react";
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

export default function EventsFilter({ categories, tags, onFilterChange }: EventsFilterProps) {
  const [filters, setFilters] = useState<EventFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const handleSearch = () => {
    onFilterChange({ ...filters, search: searchTerm });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };  const handleCategoryChange = (category: string) => {
    const newFilters = category === "all" 
      ? { ...filters, category: undefined }
      : { ...filters, category };
    
    
    
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
    
    const newFilters = { ...filters, tags: newTags.length > 0 ? newTags : undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (type: 'from' | 'to', date?: Date) => {
    if (type === 'from') {
      setDateFrom(date);
      if (date) {
        setFilters({ ...filters, dateFrom: format(date, 'yyyy-MM-dd') });
      } else {
        const { dateFrom, ...rest } = filters;
        setFilters(rest);
      }
    } else {
      setDateTo(date);
      if (date) {
        setFilters({ ...filters, dateTo: format(date, 'yyyy-MM-dd') });
      } else {
        const { dateTo, ...rest } = filters;
        setFilters(rest);
      }
    }
    
    // Only update if both dates are set or explicitly cleared
    if ((type === 'from' && dateTo) || (type === 'to' && dateFrom) || (!date)) {
      onFilterChange({
        ...filters,
        ...(type === 'from' 
          ? { dateFrom: date ? format(date, 'yyyy-MM-dd') : undefined }
          : { dateTo: date ? format(date, 'yyyy-MM-dd') : undefined }
        )
      });
    }
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
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
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
                <Button variant="outline" className={cn(!dateFrom && "text-muted-foreground")}>
                  {dateFrom ? format(dateFrom, "PPP") : "From Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={(date) => handleDateChange('from', date)}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn(!dateTo && "text-muted-foreground")}>
                  {dateTo ? format(dateTo, "PPP") : "To Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={(date) => handleDateChange('to', date)}
                  disabled={(date) => dateFrom ? date < dateFrom : false}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <Button variant="outline" onClick={resetFilters} size="icon">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
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
              className="cursor-pointer"
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </Badge>
          ))}
        </motion.div>
      </AnimatePresence>
      
      {Object.keys(filters).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center mt-2 text-sm text-muted-foreground"
        >
          <span>Active filters:</span>
          <div className="flex flex-wrap gap-2 ml-2">
            {filters.category && (
              <Badge variant="secondary">{filters.category}</Badge>
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
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
