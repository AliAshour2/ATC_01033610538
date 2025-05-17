import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table} from "@/components/ui/table";
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading data...</div>
        ) : isEmpty ? (
          <div className="text-center py-4 text-muted-foreground">{emptyText}</div>
        ) : (
          <Table>
            {children}
          </Table>
        )}
        <div className="mt-4">
          <Link
            to={viewAllLink}
            className="text-sm text-primary hover:underline inline-flex items-center"
            aria-label={`View all ${title.toLowerCase()}`}
          >
            {viewAllText}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};