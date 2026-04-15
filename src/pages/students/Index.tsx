import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firebaseApi } from '@/lib/firebaseApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDate, getInitials } from '@/lib/utils';
import { Search, Plus, Upload, Eye, Mail, Phone, UserCircle2 } from 'lucide-react';
import type { Student } from '@/types';

const gradients = [
  'bg-gradient-to-br from-violet-500 to-purple-500',
  'bg-gradient-to-br from-pink-500 to-rose-500',
  'bg-gradient-to-br from-amber-500 to-orange-500',
  'bg-gradient-to-br from-emerald-500 to-teal-500',
  'bg-gradient-to-br from-cyan-500 to-blue-500'
];

const getGradient = (id: string) => gradients[(id.charCodeAt(0) || 0) % gradients.length];

export function StudentsList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch students from Firebase
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const studentsData = await firebaseApi.students.getStudents(searchQuery);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and set up real-time updates
  useEffect(() => {
    fetchStudents();
  }, [searchQuery]);

  // Filter students based on search query (client-side filtering for demo)
  const filteredStudents = students.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Students
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage student profiles, applications, and communication
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/students/import')}
            className="group hover:border-primary/50 transition-colors shadow-sm"
          >
            <Upload className="mr-2 h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
            Import
          </Button>
          <Button 
            className="shadow-md hover:shadow-lg transition-all group"
          >
            <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            Add Student
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <div className="relative max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <Input
              placeholder="Search students by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/30 transition-all rounded-full shadow-inner"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6 font-semibold">Student</TableHead>
                <TableHead className="font-semibold">Contact Info</TableHead>
                <TableHead className="font-semibold text-center">Applications</TableHead>
                <TableHead className="font-semibold">Joined Date</TableHead>
                <TableHead className="text-right pr-6 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                      <p className="text-muted-foreground animate-pulse text-sm font-medium">Loading students...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground space-y-3">
                      <UserCircle2 className="h-12 w-12 text-muted-foreground/30" />
                      <p className="text-lg font-medium">{searchQuery ? 'No students found matching your search' : 'No students found'}</p>
                      {searchQuery && <p className="text-sm">Try adjusting your search query</p>}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow 
                    key={student.id}
                    onClick={() => navigate(`/students/${student.id}`)}
                    className="group cursor-pointer hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors border-b-muted/50"
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border-2 border-background shadow-sm group-hover:scale-105 transition-transform">
                          <AvatarFallback className={`text-white font-medium ${getGradient(student.id)}`}>
                            {getInitials(`${student.firstName} ${student.lastName}`)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground/90 group-hover:text-primary transition-colors">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-xs tracking-tight text-muted-foreground/80 mt-0.5">ID: {student.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm group/item">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground group-hover/item:text-primary transition-colors" />
                          <span className="text-muted-foreground group-hover:text-foreground transition-colors">{student.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm group/item">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground group-hover/item:text-primary transition-colors" />
                          <span className="text-muted-foreground group-hover:text-foreground transition-colors">{student.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {student.applications?.length || 0} active
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm font-medium">
                      {formatDate(student.createdAt)}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 bg-primary/5 hover:bg-primary text-primary hover:text-primary-foreground shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/students/${student.id}`);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
