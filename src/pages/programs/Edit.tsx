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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export function ProgramEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const { data: existingProgram } = useQuery({
    queryKey: ['program', id],
    queryFn: () => firebaseApi.programs.getProgram(id!),
    enabled: isEditing,
  });

  const { data: schools = [] } = useQuery({
    queryKey: ['schools'],
    queryFn: () => firebaseApi.schools.getSchools(),
  });

  const [formData, setFormData] = useState({
    school_id: existingProgram?.school_id || '',
    program_name: existingProgram?.program_name || '',
    program_code: existingProgram?.program_code || '',
    qualification_type: existingProgram?.qualification_type || 'Degree',
    duration_years: existingProgram?.duration_years?.toString() || '4',
    total_semesters: existingProgram?.total_semesters?.toString() || '8',
    entry_requirements: existingProgram?.entry_requirements || '',
    description: existingProgram?.description || '',
    status: existingProgram?.status || 'draft',
    isActive: existingProgram?.isActive ?? true,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const data = {
        program_id: existingProgram?.program_id || formData.program_code.trim() || `PRG-${Date.now()}`,
        school_id: formData.school_id,
        program_name: formData.program_name,
        program_code: formData.program_code,
        qualification_type: formData.qualification_type as 'Degree' | 'Diploma' | 'Certificate',
        duration_years: Number(formData.duration_years) || 0,
        total_semesters: Number(formData.total_semesters) || 0,
        entry_requirements: formData.entry_requirements,
        description: formData.description,
        status: formData.status as 'draft' | 'published' | 'closed' | 'archived',
        isActive: formData.isActive,
        firestoreSync: existingProgram?.firestoreSync || { syncStatus: 'pending' as const },
        createdBy: existingProgram?.createdBy || 'admin1',
      };

      if (isEditing) {
        return firebaseApi.programs.updateProgram(id!, data);
      }
      return firebaseApi.programs.createProgram(data as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast.success(isEditing ? 'Program updated successfully' : 'Program created successfully');
      navigate('/programs');
    },
    onError: () => {
      toast.error('Failed to save program');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/programs')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEditing ? 'Edit Program' : 'Add Program'}</h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update program information' : 'Create a program and link it to a school'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Program Information</CardTitle>
            <CardDescription>Core program details and school linkage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="school_id">School *</Label>
              <Select
                value={formData.school_id}
                onValueChange={(value) => setFormData({ ...formData, school_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select school" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.school_id}>
                      {school.school_name} ({school.school_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="program_name">Program Name *</Label>
                <Input
                  id="program_name"
                  value={formData.program_name}
                  onChange={(e) => setFormData({ ...formData, program_name: e.target.value })}
                  placeholder="e.g., Bachelor of Computer Science"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="program_code">Program Code *</Label>
                <Input
                  id="program_code"
                  value={formData.program_code}
                  onChange={(e) => setFormData({ ...formData, program_code: e.target.value.toUpperCase() })}
                  placeholder="e.g., BCS"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="qualification_type">Qualification Type *</Label>
                <Select
                  value={formData.qualification_type}
                  onValueChange={(value) => setFormData({ ...formData, qualification_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Degree">Degree</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration_years">Duration (Years) *</Label>
                <Input
                  id="duration_years"
                  type="number"
                  min="1"
                  value={formData.duration_years}
                  onChange={(e) => setFormData({ ...formData, duration_years: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_semesters">Total Semesters *</Label>
                <Input
                  id="total_semesters"
                  type="number"
                  min="1"
                  value={formData.total_semesters}
                  onChange={(e) => setFormData({ ...formData, total_semesters: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entry_requirements">Entry Requirements *</Label>
              <Textarea
                id="entry_requirements"
                value={formData.entry_requirements}
                onChange={(e) => setFormData({ ...formData, entry_requirements: e.target.value })}
                placeholder="Minimum qualifications needed to enroll"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What the program is about"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
            <CardDescription>Program visibility and activity status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label>Active</Label>
                <p className="text-sm text-muted-foreground">Enable this program in admissions workflows</p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/programs')}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isEditing ? 'Update Program' : 'Create Program'}
          </Button>
        </div>
      </form>
    </div>
  );
}
