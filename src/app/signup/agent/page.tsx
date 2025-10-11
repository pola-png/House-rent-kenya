'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Building, UserPlus, Loader2 } from 'lucide-react';
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
import { useAuth } from '@/hooks/use-auth-supabase';


const formSchema = z.object({
  agencyName: z.string().min(1, { message: 'Agency name is required.' }),
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function AgentSignupPage() {
  const bgImage = placeholderImages.placeholderImages.find(img => img.id === 'auth_bg');
  const router = useRouter();
  const { toast } = useToast();
  const { signup } = useAuth();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agencyName: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const success = await signup(values.email, values.password, {
        role: 'agent',
        firstName: values.firstName,
        lastName: values.lastName,
        displayName: `${values.firstName} ${values.lastName}`,
        agencyName: values.agencyName,
    });
    if (success) {
        toast({
            title: 'Account Created!',
            description: 'Your agent account has been successfully created. Please log in.',
        });
        router.push('/login');
    } else {
        toast({
            variant: 'destructive',
            title: 'Signup Failed',
            description: 'Could not create account. Please try again.',
        });
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <div className="w-full lg:grid lg:min-h-[calc(100vh-5rem)] lg:grid-cols-2 xl:min-h-[calc(100vh-5rem)]">
      <div className="flex items-center justify-center py-12">
        <Card className="mx-auto max-w-sm w-full">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Create an Agent Account</CardTitle>
            <CardDescription>Register your agency to start listing properties.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormField
                  control={form.control}
                  name="agencyName"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Agency Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Awesome Properties Ltd." {...field} disabled={isSubmitting}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane" {...field} disabled={isSubmitting}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} disabled={isSubmitting}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jane@awesomeproperties.co.ke" {...field} disabled={isSubmitting}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} disabled={isSubmitting}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Agent Account
                </Button>
              </form>
            </Form>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" disabled={isSubmitting}>
              Sign up with Google
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
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
            <h2 className="text-4xl font-bold font-headline">Grow Your Real Estate Business</h2>
            <p className="mt-4 text-lg">Join Kenya's leading property portal to reach more clients and close more deals.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
