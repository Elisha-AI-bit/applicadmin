import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { firebaseApi } from '@/lib/firebaseApi';
import { useRealtimeDocument } from '@/hooks/useRealtimeQuery';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils';
import { toast } from 'sonner';
import {
  ArrowLeft,
  User,
  FileText,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';

export function PaymentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [refundReason, setRefundReason] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: payment, isLoading } = useRealtimeDocument('payments', id!);

  const refundMutation = useMutation({
    mutationFn: (reason: string) => firebaseApi.payments.processRefund(id!, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Refund processed successfully');
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error('Failed to process refund');
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Payment not found</h1>
        <Button onClick={() => navigate('/payments')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payments
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/payments')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payment Details</h1>
            <p className="text-muted-foreground">Transaction #{payment.id}</p>
          </div>
        </div>
        {payment.status === 'completed' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <RefreshCw className="mr-2 h-4 w-4" />
                Process Refund
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Process Refund</DialogTitle>
                <DialogDescription>
                  Are you sure you want to refund {formatCurrency(payment.amount)} to {payment.studentName}?
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Refund Reason</Label>
                  <Input
                    id="reason"
                    placeholder="Enter reason for refund..."
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => refundMutation.mutate(refundReason)}
                  disabled={!refundReason.trim() || refundMutation.isPending}
                >
                  {refundMutation.isPending && (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  )}
                  Confirm Refund
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Transaction ID</Label>
                  <p className="font-medium">#{payment.id}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Application ID</Label>
                  <p className="font-medium">#{payment.applicationId}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Amount</Label>
                  <p className="font-medium text-lg">{formatCurrency(payment.amount)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Currency</Label>
                  <p className="font-medium">{payment.currency}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Payment Method</Label>
                  <p className="font-medium capitalize">{payment.method.replace('_', ' ')}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{payment.studentName}</p>
                  <p className="text-sm text-muted-foreground">Student ID: {payment.studentId}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Payment Created</p>
                  <p className="text-sm text-muted-foreground">{formatDate(payment.createdAt)}</p>
                </div>
              </div>
              {payment.paidAt && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Payment Completed</p>
                    <p className="text-sm text-muted-foreground">{formatDate(payment.paidAt)}</p>
                  </div>
                </div>
              )}
              {payment.refundedAt && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                    <RefreshCw className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">Refunded</p>
                    <p className="text-sm text-muted-foreground">{formatDate(payment.refundedAt)}</p>
                    <p className="text-sm text-muted-foreground">Reason: {payment.refundReason}</p>
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
