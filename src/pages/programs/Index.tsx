import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRealtimePrograms, useRealtimeSchools } from '@/hooks/useRealtimeQuery';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Plus, Edit, BookOpen } from 'lucide-react';
import type { Program, School } from '@/types';
import { getStatusColor } from '@/lib/utils';

export function ProgramsList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: programs = [], isLoading } = useRealtimePrograms();
  const { data: schools = [] } = useRealtimeSchools();

  const schoolNameById = useMemo(() => {
    return (schools as School[]).reduce<Record<string, string>>((acc, school) => {
      acc[school.school_id] = school.school_name;
      return acc;
    }, {});
  }, [schools]);

  const filteredPrograms = (programs as Program[]).filter((program) => {
    const query = searchQuery.toLowerCase();
    const programName = (program.program_name || '').toLowerCase();
    const programCode = (program.program_code || '').toLowerCase();
    const schoolName = (schoolNameById[program.school_id] || '').toLowerCase();
    const description = (program.description || '').toLowerCase();

    return (
      programName.includes(query) ||
      programCode.includes(query) ||
      schoolName.includes(query) ||
      description.includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Programs</h1>
          <p className="text-muted-foreground">Manage programs linked to schools</p>
        </div>
        <Button onClick={() => navigate('/programs/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Program
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search programs, codes, schools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex h-24 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            {searchQuery ? 'No programs found matching your search' : 'No programs found'}
          </div>
        ) : (
          filteredPrograms.map((program) => (
            <Card key={program.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{program.program_name}</CardTitle>
                      <CardDescription>
                        {program.program_code} - {schoolNameById[program.school_id] || 'Unknown school'}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(program.status)}>{program.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="line-clamp-2 text-sm text-muted-foreground">{program.description}</p>
                <p className="text-sm text-muted-foreground">
                  {program.qualification_type} - {program.duration_years} years / {program.total_semesters} semesters
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/programs/${program.id}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Program
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
