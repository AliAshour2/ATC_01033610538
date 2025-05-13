import { EventCard } from "@/components/events/EventCard";
import EventsFilter from "@/components/events/EventsFilters";
import { Button } from "@/components/ui/button";
import { useGetEventsQuery } from "@/features/events/eventApi";
import type { EventFilters } from "@/types";
import { useState, useMemo, useCallback } from "react";

const HomePage = () => {
  const [filters, setFilters] = useState<EventFilters>({});
  const { data: events, isLoading, error, isFetching } = useGetEventsQuery(filters);

  // Extract unique categories and tags from events
  const { categories, tags } = useMemo(() => {
    if (!events) return { categories: [], tags: [] };
    
    const categoriesSet = new Set<string>();
    const tagsSet = new Set<string>();
    
    events.forEach(event => {
      if (event.category) categoriesSet.add(event.category);
      event.tags?.forEach(tag => tagsSet.add(tag));
    });
    
    return {
      categories: Array.from(categoriesSet).sort(),
      tags: Array.from(tagsSet).sort()
    };
  }, [events]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: EventFilters) => {
    setFilters(newFilters);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-destructive text-lg">Failed to load events</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }  if (!events?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground text-lg">
          {Object.keys(filters).length > 0 
            ? "No events found matching your filters"
            : "No upcoming events found"}
        </p>
        {Object.keys(filters).length > 0 && (
          <Button variant="outline" onClick={() => setFilters({})}>
            Clear Filters
          </Button>
        )}
      </div>
    );
  }  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
        <EventsFilter 
          categories={categories}
          tags={tags}
          onFilterChange={handleFilterChange}
        />
      </div>
      
      <div className="relative">
        {isFetching && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <EventCard.Root key={event.id} index={index}>
              <EventCard.Image src={event.imageUrl || "/placeholder.jpg"} alt={event.title} />
              <EventCard.Content event={event} />
              <EventCard.Footer eventId={event.id} isBooked={false} />
            </EventCard.Root>
          ))}
        </div>
      </div>
      <section className="py-16 bg-muted rounded-xl my-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Why Book with BloomEvents?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Discover Events</h3>
              <p className="text-muted-foreground">
                Find events that match your interests and schedule
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Book Instantly</h3>
              <p className="text-muted-foreground">
                Secure your spot with our easy booking system
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Enjoy the Experience</h3>
              <p className="text-muted-foreground">
                Create memories at the best events in your area
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
