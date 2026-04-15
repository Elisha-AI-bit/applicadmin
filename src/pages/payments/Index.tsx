import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRealtimePayments } from '@/hooks/useRealtimeQuery';
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
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils';
import { Search, Filter, Download, Eye, CreditCard, DollarSign } from 'lucide-react';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

const methodOptions = [
  { value: 'all', label: 'All Methods' },
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cash', label: 'Cash' },
];

export function PaymentsList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const { data: payments = [], isLoading } = useRealtimePayments({
    status: statusFilter === 'all' ? undefined : statusFilter,
    method: methodFilter === 'all' ? undefined : methodFilter,
  });

  // Filter payments based on search query
  const filteredPayments = useMemo(() => {
    return payments.filter(payment =>
      payment.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [payments, searchQuery]);

  const totalRevenue = useMemo(() => 
    filteredPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    [filteredPayments]
  );
  
  const pendingAmount = useMemo(() => 
    filteredPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    [filteredPayments]
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">Payments</h1>
          <p className="text-muted-foreground text-lg">Manage and track all payments</p>
        </div>
        <Button variant="outline" className="group hover:border-primary/50 transition-colors shadow-sm">
          <Download className="mr-2 h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover-lift border-primary/10 bg-gradient-to-br from-card to-blue-50/50 shadow-sm overflow-hidden relative group">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Revenue</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900/40">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">All completed transactions</p>
          </CardContent>
        </Card>
        <Card className="hover-lift border-yellow-500/10 bg-gradient-to-br from-card to-yellow-50/50 shadow-sm overflow-hidden relative group">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Pending</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-full dark:bg-yellow-900/40">
              <CreditCard className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{formatCurrency(pendingAmount)}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Awaiting payment</p>
          </CardContent>
        </Card>
        <Card className="hover-lift border-slate-500/10 bg-gradient-to-br from-card to-slate-50/50 shadow-sm overflow-hidden relative group">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-400 to-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Transactions</CardTitle>
            <div className="p-2 bg-slate-100 rounded-full dark:bg-slate-800/40">
              <CreditCard className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{payments?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Total records</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden mb-6">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <div className="font-semibold text-muted-foreground">Filters</div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                placeholder="Search by student name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/30 transition-all rounded-full shadow-inner"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[160px]">
                <CreditCard className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                {methodOptions.map((option) => (
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
              <TableHead className="pl-6 font-semibold">Transaction ID</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  {searchQuery || statusFilter !== 'all' || methodFilter !== 'all' ? 'No payments found matching your criteria' : 'No payments found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow 
                  key={payment.id}
                  onClick={() => navigate(`/payments/${payment.id}`)}
                  className="group cursor-pointer hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors border-b-muted/50"
                >
                  <TableCell className="font-medium pl-6 text-primary">#{payment.id.substring(0, 8)}</TableCell>
                  <TableCell className="font-semibold group-hover:text-primary transition-colors">{payment.studentName}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell className="capitalize">{payment.method.replace('_', ' ')}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(payment.status)} shadow-sm`}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm font-medium">{formatDate(payment.createdAt)}</TableCell>
                  <TableCell className="text-right pr-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 bg-primary/5 hover:bg-primary text-primary hover:text-primary-foreground shadow-sm"
                      onClick={(e) => { e.stopPropagation(); navigate(`/payments/${payment.id}`); }}
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
