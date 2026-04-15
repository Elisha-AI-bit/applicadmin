import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';
import { Mail, MessageSquare, Send, Plus, Search, Bell, Clock } from 'lucide-react';

export function Communications() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: mockApi.getNotifications,
  });

  const { data: templates } = useQuery({
    queryKey: ['templates'],
    queryFn: mockApi.getTemplates,
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">Communications</h1>
          <p className="text-muted-foreground text-lg">Manage notifications and message templates</p>
        </div>
        <Button onClick={() => navigate('/app/communications/send')} className="shadow-md hover:shadow-lg transition-all group">
          <Send className="mr-2 h-4 w-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
          Send Notification
        </Button>
      </div>

      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">Message History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4 border-b bg-muted/20">
              <div className="relative group max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/30 transition-all rounded-full shadow-inner"
                />
              </div>
            </CardHeader>
            <CardContent>
              {notifications?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No messages sent yet</p>
              ) : (
                <div className="space-y-4">
                  {notifications?.map((notification) => (
                    <div key={notification.id} className="flex items-start justify-between rounded-xl border border-muted/50 p-5 group hover:bg-primary/5 hover:border-primary/20 transition-all cursor-default">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          {notification.type === 'email' ? (
                            <Mail className="h-5 w-5 text-primary" />
                          ) : notification.type === 'sms' ? (
                            <MessageSquare className="h-5 w-5 text-primary" />
                          ) : (
                            <Bell className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(notification.sentAt || notification.createdAt)}
                            </span>
                            <span>{notification.recipients.length} recipients</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={notification.status === 'sent' ? 'bg-green-100 text-green-800 shadow-sm' : 'bg-yellow-100 text-yellow-800 shadow-sm'}>
                        {notification.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">Manage your message templates</p>
            <Button variant="outline" onClick={() => navigate('/app/communications/templates')}>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates?.map((template) => (
              <Card key={template.id} className="group border-none shadow-md hover:shadow-xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm transition-all duration-300 overflow-hidden relative">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/20 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{template.name}</CardTitle>
                    <Badge variant="outline" className="shadow-sm group-hover:bg-primary/5">{template.type}</Badge>
                  </div>
                  <CardDescription className="line-clamp-1">{template.subject}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{template.body}</p>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {template.variables.map((variable) => (
                      <Badge key={variable} variant="secondary" className="text-xs">
                        {'{'}{'{'}${variable}{'}'}{'}'}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
