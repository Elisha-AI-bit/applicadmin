import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ArrowLeft, Send, Users, Mail, MessageSquare, Bell } from 'lucide-react';

export function SendNotification() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'email' | 'sms' | 'push'>('email');
  const [isSending, setIsSending] = useState(false);

  const { data: templates } = useQuery({
    queryKey: ['templates'],
    queryFn: mockApi.getTemplates,
  });

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates?.find((t) => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setMessage(template.body);
      setType(template.type as any);
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success('Notification sent successfully');
    setIsSending(false);
    navigate('/communications');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/communications')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Send Notification</h1>
          <p className="text-muted-foreground">Compose and send messages to students</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Message</CardTitle>
              <CardDescription>Compose your notification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Use Template</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None - Custom message</SelectItem>
                    {templates?.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notification Type</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={type === 'email' ? 'default' : 'outline'}
                    onClick={() => setType('email')}
                    className="flex-1"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={type === 'sms' ? 'default' : 'outline'}
                    onClick={() => setType('sms')}
                    className="flex-1"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    SMS
                  </Button>
                  <Button
                    type="button"
                    variant={type === 'push' ? 'default' : 'outline'}
                    onClick={() => setType('push')}
                    className="flex-1"
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Push
                  </Button>
                </div>
              </div>

              {type === 'email' && (
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject..."
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  rows={8}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recipients</CardTitle>
              <CardDescription>Who should receive this message</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Recipient Type</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="pending">Pending Applications</SelectItem>
                    <SelectItem value="approved">Approved Applications</SelectItem>
                    <SelectItem value="custom">Custom List</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipients">Custom Recipients (comma-separated emails)</Label>
                <Textarea
                  id="recipients"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  placeholder="student1@example.com, student2@example.com"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4 space-y-2">
                <p className="font-medium">{subject || 'No subject'}</p>
                <Separator />
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {message || 'No message content'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Button
            className="w-full"
            onClick={handleSend}
            disabled={isSending || !message.trim() || (type === 'email' && !subject.trim())}
          >
            {isSending ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isSending ? 'Sending...' : 'Send Notification'}
          </Button>
        </div>
      </div>
    </div>
  );
}
