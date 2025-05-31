import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

type DataTableCardProps = {
  title: string;
  icon: React.ReactNode;
  description: string;
  viewAllLink: string;
  viewAllText: string;
  children: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyText?: string;
};

export const DataTableCard = ({
  title,
  icon,
  description,
  viewAllLink,
  viewAllText,
  children,
  isLoading = false,
  isEmpty = false,
  emptyText = "No data found",
}: DataTableCardProps) => {
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg border-none bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-800 dark:text-white">
          <span className="mr-2 rounded-md bg-primary/10 p-1 text-primary">{icon}</span>
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <span className="text-sm text-muted-foreground">Loading data...</span>
          </div>
        ) : isEmpty ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            {emptyText}
          </div>
        ) : (
          <Table className="mb-4">
            {children}
          </Table>
        )}

        <div className="mt-2">
          <Link
            to={viewAllLink}
            className="group flex w-fit items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            aria-label={`View all ${title.toLowerCase()}`}
          >
            {viewAllText}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};