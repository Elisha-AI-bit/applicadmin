import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { formatDate, getInitials, getStatusColor } from '@/lib/utils';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  FileText,
  User,
} from 'lucide-react';

export function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: student, isLoading } = useQuery({
    queryKey: ['student', id],
    queryFn: () => mockApi.getStudent(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Student not found</h1>
        <Button onClick={() => navigate('/students')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/students')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {student.firstName} {student.lastName}
          </h1>
          <p className="text-muted-foreground">Student ID: {student.id}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">
                  {getInitials(`${student.firstName} ${student.lastName}`)}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">{student.email}</p>
              <div className="mt-4 flex gap-2">
                <Badge variant="outline">{student.gender}</Badge>
                <Badge variant="outline">{student.applications.length} Applications</Badge>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{student.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{student.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Born {formatDate(student.dateOfBirth)}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {student.address.street}, {student.address.city}, {student.address.state} {student.address.zipCode}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="applications">
            <TabsList>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="academic">Academic History</TabsTrigger>
              <TabsTrigger value="guardian">Guardian Info</TabsTrigger>
            </TabsList>

            <TabsContent value="applications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Applications</CardTitle>
                  <CardDescription>School applications submitted by this student</CardDescription>
                </CardHeader>
                <CardContent>
                  {student.applications.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No applications yet</p>
                  ) : (
                    <div className="space-y-4">
                      {student.applications.map((appId) => (
                        <div key={appId} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Application #{appId}</p>
                              <p className="text-sm text-muted-foreground">View details for more information</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/applications/${appId}`)}>
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="academic">
              <Card>
                <CardHeader>
                  <CardTitle>Academic History</CardTitle>
                </CardHeader>
                <CardContent>
                  {student.academicHistory.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No academic records</p>
                  ) : (
                    <div className="space-y-4">
                      {student.academicHistory.map((record, index) => (
                        <div key={index} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{record.institution}</p>
                              <p className="text-sm text-muted-foreground">{record.degree} in {record.fieldOfStudy}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">GPA: {record.gpa}</p>
                              <p className="text-sm text-muted-foreground">{record.graduationYear}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guardian">
              <Card>
                <CardHeader>
                  <CardTitle>Guardian Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {student.guardianInfo ? (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-medium">{student.guardianInfo.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Relationship</p>
                          <p className="font-medium">{student.guardianInfo.relationship}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{student.guardianInfo.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{student.guardianInfo.email}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No guardian information provided</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
