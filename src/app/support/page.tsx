"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth-supabase";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LifeBuoy, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PublicSupportPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login?redirect=/support');
  }, [loading, user, router]);

  const onSubmit = async () => {
    if (!user || !subject.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      const now = new Date().toISOString();
      const { data: t, error: tErr } = await supabase
        .from('support_tickets')
        .insert([{ userId: user.uid, subject, status: 'open', createdAt: now, updatedAt: now, lastMessage: message }])
        .select('id')
        .single();
      if (tErr) throw tErr;
      const { error: mErr } = await supabase
        .from('messages')
        .insert([{ ticketId: t.id, text: message, senderId: user.uid, timestamp: now }]);
      if (mErr) throw mErr;
      toast({ title: 'Support request sent', description: 'We will reply shortly.' });
      router.push(`/admin/messages?ticket=${t.id}`);
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Failed to send', description: e?.message || 'Please try again' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
            <LifeBuoy className="h-6 w-6" /> Contact Support
          </h1>
          <p className="text-muted-foreground">We’re here to help. Describe your issue and our team (admins) will respond.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Open a Ticket</CardTitle>
            <CardDescription>Provide a subject and message for your request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., Unable to upload property images" />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} placeholder="Explain the problem you’re facing..." />
            </div>
            <div>
              <Button onClick={onSubmit} disabled={submitting || !subject.trim() || !message.trim()}>
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

