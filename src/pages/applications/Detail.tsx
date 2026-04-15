import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { firebaseApi } from '@/lib/firebaseApi';
import { useRealtimeDocument } from '@/hooks/useRealtimeQuery';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils';
import { toast } from 'sonner';
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Download,
  Check,
  MapPin,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';

export function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [note, setNote] = useState('');

  const { data: application, isLoading } = useRealtimeDocument('applications', id!);

  const updateStatusMutation = useMutation({
    mutationFn: ({ status, note }: { status: string; note?: string }) =>
      firebaseApi.applications.updateApplicationStatus(id!, status as any, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application status updated');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: (content: string) => firebaseApi.applications.addApplicationNote(id!, content),
    onSuccess: () => {
      setNote('');
      toast.success('Note added');
    },
  });

  const verifyDocMutation = useMutation({
    mutationFn: ({ docId, verified }: { docId: string; verified: boolean }) =>
      firebaseApi.applications.verifyDocument(id!, docId, verified),
    onSuccess: () => {
      toast.success('Document verification updated');
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
            <pre className="text-xs bg-gray-100 p-4 max-h-40 overflow-auto w-full">
              {JSON.stringify(application, null, 2)}
            </pre>
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
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Personal Information</CardTitle>
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Full Name</span>
                      <span className="font-semibold">{application.personalInfo?.firstName || application.studentName} {application.personalInfo?.lastName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gender</span>
                      <span className="font-semibold">{application.personalInfo?.gender || '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">ID / Passport</span>
                      <span className="font-semibold">{application.personalInfo?.nrcPassport || '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Nationality</span>
                      <span className="font-semibold">{application.personalInfo?.nationality || '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-semibold">{application.personalInfo?.maritalStatus || '-'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Contact Details</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-semibold">{application.contactInfo?.email || application.studentEmail}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phone</span>
                      <span className="font-semibold">{application.contactInfo?.phoneNumber || '-'}</span>
                    </div>
                    <div className="space-y-1 mt-2 border-t pt-2">
                      <span className="text-xs text-muted-foreground">Residential Address</span>
                      <p className="text-sm font-medium">
                        {application.contactInfo?.address}, {application.contactInfo?.city}, {application.contactInfo?.province}, {application.contactInfo?.country}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Academic History & Programme</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Selected Programme</Label>
                      <p className="font-bold">{application.programmeChoice?.faculty || application.schoolName} - {application.programmeChoice?.programmeName || application.programName}</p>
                      <p className="text-sm uppercase text-primary font-bold">{application.programmeChoice?.intake || 'Current'} Intake ({application.programmeChoice?.modeOfStudy || 'Full Time'})</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Previous Institution</Label>
                      <p className="font-medium text-sm">{application.academicInfo?.schoolName} ({application.academicInfo?.examLevel})</p>
                      <p className="text-xs text-muted-foreground">Completed: {application.academicInfo?.completionYear} | Cert: {application.academicInfo?.certificateNumber}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Subjects & Results</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {application.academicInfo?.grades?.map((g: any, i: number) => (
                        <div key={i} className="bg-muted/50 p-2 rounded flex justify-between items-center text-xs">
                          <span className="font-medium truncate mr-1">{g.subject}</span>
                          <Badge variant="outline" className="h-5 px-1 bg-white">{g.grade}</Badge>
                        </div>
                      ))}
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
                  {!(application.documents && application.documents.length > 0) ? (
                    <p className="text-center text-muted-foreground py-8">No documents uploaded</p>
                  ) : (
                    <div className="space-y-2">
                      {application.documents.map((doc: any) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium flex items-center gap-2">
                                {doc.name}
                                {doc.verified && <ShieldCheck className="h-4 w-4 text-green-500" />}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Uploaded {formatDate(doc.uploadedAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant={doc.verified ? "secondary" : "outline"}
                              size="sm"
                              onClick={() => verifyDocMutation.mutate({ docId: doc.id, verified: !doc.verified })}
                              disabled={verifyDocMutation.isPending}
                            >
                              {doc.verified ? 'Unverify' : 'Verify'}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
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
                    {!(application.notes && application.notes.length > 0) ? (
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
                <Badge className={getStatusColor(application.paymentStatus || 'pending')}>
                  {application.paymentStatus || 'pending'}
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
