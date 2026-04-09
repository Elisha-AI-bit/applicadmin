import { useParams, useNavigate } from 'react-router-dom';
import { useRealtimeDocument, useRealtimePrograms } from '@/hooks/useRealtimeQuery';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStatusColor } from '@/lib/utils';
import {
  ArrowLeft,
  Edit,
  GraduationCap,
  Plus,
} from 'lucide-react';

export function SchoolDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: school, isLoading } = useRealtimeDocument('schools', id!);

  const { data: programs } = useRealtimePrograms({ 
    schoolId: school?.school_id 
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">School not found</h1>
        <Button onClick={() => navigate('/schools')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Schools
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/schools')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{school.school_name}</h1>
            <p className="text-muted-foreground">Code: {school.school_code}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/schools/${school.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="structure">Structure</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{school.description}</p>
                </CardContent>
              </Card>

            </TabsContent>

            <TabsContent value="programs">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Programs</CardTitle>
                    <CardDescription>{programs?.length || 0} programs available in this school</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => navigate(`/programs/new?schoolId=${school.school_id}`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Program
                  </Button>
                </CardHeader>
                <CardContent>
                  {programs?.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No programs yet</p>
                  ) : (
                    <div className="space-y-4">
                      {programs?.map((program) => (
                        <div key={program.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-3">
                            <GraduationCap className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{program.program_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {program.qualification_type} • {program.duration_years} years • {program.total_semesters} semesters
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(program.status)}>
                            {program.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="structure">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Structure</CardTitle>
                  <CardDescription>
                    This system is configured for one university with schools, programs, and courses.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">University (Top Level):</span> This platform
                    manages one university as the top-level institution.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">School:</span> A division that groups related
                    programs (for example, Engineering, Education, Business, or Medicine). A school belongs to the
                    university and contains many programs.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Program:</span> A degree or course path students
                    enroll in. A program belongs to one school and can include courses/modules, students, and
                    lecturers.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Course / Module:</span> Individual subjects within a
                    program. A course belongs to one program, and a program has many courses.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Students:</span> Students belong to a program and
                    therefore indirectly belong to the school and the university.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Lecturers:</span> Lecturers can belong to a school
                    and can teach multiple courses.
                  </p>
                  <div className="rounded-md border bg-muted/40 p-3">
                    <p className="font-medium text-foreground">Hierarchy</p>
                    <p>University -&gt; School -&gt; Program -&gt; Course / Module</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge className={getStatusColor(school.status)}>{school.status}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Active</span>
                <Badge variant={school.isActive ? 'default' : 'secondary'}>
                  {school.isActive ? 'Yes' : 'No'}
                </Badge>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
