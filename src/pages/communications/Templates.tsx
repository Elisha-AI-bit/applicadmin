import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Save, Trash2, Edit2 } from 'lucide-react';

export function Templates() {
  const navigate = useNavigate();

  const { data: templates } = useQuery({
    queryKey: ['templates'],
    queryFn: mockApi.getTemplates,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/communications')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Message Templates</h1>
            <p className="text-muted-foreground">Create and manage notification templates</p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      <div className="grid gap-6">
        {templates?.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.subject}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">{template.type}</Badge>
                  <Button variant="ghost" size="icon">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="whitespace-pre-wrap text-sm">{template.body}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Available variables:</span>
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
    </div>
  );
}
