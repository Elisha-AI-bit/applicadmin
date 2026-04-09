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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schools</h1>
          <p className="text-muted-foreground">
            Manage schools (groups of related programs) in this university
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/schools/import')}>
            <Upload className="mr-2 h-4 w-4" />
            Bulk Import
          </Button>
          <Button onClick={() => navigate('/schools/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add School
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search schools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
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
            <Card key={school.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{school.school_name || 'Unnamed School'}</CardTitle>
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
                    className="flex-1"
                    onClick={() => navigate(`/schools/${school.id}`)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/schools/${school.id}/edit`)}
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
