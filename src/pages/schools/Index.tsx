import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firebaseApi } from '@/lib/firebaseApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getStatusColor } from '@/lib/utils';
import { Search, Plus, Filter, Eye, Edit, Building2, Upload } from 'lucide-react';
import type { School } from '@/types';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export function SchoolsList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);


  // Set up real-time subscription
  useEffect(() => {
    const unsubscribe = firebaseApi.schools.subscribeToSchools(
      (schoolsData) => {
        setSchools(schoolsData);
        setLoading(false);
      },
      statusFilter === 'all' ? undefined : statusFilter
    );

    return () => unsubscribe();
  }, [statusFilter]);

  // Filter schools based on search query
  const normalizedSearch = searchQuery.toLowerCase();
  const filteredSchools = schools.filter((school) => {
    const fallbackSchool = school as School & { name?: string; code?: string };
    const schoolName = (school.school_name || fallbackSchool.name || '').toLowerCase();
    const schoolCode = (school.school_code || fallbackSchool.code || '').toLowerCase();
    const description = (school.description || '').toLowerCase();

    return (
      schoolName.includes(normalizedSearch) ||
      schoolCode.includes(normalizedSearch) ||
      description.includes(normalizedSearch)
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Schools
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage schools (groups of related programs) in this university
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/schools/import')} className="group hover:border-primary/50 transition-colors shadow-sm">
            <Upload className="mr-2 h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
            Bulk Import
          </Button>
          <Button onClick={() => navigate('/schools/new')} className="shadow-md hover:shadow-lg transition-all group">
            <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            Add School
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden mb-6">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <div className="font-semibold text-muted-foreground">Filters</div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                placeholder="Search schools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/30 transition-all rounded-full shadow-inner"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex h-24 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filteredSchools.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            {searchQuery ? 'No schools found matching your search' : 'No schools found'}
          </div>
        ) : (
          filteredSchools.map((school) => (
            <Card 
              key={school.id} 
              className="group border-none shadow-md hover:shadow-xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm transition-all duration-300 overflow-hidden cursor-pointer relative"
              onClick={() => navigate(`/schools/${school.id}`)}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/30 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{school.school_name || 'Unnamed School'}</CardTitle>
                      <CardDescription>{school.school_code || 'N/A'}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(school.status)}>
                    {school.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {school.description}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Code: {school.school_code || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/5 hover:bg-primary text-primary hover:text-primary-foreground"
                    onClick={(e) => { e.stopPropagation(); navigate(`/schools/${school.id}`); }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
                    onClick={(e) => { e.stopPropagation(); navigate(`/schools/${school.id}/edit`); }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
