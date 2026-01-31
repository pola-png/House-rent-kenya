'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SupportTicket, Message } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { useAutoRetry } from '@/hooks/use-auto-retry';
import { useSearchParams } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils";
import { Send, MessageSquare, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth-supabase";
import { supabase } from "@/lib/supabase";

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const initialTicketId = searchParams?.get('ticket') ?? null;
  const { user } = useAuth();
  
  const [selectedTicketId, setSelectedTicketId] = React.useState<string | null>(null);
  const [newMessage, setNewMessage] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  const [tickets, setTickets] = React.useState<SupportTicket[]>([]);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = React.useState(true);
  const [retryTick, retryNow] = useAutoRetry(isLoadingTickets || !user, [user]);
  const hardReload = () => window.location.reload();
  const [isLoadingMessages, setIsLoadingMessages] = React.useState(false);

  React.useEffect(() => {
    const loadTickets = async () => {
      if (!user) return;
      setIsLoadingTickets(true);
      let rows: any[] | null = null;
      try {
        let q = supabase.from('support_tickets').select('*').order('updatedAt', { ascending: false });
        if (user.role !== 'admin') {
          q = q.eq('user_id', user.uid);
        }
        const { data, error } = await q;
        if (error) throw error;
        rows = data || [];
        const typed: SupportTicket[] = rows.map((t: any) => ({
          ...t,
          createdAt: t.createdAt ? new Date(t.createdAt) : undefined,
          updatedAt: t.updatedAt ? new Date(t.updatedAt) : undefined,
        }));
        setTickets(typed);
      } catch (e) {
        setTickets([]);
      } finally {
        setIsLoadingTickets(false);
        if (!rows || rows.length === 0) { /* best-effort retry on empty */ setTimeout(() => { hardReload(); }, 2000); }
      }
    };
    loadTickets();
  }, [user, retryTick]);

  React.useEffect(() => {
    if (initialTicketId) {
        setSelectedTicketId(initialTicketId);
    } else if (tickets && tickets.length > 0 && !selectedTicketId) {
        setSelectedTicketId(String(tickets[0].id));
    }
  }, [tickets, initialTicketId, selectedTicketId]);
  
  React.useEffect(() => {
    const loadMessages = async () => {
      if (!selectedTicketId) { setMessages([]); return; }
      setIsLoadingMessages(true);
      try {
        // Try with ticket_id first
        let { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('ticket_id', selectedTicketId)
          .order('created_at', { ascending: true });
        
        // If that fails, try with ticketId
        if (error) {
          const result = await supabase
            .from('messages')
            .select('*')
            .eq('ticketId', selectedTicketId)
            .order('created_at', { ascending: true });
          data = result.data;
          error = result.error;
        }
        
        if (error) throw error;
        const typed: Message[] = (data || []).map((m: any) => ({
          ...m,
          message: m.message || m.text,
          sender_id: m.user_id || m.userId,
          timestamp: m.created_at ? new Date(m.created_at) : undefined,
        }));
        setMessages(typed);
      } catch (e) {
        setMessages([]);
      } finally {
        setIsLoadingMessages(false);
      }
    };
    loadMessages();
  }, [selectedTicketId]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicketId || !user) return;
    setIsSending(true);
    try {
      const now = new Date().toISOString();
      
      // Try with ticket_id first
      let { error } = await supabase
        .from('messages')
        .insert([{ ticket_id: selectedTicketId, message: newMessage, user_id: user.uid, created_at: now }]);
      
      // If that fails, try with ticketId
      if (error) {
        const result = await supabase
          .from('messages')
          .insert([{ ticketId: selectedTicketId, message: newMessage, userId: user.uid, createdAt: now }]);
        error = result.error;
      }
      
      if (error) throw error;
      
      setMessages(prev => [...prev, { id: String(Date.now()), message: newMessage, sender_id: user.uid, timestamp: new Date(now) } as Message]);
      await supabase
        .from('support_tickets')
        .update({ lastMessage: newMessage, updatedAt: now })
        .eq('id', selectedTicketId);
      setTickets(prev => prev.map(t => t.id === selectedTicketId ? { ...t, lastMessage: newMessage, updatedAt: new Date() } : t).sort((a,b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0)));
      setNewMessage('');
    } catch (e) {
      console.error('Failed to send message:', e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-10rem)]">
        <Card className="lg:col-span-1 flex flex-col">
            <CardHeader>
                <CardTitle>My Tickets</CardTitle>
                <CardDescription>All your support conversations.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-grow">
                <ScrollArea className="h-full">
                {isLoadingTickets ? (
                    <div className="p-4 space-y-2">
                        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                ) : tickets && tickets.length > 0 ? (
                    <div className="space-y-1 p-2">
                    {tickets.map(ticket => (
                        <button
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(String(ticket.id))}
                        className={cn(
                            "w-full text-left p-3 rounded-lg transition-colors",
                             selectedTicketId === String(ticket.id) ? "bg-muted" : "hover:bg-muted/50"
                        )}
                        >
                        <div className="flex justify-between items-start">
                             <p className="font-semibold truncate flex-1">{ticket.subject}</p>
                             <span className={cn("text-xs px-2 py-0.5 rounded-full", ticket.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800')}>{ticket.status}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{ticket.lastMessage}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {ticket.updatedAt ? formatDistanceToNow(ticket.updatedAt, { addSuffix: true }) : ''}
                        </p>
                        </button>
                    ))}
                    </div>
                ) : (
                     <div className="p-4 text-center text-muted-foreground h-full flex flex-col justify-center">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2"/>
                        <p>No support tickets found.</p>
                     </div>
                )}
                </ScrollArea>
            </CardContent>
        </Card>
        
        <Card className="lg:col-span-3 flex flex-col">
            {selectedTicketId ? (
                <>
                <CardHeader className="border-b">
                    <CardTitle className="truncate">{tickets?.find(t => t.id === selectedTicketId)?.subject}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow p-0">
                    <ScrollArea className="h-[calc(100vh-20rem)] p-4">
                       {isLoadingMessages ? (
                            <div className="p-4 space-y-4">
                                <Skeleton className="h-12 w-3/4" />
                                <Skeleton className="h-12 w-3/4 ml-auto bg-primary/20" />
                                <Skeleton className="h-16 w-1/2" />
                            </div>
                        ) : messages && messages.length > 0 ? (
                            <div className="space-y-4">
                            {messages.map(message => {
                                const isMine = user && message.sender_id === user.uid;
                                return (
                                <div key={message.id} className={cn("flex items-end gap-2", isMine ? "justify-end" : "justify-start")}>
                                    {!isMine && (
                                         <Avatar className="h-8 w-8">
                                            <AvatarImage src={user?.photoURL} />
                                            <AvatarFallback>A</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={cn("max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2", isMine ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                        <p className="text-sm">{message.message}</p>
                                        <p className={cn("text-xs mt-1", isMine ? "text-primary-foreground/70" : "text-muted-foreground")}>
                                             {message.timestamp ? formatDistanceToNow(message.timestamp, { addSuffix: true }) : 'sending...'}
                                        </p>
                                    </div>
                                     {isMine && (
                                         <Avatar className="h-8 w-8">
                                            <AvatarImage src={user?.photoURL} />
                                            <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                                );
                            })}
                            </div>
                        ) : (
                             <div className="p-4 text-center text-muted-foreground h-full flex flex-col justify-center">
                                <p>No messages in this ticket yet. Start the conversation!</p>
                             </div>
                        )}
                    </ScrollArea>
                </CardContent>
                <CardFooter className="border-t pt-4">
                    <div className="relative w-full flex items-center gap-2">
                    <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                        disabled={isSending}
                    />
                    <Button onClick={handleSendMessage} disabled={isSending || !newMessage.trim()}>
                        {isSending ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4" />}
                        <span className="sr-only">Send</span>
                    </Button>
                    </div>
                </CardFooter>
                </>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                    <MessageSquare className="h-16 w-16 mb-4" />
                    <h2 className="text-xl font-semibold">Select a Ticket</h2>
                    <p>Choose a conversation from the list to see the messages.</p>
                </div>
            )}
        </Card>
    </div>
  );
}