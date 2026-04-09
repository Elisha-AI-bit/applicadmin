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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communications</h1>
          <p className="text-muted-foreground">Manage notifications and message templates</p>
        </div>
        <Button onClick={() => navigate('/communications/send')}>
          <Send className="mr-2 h-4 w-4" />
          Send Notification
        </Button>
      </div>

      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">Message History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              {notifications?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No messages sent yet</p>
              ) : (
                <div className="space-y-4">
                  {notifications?.map((notification) => (
                    <div key={notification.id} className="flex items-start justify-between rounded-lg border p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
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
                      <Badge className={notification.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
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
            <Button variant="outline" onClick={() => navigate('/communications/templates')}>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates?.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="outline">{template.type}</Badge>
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
