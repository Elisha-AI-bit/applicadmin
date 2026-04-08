import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { firebaseApi } from '@/lib/firebaseApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  Loader2,
} from 'lucide-react';

export function SchoolEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const { data: existingSchool } = useQuery({
    queryKey: ['school', id],
    queryFn: () => firebaseApi.schools.getSchool(id!),
    enabled: isEditing,
  });

  const [formData, setFormData] = useState({
    school_name: existingSchool?.school_name || '',
    school_code: existingSchool?.school_code || '',
    description: existingSchool?.description || '',
    status: existingSchool?.status || 'draft',
    isActive: existingSchool?.isActive ?? true,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const data = {
        school_id: existingSchool?.school_id || formData.school_code.trim() || `SCH-${Date.now()}`,
        school_name: formData.school_name,
        school_code: formData.school_code,
        description: formData.description,
        status: formData.status as any,
        isActive: formData.isActive,
        firestoreSync: existingSchool?.firestoreSync || { syncStatus: 'pending' as const },
        createdBy: existingSchool?.createdBy || 'admin1',
      };

      if (isEditing) {
        return firebaseApi.schools.updateSchool(id!, data);
      }
      return firebaseApi.schools.createSchool(data as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast.success(isEditing ? 'School updated successfully' : 'School created successfully');
      navigate('/schools');
    },
    onError: () => {
      toast.error('Failed to save school');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/schools')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Edit School' : 'Add School'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update school information' : 'Create a new school in this university'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>School name and description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="school_name">School Name *</Label>
              <Input
                id="school_name"
                value={formData.school_name}
                onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                placeholder="e.g., School of Education"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="school_code">School Code *</Label>
              <Input
                id="school_code"
                value={formData.school_code}
                onChange={(e) => setFormData({ ...formData, school_code: e.target.value.toUpperCase() })}
                placeholder="e.g., EDU, ENG, BUS"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the academic school..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
            <CardDescription>School visibility and activity status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Active</Label>
                <p className="text-sm text-muted-foreground">Enable this school in admissions workflows</p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/schools')}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isEditing ? 'Update School' : 'Create School'}
          </Button>
        </div>
      </form>
    </div>
  );
}
