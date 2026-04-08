import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, Download, DollarSign, TrendingUp, CreditCard, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export function FinancialReport() {
  const navigate = useNavigate();

  const { data: payments } = useQuery({
    queryKey: ['payments'],
    queryFn: () => mockApi.getPayments(),
  });

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: mockApi.getDashboardStats,
  });

  const totalRevenue = payments?.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0) || 0;
  const pendingAmount = payments?.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0) || 0;
  const refundedAmount = payments?.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0) || 0;

  const paymentMethodData = [
    { method: 'Credit Card', count: payments?.filter(p => p.method === 'credit_card').length || 0, amount: payments?.filter(p => p.method === 'credit_card' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0) || 0 },
    { method: 'Mobile Money', count: payments?.filter(p => p.method === 'mobile_money').length || 0, amount: payments?.filter(p => p.method === 'mobile_money' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0) || 0 },
    { method: 'Bank Transfer', count: payments?.filter(p => p.method === 'bank_transfer').length || 0, amount: payments?.filter(p => p.method === 'bank_transfer' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0) || 0 },
    { method: 'Cash', count: payments?.filter(p => p.method === 'cash').length || 0, amount: payments?.filter(p => p.method === 'cash' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0) || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/reports')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">Revenue analysis and payment metrics</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <CreditCard className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pendingAmount)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunded</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(refundedAmount)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue - refundedAmount)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue collection</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.revenueTrend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(value) => `K${value}`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="amount" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Revenue by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentMethodData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `K${value}`} />
                <YAxis dataKey="method" type="category" width={100} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payment Summary by Method</CardTitle>
            <CardDescription>Transaction counts and amounts</CardDescription>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {paymentMethodData.map((method) => (
              <Card key={method.method}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{method.method}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(method.amount)}</div>
                  <p className="text-sm text-muted-foreground">{method.count} transactions</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
