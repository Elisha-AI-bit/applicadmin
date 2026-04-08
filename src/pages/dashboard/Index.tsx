import { useState, useEffect } from 'react';
import { useRealtimeApplications, useRealtimePayments, useRealtimeActivities } from '@/hooks/useRealtimeQuery';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import {
  FileText,
  Clock,
  CheckCircle,
  DollarSign,
  Activity,
  ArrowRight,
} from 'lucide-react';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { DashboardStats, Activity as ActivityType } from '@/types';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#EF4444', '#F59E0B'];

export function Dashboard() {
  // Real-time subscriptions
  const { data: applications = [], isLoading } = useRealtimeApplications();
  const { data: payments = [] } = useRealtimePayments();
  const { data: activities = [] } = useRealtimeActivities(5);
  
  const [loading, setLoading] = useState(true);

  // Calculate stats in real-time
  const calculateStats = (): DashboardStats => {
    const totalApplications = applications.length;
    const pendingReviews = applications.filter((a: any) => a.status === 'pending').length;
    const approved = applications.filter((a: any) => a.status === 'approved').length;
    const rejected = applications.filter((a: any) => a.status === 'rejected').length;
    const revenue = payments.filter((p: any) => p.status === 'completed').reduce((sum: number, p: any) => sum + p.amount, 0);
    const pendingPayments = payments.filter((p: any) => p.status === 'pending').length;

    return {
      totalApplications,
      pendingReviews,
      approved,
      rejected,
      revenue,
      pendingPayments,
      applicationsTrend: [], // Would need time-based queries
      statusDistribution: [
        { status: 'pending', count: applications.filter((a: any) => a.status === 'pending').length },
        { status: 'under_review', count: applications.filter((a: any) => a.status === 'under_review').length },
        { status: 'approved', count: applications.filter((a: any) => a.status === 'approved').length },
        { status: 'rejected', count: applications.filter((a: any) => a.status === 'rejected').length },
        { status: 'waitlisted', count: applications.filter((a: any) => a.status === 'waitlisted').length },
      ],
      revenueTrend: [], // Would need time-based queries
      applicationsBySchool: [] // Would need aggregation
    };
  };

  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Update stats when data changes
  useEffect(() => {
    if (applications.length > 0 || payments.length > 0) {
      setStats(calculateStats());
      setLoading(false);
    }
  }, [applications, payments]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your school application management system</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats?.totalApplications || 0)}</div>
            <p className="text-xs text-muted-foreground">All time applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats?.pendingReviews || 0)}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats?.approved || 0)}</div>
            <p className="text-xs text-muted-foreground">Successfully approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.revenue || 0)}</div>
            <p className="text-xs text-muted-foreground">Total collected</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Applications Over Time</CardTitle>
            <CardDescription>Monthly application submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats?.applicationsTrend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Application status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats?.statusDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="status"
                >
                  {(stats?.statusDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue & School Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue collection</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats?.revenueTrend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="amount" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applications by School</CardTitle>
            <CardDescription>Top performing institutions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={stats?.applicationsBySchool || []}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="school" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions and updates</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities?.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    by {activity.actor} • {formatDate(activity.createdAt)}
                  </p>
                </div>
                <Badge variant="outline">{activity.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
