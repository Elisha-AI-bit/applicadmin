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
import { CardSkeleton } from '@/components/ui/skeleton';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#EF4444', '#F59E0B'];

export function Dashboard() {
  // Real-time subscriptions
  const { data: applications = [] } = useRealtimeApplications();
  const { data: payments = [] } = useRealtimePayments();
  const { data: activities = [] } = useRealtimeActivities(5);
  
  const [loading, setLoading] = useState(true);

  // Calculate stats in real-time
  const calculateStats = (): DashboardStats => {
    const totalApplications = applications.length;
    const pendingReviews = applications.filter((a: any) => a.status === 'pending' || a.status === 'under_review').length;
    const approved = applications.filter((a: any) => a.status === 'approved').length;
    const rejected = applications.filter((a: any) => a.status === 'rejected').length;
    const revenue = payments.filter((p: any) => p.status === 'completed').reduce((sum: number, p: any) => sum + p.amount, 0);
    const pendingPayments = payments.filter((p: any) => p.status === 'pending').length;

    // Aggregate by Status
    const statusCounts: Record<string, number> = {
      pending: 0,
      under_review: 0,
      approved: 0,
      rejected: 0,
      waitlisted: 0,
    };
    applications.forEach((a: any) => {
      if (statusCounts[a.status] !== undefined) statusCounts[a.status]++;
    });

    // Aggregate by Faculty/School
    const schoolCounts: Record<string, number> = {};
    applications.forEach((a: any) => {
      const school = a.programmeChoice?.faculty || 'Unspecified';
      schoolCounts[school] = (schoolCounts[school] || 0) + 1;
    });

    // Simple trend aggregation
    const trend: Record<string, number> = {};
    applications.forEach((a: any) => {
      if (a.submittedAt) {
        const date = a.submittedAt.split('T')[0];
        trend[date] = (trend[date] || 0) + 1;
      }
    });

    return {
      totalApplications,
      pendingReviews,
      approved,
      rejected,
      revenue,
      pendingPayments,
      applicationsTrend: Object.entries(trend)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-10),
      statusDistribution: Object.entries(statusCounts).map(([status, count]) => ({ 
        status: status.replace('_', ' '), 
        count 
      })),
      revenueTrend: [], // Simplified
      applicationsBySchool: Object.entries(schoolCounts)
        .map(([school, count]) => ({ school, count }))
        .sort((a, b) => b.count - a.count)
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
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
        <div className="space-y-1">
          <div className="h-12 w-48 bg-muted rounded animate-pulse mb-2"></div>
          <div className="h-6 w-96 bg-muted rounded animate-pulse"></div>
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CardSkeleton />
          </div>
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">Overview of your school application management system</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift border-primary/10 bg-gradient-to-br from-card to-blue-50/50 shadow-sm overflow-hidden relative group">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Applications</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900/40">
              <FileText className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{formatNumber(stats?.totalApplications || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">All time applications</p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-yellow-500/10 bg-gradient-to-br from-card to-yellow-50/50 shadow-sm overflow-hidden relative group">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Pending Reviews</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-full dark:bg-yellow-900/40">
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{formatNumber(stats?.pendingReviews || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Awaiting final review</p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-green-500/10 bg-gradient-to-br from-card to-green-50/50 shadow-sm overflow-hidden relative group">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Approved</CardTitle>
            <div className="p-2 bg-green-100 rounded-full dark:bg-green-900/40">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{formatNumber(stats?.approved || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Successfully processed</p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-indigo-500/10 bg-gradient-to-br from-card to-indigo-50/50 shadow-sm overflow-hidden relative group">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Revenue</CardTitle>
            <div className="p-2 bg-indigo-100 rounded-full dark:bg-indigo-900/40">
              <DollarSign className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">{formatCurrency(stats?.revenue || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Total collected</p>
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
                  {(stats?.statusDistribution || []).map((_entry, index) => (
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
      <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 pb-4">
          <div>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest actions and updates</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="hover-lift">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {activities?.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200">{activity.description}</p>
                  <p className="text-xs text-muted-foreground font-medium">
                    by <span className="text-primary">{activity.actor}</span> • {formatDate(activity.createdAt)}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-700">{activity.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
