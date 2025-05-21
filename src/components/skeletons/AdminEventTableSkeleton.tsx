import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

const AdminEventTableSkeleton = () => {
  return (
<div className="bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-soft overflow-hidden">
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          <TableHead className="font-semibold">Event</TableHead>
          <TableHead className="font-semibold">Date</TableHead>
          <TableHead className="font-semibold">Location</TableHead>
          <TableHead className="font-semibold">Category</TableHead>
          <TableHead className="font-semibold">Capacity</TableHead>
          <TableHead className="font-semibold">Price</TableHead>
          <TableHead className="text-right font-semibold">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i} className="group hover:bg-muted/30 transition-colors duration-150">
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                <div className="h-12 w-20 rounded-md bg-gradient-to-r from-muted/20 via-white/30 to-muted/20 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-gradient-to-r from-muted/20 via-white/30 to-muted/20 animate-pulse"></div>
                  <div className="flex gap-1">
                    <div className="h-5 w-12 rounded-full bg-gradient-to-r from-muted/20 via-white/30 to-muted/20 animate-pulse"></div>
                    <div className="h-5 w-10 rounded-full bg-gradient-to-r from-muted/20 via-white/30 to-muted/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-muted/20 via-white/30 to-muted/20 animate-pulse"></div>
                <div className="h-4 w-24 rounded bg-gradient-to-r from-muted/20 via-white/30 to-muted/20 animate-pulse"></div>
              </div>
            </TableCell>
            <TableCell>
              <div className="h-4 w-20 rounded bg-gradient-to-r from-muted/20 via-white/30 to-muted/20 animate-pulse"></div>
            </TableCell>
            <TableCell>
              <div className="h-6 w-16 rounded-full bg-gradient-to-r from-muted/20 via-white/30 to-muted/20 animate-pulse"></div>
            </TableCell>
            <TableCell>
              <div className="h-4 w-12 rounded bg-gradient-to-r from-muted/20 via-white/30 to-muted/20 animate-pulse"></div>
            </TableCell>
            <TableCell>
              <div className="h-4 w-16 rounded bg-gradient-to-r from-muted/20 via-white/30 to-muted/20 animate-pulse"></div>
            </TableCell>
            <TableCell className="text-right">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-muted/20 via-white/30 to-muted/20 animate-pulse ml-auto"></div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
</div>
  )
}

export default AdminEventTableSkeleton
