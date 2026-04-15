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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">Reports & Analytics</h1>
        <p className="text-muted-foreground text-lg">View detailed reports and analytics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reportTypes.map((report) => (
          <Card key={report.title} className="group border-none shadow-md hover:shadow-xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm transition-all duration-300 overflow-hidden relative">
            <div className={`absolute inset-x-0 top-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity ${report.color}`} />
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${report.color} text-white shadow-inner group-hover:scale-105 transition-transform`}>
                    <report.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{report.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">{report.description}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="ghost"
                className="w-full justify-between opacity-80 group-hover:opacity-100 transition-all bg-primary/5 hover:bg-primary text-primary hover:text-primary-foreground shadow-sm"
                onClick={() => navigate(report.href)}
              >
                View Report
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden mt-8">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <CardTitle>Quick Export</CardTitle>
          <CardDescription>Download raw data for external analysis</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="group hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm">
              <Download className="mr-2 h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
              Export Applications (CSV)
            </Button>
            <Button variant="outline" className="group hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm">
              <Download className="mr-2 h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
              Export Payments (CSV)
            </Button>
            <Button variant="outline" className="group hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm">
              <Download className="mr-2 h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
              Export Students (CSV)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
