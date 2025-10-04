
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
import { LifeBuoy, Send } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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

export default function SupportPage() {
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
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Can't find an answer? Fill out the form below to send us a message.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="e.g., Issue with a listing" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea id="message" placeholder="Please describe your issue in detail..." className="min-h-[150px]" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
