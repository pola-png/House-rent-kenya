import Link from 'next/link';
import Image from 'next/image';
import { Building, User, Briefcase, ArrowRight } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SignupOptionsPage() {
    const bgImage = placeholderImages.placeholderImages.find(img => img.id === 'auth_bg');

  return (
    <div className="w-full lg:grid lg:min-h-[calc(100vh-5rem)] lg:grid-cols-2 xl:min-h-[calc(100vh-5rem)]">
      <div className="flex items-center justify-center py-12">
        <Card className="mx-auto max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Join Our Community</CardTitle>
            <CardDescription>
              First, tell us who you are. Choose the option that best describes you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Link href="/signup/user" className="block">
                <Card className="hover:bg-muted hover:border-primary transition-all">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <div className="p-3 rounded-md bg-primary/10 text-primary">
                            <User className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">I want to find a property</h3>
                            <p className="text-sm text-muted-foreground">Sign up to save properties, searches, and get alerts.</p>
                        </div>
                         <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground" />
                    </CardHeader>
                </Card>
            </Link>

            <Link href="/signup/agent" className="block">
                <Card className="hover:bg-muted hover:border-primary transition-all">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <div className="p-3 rounded-md bg-primary/10 text-primary">
                            <Briefcase className="h-8 w-8" />
                        </div>
                         <div>
                            <h3 className="font-bold text-lg">I am an estate agent</h3>
                            <p className="text-sm text-muted-foreground">Sign up to list properties and connect with clients.</p>
                        </div>
                         <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground" />
                    </CardHeader>
                </Card>
            </Link>

             <div className="mt-6 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline font-semibold">
                Sign in here
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
                <h2 className="text-4xl font-bold font-headline">The Right Move for Your Property Journey</h2>
                <p className="mt-4 text-lg">Whether you're finding a home or listing one, we provide the tools you need for success.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
