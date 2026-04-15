import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Bell, Globe, ChevronRight } from 'lucide-react';

export function Settings() {
  const navigate = useNavigate();

  const settingsGroups = [
    {
      title: 'Profile',
      description: 'Manage your personal information',
      icon: User,
      href: '/settings/profile',
    },
    {
      title: 'Security',
      description: 'Password and authentication settings',
      icon: Shield,
      href: '/settings/security',
    },
    {
      title: 'Notifications',
      description: 'Configure email and push notifications',
      icon: Bell,
      href: '#',
    },
    {
      title: 'System',
      description: 'Application-wide settings',
      icon: Globe,
      href: '#',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">Settings</h1>
        <p className="text-muted-foreground text-lg">Manage your account and application settings</p>
      </div>

      <div className="grid gap-4">
        {settingsGroups.map((group) => (
          <Card
            key={group.title}
            className="group border-none shadow-md hover:shadow-xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm transition-all duration-300 overflow-hidden cursor-pointer relative"
            onClick={() => navigate(group.href)}
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/20 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors shadow-inner group-hover:scale-105">
                  <group.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{group.title}</CardTitle>
                  <CardDescription className="text-sm mt-1">{group.description}</CardDescription>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden mt-8">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Application-wide preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email updates about applications</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Compact Mode</Label>
              <p className="text-sm text-muted-foreground">Show more content with less spacing</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
