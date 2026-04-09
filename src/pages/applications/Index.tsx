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
    const firstName = app.personalInfo?.firstName?.toLowerCase() || '';
    const lastName = app.personalInfo?.lastName?.toLowerCase() || '';
    const email = app.contactInfo?.email?.toLowerCase() || '';
    const school = app.programmeChoice?.faculty?.toLowerCase() || '';
    const program = app.programmeChoice?.programmeName?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    return (
      firstName.includes(query) ||
      lastName.includes(query) ||
      email.includes(query) ||
      school.includes(query) ||
      program.includes(query) ||
      app.applicationId.toLowerCase().includes(query)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">Manage and review student applications</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by student name, email, or school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
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

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
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
                <TableRow key={app.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{app.personalInfo?.firstName} {app.personalInfo?.lastName}</p>
                      <p className="text-sm text-muted-foreground">{app.contactInfo?.email}</p>
                      <p className="text-xs text-primary font-mono font-bold mt-1">#{app.applicationId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{app.programmeChoice?.faculty}</p>
                      <p className="text-sm text-muted-foreground">{app.programmeChoice?.programmeName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(app.status)}>
                      {app.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentBadgeColor(app.paymentStatus)}>
                      {app.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(app.submittedAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/applications/${app.id}`)}
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
