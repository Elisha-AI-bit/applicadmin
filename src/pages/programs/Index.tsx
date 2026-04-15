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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">Programs</h1>
          <p className="text-muted-foreground text-lg">Manage programs linked to schools</p>
        </div>
        <Button onClick={() => navigate('/programs/new')} className="shadow-md hover:shadow-lg transition-all group">
          <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
          Add Program
        </Button>
      </div>

      <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden mb-6">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <div className="font-semibold text-muted-foreground">Filters</div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <Input
              placeholder="Search programs, codes, schools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/30 transition-all rounded-full shadow-inner"
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
            <Card key={program.id} className="group border-none shadow-md hover:shadow-xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm transition-all duration-300 overflow-hidden relative">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/20 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{program.program_name}</CardTitle>
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
                  className="w-full opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 bg-primary/5 hover:bg-primary text-primary hover:text-primary-foreground shadow-sm"
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
