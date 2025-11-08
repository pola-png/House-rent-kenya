"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth-supabase";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type PaymentRequest = {
  id: string;
  propertyId: string;
  propertyTitle?: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  amount: number;
  paymentScreenshot?: string;
  status: "pending" | "approved" | "rejected" | string;
  promotionType?: string;
  createdAt: string;
};

export default function PromotionsPage() {
  const { user, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [retryTick, setRetryTick] = useState(0);
  const [startedAt] = useState<number>(() => Date.now());

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    fetchRows();
  }, [user, authLoading, retryTick]);

  useEffect(() => {
    const t = setTimeout(() => {
      if ((isLoading || authLoading) && Date.now() - startedAt > 7000) {
        setRetryTick((x) => x + 1);
      }
    }, 7500);
    const onOnline = () => setRetryTick((x) => x + 1);
    try { window.addEventListener('online', onOnline); } catch {}
    return () => { clearTimeout(t); try { window.removeEventListener('online', onOnline); } catch {} };
  }, [isLoading, authLoading, startedAt]);

  const fetchRows = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      let query = supabase
        .from('payment_requests')
        .select('*')
        .order('createdAt', { ascending: false });
      if (user.role !== 'admin') {
        query = query.eq('userId', user.uid);
      }
      const { data, error } = await query;
      if (error) throw error;
      setRows((data || []) as any);
    } catch (e) {
      console.error('Promotions fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const grouped = useMemo(() => {
    const by: Record<string, PaymentRequest[]> = { all: [], pending: [], approved: [], rejected: [] } as any;
    for (const r of rows) {
      by.all.push(r);
      const s = (r.status || 'pending').toLowerCase();
      if (s === 'approved') by.approved.push(r);
      else if (s === 'rejected') by.rejected.push(r);
      else by.pending.push(r);
    }
    return by;
  }, [rows]);

  const renderList = (list: PaymentRequest[]) => {
    if (isLoading || authLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setRetryTick((x) => x + 1)}>Reload now</Button>
            <span className="text-xs text-muted-foreground">If this takes too long, click Reload.</span>
          </div>
        </div>
      );
    }
    if (!list?.length) {
      return <div className="text-sm text-muted-foreground">No items.</div>;
    }
    return (
      <div className="space-y-3">
        {list.map((r) => (
          <div key={r.id} className="rounded-md border p-3 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="font-medium">{r.propertyTitle || r.propertyId}</div>
              <div className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</div>
              <div className="text-xs">Amount: {Number(r.amount || 0).toLocaleString()}</div>
              {r.promotionType && <div className="text-xs">Type: {r.promotionType}</div>}
              {r.userName && <div className="text-xs">By: {r.userName}</div>}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline">{(r.status || 'pending').toUpperCase()}</Badge>
              {r.paymentScreenshot && (
                <a href={r.paymentScreenshot} target="_blank" rel="noreferrer" className="text-xs underline text-primary">Screenshot</a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">Promotions</h1>
        <p className="text-muted-foreground">Your submitted promotion requests {user?.role === 'admin' ? '(admin: all agents)' : ''}.</p>
      </div>
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4 sm:w-auto">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending</CardTitle>
              <CardDescription>Awaiting admin approval.</CardDescription>
            </CardHeader>
            <CardContent>{renderList(grouped.pending)}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved</CardTitle>
              <CardDescription>Scheduled or active promotions.</CardDescription>
            </CardHeader>
            <CardContent>{renderList(grouped.approved)}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected</CardTitle>
              <CardDescription>Requests that didn’t pass verification.</CardDescription>
            </CardHeader>
            <CardContent>{renderList(grouped.rejected)}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Requests</CardTitle>
              <CardDescription>Every request in reverse chronological order.</CardDescription>
            </CardHeader>
            <CardContent>{renderList(grouped.all)}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

