import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRealtimeApplications } from '@/hooks/useRealtimeQuery';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate, getStatusColor } from '@/lib/utils';
import { Search, Filter, Download, Eye } from 'lucide-react';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'waitlisted', label: 'Waitlisted' },
];

export function ApplicationsList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Real-time subscription to applications
  const { data: applications = [], isLoading } = useRealtimeApplications(
    statusFilter === 'all' ? undefined : { status: statusFilter }
  );

  // Filter applications based on search query (client-side filtering for demo)
  const filteredApplications = applications.filter(app => {
    const studentName = (app.studentName || '').toLowerCase();
    const email = (app.studentEmail || '').toLowerCase();
    const school = (app.schoolName || '').toLowerCase();
    const program = (app.programName || '').toLowerCase();
    const appId = (app.id || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    return (
      studentName.includes(query) ||
      email.includes(query) ||
      school.includes(query) ||
      program.includes(query) ||
      appId.includes(query)
    );
  });

  const getPaymentBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">Applications</h1>
          <p className="text-muted-foreground text-lg">Manage and review student applications</p>
        </div>
        <Button variant="outline" className="group hover:border-primary/50 transition-colors shadow-sm">
          <Download className="mr-2 h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
          Export
        </Button>
      </div>

      <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden mb-6">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                placeholder="Search by student name, email, or school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/30 transition-all rounded-full shadow-inner"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6 font-semibold">Student</TableHead>
              <TableHead>School / Program</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {searchQuery || statusFilter !== 'all' ? 'No applications found matching your criteria' : 'No applications found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredApplications.map((app) => (
                <TableRow 
                  key={app.id}
                  onClick={() => navigate(`/applications/${app.id}`)}
                  className="group cursor-pointer hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors border-b-muted/50"
                >
                  <TableCell className="pl-6">
                    <div>
                      <p className="font-medium">{app.studentName}</p>
                      <p className="text-sm text-muted-foreground">{app.studentEmail}</p>
                      <p className="text-xs text-primary font-mono font-bold mt-1">#{app.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{app.schoolName}</p>
                      <p className="text-sm text-muted-foreground">{app.programName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(app.status)}>
                      {app.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentBadgeColor(app.paymentStatus || 'pending')}>
                      {app.paymentStatus || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(app.submittedAt || (app as any).createdAt)}</TableCell>
                  <TableCell className="text-right pr-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 bg-primary/5 hover:bg-primary text-primary hover:text-primary-foreground shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/applications/${app.id}`);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
