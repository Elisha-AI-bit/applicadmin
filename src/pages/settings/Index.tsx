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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application settings</p>
      </div>

      <div className="grid gap-4">
        {settingsGroups.map((group) => (
          <Card
            key={group.title}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(group.href)}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <group.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{group.title}</CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Application-wide preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
