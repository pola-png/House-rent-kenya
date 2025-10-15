
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Building, Mail, Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import placeholderImages from '@/lib/placeholder-images.json';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

export default function ForgotPasswordPage() {
  const bgImage = placeholderImages.placeholderImages.find(img => img.id === 'auth_bg');
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your email for a password reset link.',
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to send reset email.',
      });
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-[calc(100vh-5rem)] lg:grid-cols-2 xl:min-h-[calc(100vh-5rem)]">
      <div className="flex items-center justify-center py-12">
        <Card className="mx-auto max-w-sm w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email and we will send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="m@example.com" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Mail className="mr-2 h-4 w-4" />
                  Send Reset Link
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Remember your password?{' '}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {bgImage && (
          <Image
            src={bgImage.imageUrl}
            alt="A key in a door lock"
            data-ai-hint={bgImage.imageHint}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-primary/80 flex flex-col justify-between p-12 text-primary-foreground">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-background">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold font-headline">House Rent Kenya</span>
            </Link>
          </div>
          <div className="max-w-md">
            <h2 className="text-4xl font-bold font-headline">Back on Track</h2>
            <p className="mt-4 text-lg">
              Let's help you get back into your account and continue your property search.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
