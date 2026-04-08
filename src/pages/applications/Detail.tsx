import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils';
import { toast } from 'sonner';
import {
  ArrowLeft,
  User,
  School,
  CreditCard,
  FileText,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Download,
  AlertCircle,
  Check,
} from 'lucide-react';

export function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [note, setNote] = useState('');

  const { data: application, isLoading } = useQuery({
    queryKey: ['application', id],
    queryFn: () => mockApi.getApplication(id!),
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status, note }: { status: string; note?: string }) =>
      mockApi.updateApplicationStatus(id!, status as any, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application status updated');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: (content: string) => mockApi.addApplicationNote(id!, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      setNote('');
      toast.success('Note added');
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Application not found</h1>
        <Button onClick={() => navigate('/applications')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Applications
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/applications')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Application Details</h1>
            <p className="text-muted-foreground">
              Submitted on {formatDate(application.submittedAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {application.status === 'pending' && (
            <>
              <Button
                variant="outline"
                onClick={() => updateStatusMutation.mutate({ status: 'under_review' })}
              >
                <Clock className="mr-2 h-4 w-4" />
                Mark Under Review
              </Button>
            </>
          )}
          {application.status !== 'approved' && application.status !== 'rejected' && (
            <>
              <Button
                variant="default"
                onClick={() => updateStatusMutation.mutate({ status: 'approved', note: 'Application approved' })}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => updateStatusMutation.mutate({ status: 'rejected', note: 'Application rejected' })}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="notes">Notes & Comments</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Full Name</Label>
                      <p className="font-medium">{application.studentName}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="font-medium">{application.studentEmail}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Phone</Label>
                      <p className="font-medium">{application.studentPhone}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Source</Label>
                      <p className="font-medium capitalize">{application.source.replace('_', ' ')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Application Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">School</Label>
                      <p className="font-medium">{application.schoolName}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Program</Label>
                      <p className="font-medium">{application.programName}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Status</Label>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Payment Status</Label>
                      <Badge className={getStatusColor(application.paymentStatus)}>
                        {application.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Submitted Documents</CardTitle>
                  <CardDescription>Documents uploaded by the student</CardDescription>
                </CardHeader>
                <CardContent>
                  {application.documents.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No documents uploaded</p>
                  ) : (
                    <div className="space-y-2">
                      {application.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Uploaded {formatDate(doc.uploadedAt)}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Notes & Comments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Add a note..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <Button
                      onClick={() => addNoteMutation.mutate(note)}
                      disabled={!note.trim() || addNoteMutation.isPending}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Add Note
                    </Button>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    {application.notes.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">No notes yet</p>
                    ) : (
                      application.notes.map((n) => (
                        <div key={n.id} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{n.authorName}</span>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(n.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm">{n.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">{formatCurrency(application.paymentAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge className={getStatusColor(application.paymentStatus)}>
                  {application.paymentStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Application Submitted</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(application.submittedAt)}
                  </p>
                </div>
              </div>
              {application.reviewedAt && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Reviewed</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(application.reviewedAt)} by {application.reviewedBy}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
