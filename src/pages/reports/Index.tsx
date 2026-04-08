import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, DollarSign, Users, ArrowRight, TrendingUp, Download } from 'lucide-react';

export function Reports() {
  const navigate = useNavigate();

  const reportTypes = [
    {
      title: 'Application Reports',
      description: 'Analyze application trends, status distribution, and processing times',
      icon: FileText,
      href: '/reports/applications',
      color: 'bg-blue-500',
    },
    {
      title: 'Financial Reports',
      description: 'Revenue analysis, payment trends, and outstanding balances',
      icon: DollarSign,
      href: '/reports/financial',
      color: 'bg-green-500',
    },
    {
      title: 'Student Analytics',
      description: 'Student demographics, enrollment patterns, and engagement metrics',
      icon: Users,
      href: '#',
      color: 'bg-purple-500',
    },
    {
      title: 'Performance Metrics',
      description: 'Conversion rates, processing efficiency, and success indicators',
      icon: TrendingUp,
      href: '#',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground">View detailed reports and analytics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reportTypes.map((report) => (
          <Card key={report.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${report.color} text-white`}>
                    <report.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => navigate(report.href)}
              >
                View Report
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Export</CardTitle>
          <CardDescription>Download raw data for external analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Applications (CSV)
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Payments (CSV)
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Students (CSV)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
