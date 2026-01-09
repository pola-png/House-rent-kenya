'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Building, UserPlus, Loader2, Briefcase } from 'lucide-react';
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
  phoneNumber: z.string().min(10, { message: 'Phone number is required (minimum 10 digits).' }),
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
      phoneNumber: '',
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
        phoneNumber: values.phoneNumber,
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
    <div className="w-full lg:grid lg:min-h-[calc(100vh-5rem)] lg:grid-cols-2 xl:min-h-[calc(100vh-5rem)] bg-gradient-to-br from-background to-muted/20">
      <div className="flex items-center justify-center py-12 px-4">
        <Card className="mx-auto max-w-md w-full shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-headline text-center">Join as an Agent</CardTitle>
            <CardDescription className="text-center">Start growing your real estate business today</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
                <FormField
                  control={form.control}
                  name="agencyName"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel className="text-sm font-medium">Agency Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Prime Properties Ltd." className="h-11" {...field} disabled={isSubmitting}/>
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
                        <FormLabel className="text-sm font-medium">First name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane" className="h-11" {...field} disabled={isSubmitting}/>
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
                        <FormLabel className="text-sm font-medium">Last name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" className="h-11" {...field} disabled={isSubmitting}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+254 712 345 678" className="h-11" {...field} disabled={isSubmitting}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jane@primeproperties.co.ke" className="h-11" {...field} disabled={isSubmitting}/>
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
                      <FormLabel className="text-sm font-medium">Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Create a strong password" className="h-11" {...field} disabled={isSubmitting}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" 
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Agent Account
                </Button>
              </form>
            </Form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted-foreground/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground font-medium">Or continue with</span>
              </div>
            </div>
            <Button variant="outline" className="w-full h-11 border-2 hover:bg-muted/50" disabled={isSubmitting}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="hidden bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 lg:block relative overflow-hidden">
        {bgImage && (
          <Image
            src={bgImage.imageUrl}
            alt="A key in a door lock"
            data-ai-hint={bgImage.imageHint}
            fill
            className="object-cover opacity-20"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/90 via-emerald-600/90 to-teal-700/90 flex flex-col justify-between p-12 text-white">
          <div>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                <Building className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold font-headline">House Rent Kenya</span>
            </Link>
          </div>
          <div className="max-w-lg">
            <h2 className="text-5xl font-bold font-headline mb-6 leading-tight">Grow Your Real Estate Business</h2>
            <p className="text-xl text-white/90 leading-relaxed mb-8">Join Kenya's leading property portal to reach more clients, manage listings efficiently, and close more deals.</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span>List Properties</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span>Manage Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                <span>Analytics Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                <span>Premium Features</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
