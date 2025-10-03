import Link from 'next/link';
import Image from 'next/image';
import { Building, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import placeholderImages from '@/lib/placeholder-images.json';

export default function AgentSignupPage() {
    const bgImage = placeholderImages.placeholderImages.find(img => img.id === 'auth_bg');

  return (
    <div className="w-full lg:grid lg:min-h-[calc(100vh-5rem)] lg:grid-cols-2 xl:min-h-[calc(100vh-5rem)]">
      <div className="flex items-center justify-center py-12">
        <Card className="mx-auto max-w-sm w-full">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Create an Agent Account</CardTitle>
            <CardDescription>
              Register your agency to start listing properties.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                  <Label htmlFor="agency-name">Agency Name</Label>
                  <Input id="agency-name" placeholder="Awesome Properties Ltd." required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" placeholder="Jane" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" placeholder="Doe" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@awesomeproperties.co.ke"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
              <Button type="submit" className="w-full">
                <UserPlus className="mr-2 h-4 w-4"/>
                Create Agent Account
              </Button>
              <Button variant="outline" className="w-full">
                Sign up with Google
              </Button>
            </div>
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
