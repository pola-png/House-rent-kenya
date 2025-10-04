
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCollection, useFirestore, useUser, useMemoFirebase, addDocumentNonBlocking } from "@/firebase";
import { collection, query, where, orderBy, serverTimestamp, doc } from "firebase/firestore";
import type { SupportTicket, Message, UserProfile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { useSearchParams } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils";
import { Send, MessageSquare, Loader2, User as UserIcon } from "lucide-react";
import placeholderImages from "@/lib/placeholder-images.json";

export default function MessagesPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const initialTicketId = searchParams.get('ticket');
  
  const [selectedTicketId, setSelectedTicketId] = React.useState<string | null>(initialTicketId);
  const [newMessage, setNewMessage] = React.useState("");

  const ticketsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, "support-tickets"), where("userId", "==", user.uid), orderBy("updatedAt", "desc"));
  }, [firestore, user]);

  const { data: tickets, isLoading: isLoadingTickets } = useCollection<SupportTicket>(ticketsQuery);
  
  React.useEffect(() => {
    if (initialTicketId) {
        setSelectedTicketId(initialTicketId);
    } else if (tickets && tickets.length > 0 && !selectedTicketId) {
        setSelectedTicketId(tickets[0].id);
    }
  }, [tickets, initialTicketId, selectedTicketId]);

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !selectedTicketId) return null;
    return query(collection(firestore, `support-tickets/${selectedTicketId}/messages`), orderBy("timestamp", "asc"));
  }, [firestore, selectedTicketId]);
  
  const { data: messages, isLoading: isLoadingMessages } = useCollection<Message>(messagesQuery);
  
  const [isSending, setIsSending] = React.useState(false);
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedTicketId) return;

    setIsSending(true);
    const messageData = {
      text: newMessage,
      senderId: user.uid,
      timestamp: serverTimestamp(),
    };
    const messagesRef = collection(firestore, `support-tickets/${selectedTicketId}/messages`);
    const ticketRef = doc(firestore, 'support-tickets', selectedTicketId);

    try {
        await addDocumentNonBlocking(messagesRef, messageData);
        addDocumentNonBlocking(ticketRef, { updatedAt: serverTimestamp(), lastMessage: newMessage }, { merge: true });
        setNewMessage("");
    } catch(e) {
        console.error("Error sending message", e);
    } finally {
        setIsSending(false);
    }
  };

  const adminAvatar = placeholderImages.placeholderImages.find(img => img.id === 'agent_1');

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
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className={cn(
                            "w-full text-left p-3 rounded-lg transition-colors",
                             selectedTicketId === ticket.id ? "bg-muted" : "hover:bg-muted/50"
                        )}
                        >
                        <div className="flex justify-between items-start">
                             <p className="font-semibold truncate flex-1">{ticket.subject}</p>
                             <span className={cn("text-xs px-2 py-0.5 rounded-full", ticket.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800')}>{ticket.status}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{ticket.lastMessage}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {ticket.updatedAt ? formatDistanceToNow(ticket.updatedAt.toDate(), { addSuffix: true }) : ''}
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
                                const isUser = message.senderId === user?.uid;
                                return (
                                <div key={message.id} className={cn("flex items-end gap-2", isUser ? "justify-end" : "justify-start")}>
                                    {!isUser && (
                                         <Avatar className="h-8 w-8">
                                            <AvatarImage src={adminAvatar?.imageUrl} />
                                            <AvatarFallback>S</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={cn("max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2", isUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                        <p className="text-sm">{message.text}</p>
                                        <p className={cn("text-xs mt-1", isUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
                                             {message.timestamp ? formatDistanceToNow(message.timestamp.toDate(), { addSuffix: true }) : 'sending...'}
                                        </p>
                                    </div>
                                     {isUser && (
                                         <Avatar className="h-8 w-8">
                                            {user?.photoURL && <AvatarImage src={user.photoURL} />}
                                            <AvatarFallback><UserIcon className="h-4 w-4"/></AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                                );
                            })}
                            </div>
                        ) : (
                             <div className="p-4 text-center text-muted-foreground h-full flex flex-col justify-center">
                                <p>No messages in this ticket yet.</p>
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
