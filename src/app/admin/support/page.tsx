
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { LifeBuoy, Send, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const faqs = [
  {
    question: 'How do I promote my property listing?',
    answer:
      "You can promote a listing directly from the property creation or edit page. Look for the 'Promotion' card, toggle the 'Feature as Pro' switch, select your desired promotion duration, and follow the M-Pesa payment instructions. After payment, upload your payment screenshot and send it for admin approval.",
  },
  {
    question: 'How long does it take for a promotion to be approved?',
    answer:
      'Our admin team typically reviews and approves promotion requests within 1-2 hours during business hours. You will be notified once your listing is promoted.',
  },
  {
    question: 'How can I edit my agent profile?',
    answer:
      "You can manage your profile information, including your name and agency details, from the 'Settings' page. Click on your avatar in the top right, select 'Settings', and make your changes in the 'Profile' section.",
  },
  {
    question: 'What are the benefits of a Pro or VIP subscription?',
    answer:
      "Upgrading your subscription allows you to post more listings, get higher visibility in search results, and receive priority support. You can view all plan details on the 'Subscription' page.",
  },
];

const supportFormSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

export default function SupportPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const form = useForm<z.infer<typeof supportFormSchema>>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      subject: '',
      message: '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof supportFormSchema>) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Authenticated',
        description: 'You must be logged in to send a message.',
      });
      return;
    }

    try {
      // Create the support ticket
      const ticketRef = await addDoc(collection(firestore, 'support-tickets'), {
        userId: user.uid,
        subject: values.subject,
        status: 'open',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: values.message,
      });

      // Add the initial message to the messages sub-collection
      const messagesRef = collection(firestore, 'support-tickets', ticketRef.id, 'messages');
      await addDoc(messagesRef, {
        text: values.message,
        senderId: user.uid,
        timestamp: serverTimestamp(),
      });
      
      toast({
        title: 'Message Sent!',
        description: 'Our support team will get back to you shortly. You can view your ticket in the Messages tab.',
      });

      form.reset();
      router.push(`/admin/messages?ticket=${ticketRef.id}`);

    } catch (error: any) {
      console.error('Error creating support ticket:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not send your message. Please try again.',
      });
    }
  };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <LifeBuoy className="h-6 w-6" />
          Support Center
        </h1>
        <p className="text-muted-foreground">
          Find answers to common questions or get in touch with our support team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Can't find an answer? Fill out the form below to send us a message.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Subject</Label>
                        <FormControl>
                          <Input placeholder="e.g., Issue with a listing" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Your Message</Label>
                        <FormControl>
                          <Textarea placeholder="Please describe your issue in detail..." className="min-h-[150px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                     {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}
