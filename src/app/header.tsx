
"use client";

import Link from 'next/link';
import { Building, Menu, User, X, ChevronDown, Briefcase, UserCircle, LogOut, Home, Settings } from 'lucide-react';
import React from 'react';
import { signOut } from 'firebase/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser, useAuth } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { Separator } from './ui/separator';

const navLinks = [
  { href: '/search?type=rent', label: 'To Rent' },
  { href: '/search?type=buy', label: 'For Sale' },
  { href: '/developments', label: 'Developments' },
  { href: '/advice', label: 'Property Advice' },
  { href: '/agents', label: 'Find Agents' },
  { href: '/blog', label: 'Blog' },
];

export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const linkClasses = `text-sm font-medium transition-colors hover:text-primary text-black`;
  const buttonBorderClasses = 'border-primary text-primary hover:bg-primary hover:text-primary-foreground';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Re-sign in anonymously after logout to ensure consistent auth state
      initiateAnonymousSignIn(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: error.message || 'There was an error logging you out.',
      });
    }
  };

  const renderUserAuth = () => {
    if (isUserLoading) {
      return <Skeleton className="h-10 w-24" />;
    }
    if (user && !user.isAnonymous) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? 'User'} />
                <AvatarFallback>
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/admin/profile">Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/admin/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    if (user && user.isAnonymous) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <User className="mr-2 h-4 w-4" /> Sign In <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Choose account type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>User</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
               <Link href="/signup/agent">
                <Briefcase className="mr-2 h-4 w-4" />
                <span>Agent</span>
              </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
    }
    return null;
  };
  
  const MobileUserAuth = () => {
    if (isUserLoading) {
      return <Skeleton className="h-10 w-full" />;
    }
    if (user && !user.isAnonymous) {
      return (
        <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground px-4">My Account</p>
            <SheetClose asChild>
                <Link href="/admin/dashboard" className="flex items-center gap-2 p-4 text-lg font-medium transition-colors hover:text-primary"><Home className="h-5 w-5"/> Dashboard</Link>
            </SheetClose>
            <SheetClose asChild>
                <Link href="/admin/profile" className="flex items-center gap-2 p-4 text-lg font-medium transition-colors hover:text-primary"><UserCircle className="h-5 w-5"/> Profile</Link>
            </SheetClose>
             <SheetClose asChild>
                <Link href="/admin/settings" className="flex items-center gap-2 p-4 text-lg font-medium transition-colors hover:text-primary"><Settings className="h-5 w-5"/> Settings</Link>
            </SheetClose>
             <Separator className="my-2"/>
            <SheetClose asChild>
                <Button onClick={handleLogout} variant="ghost">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
            </SheetClose>
        </div>
      );
    }
    return (
        <div className="flex flex-col gap-2">
            <SheetClose asChild>
                <Button asChild>
                    <Link href="/login"><UserCircle className="mr-2 h-4 w-4" /> Sign In as User</Link>
                </Button>
            </SheetClose>
            <SheetClose asChild>
                <Button asChild variant="secondary">
                    <Link href="/signup/agent"><Briefcase className="mr-2 h-4 w-4" /> Register as Agent</Link>
                </Button>
            </SheetClose>
        </div>
    );
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 bg-background shadow-md`}>
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className={`p-2 rounded-md transition-colors bg-primary`}>
                <Building className={`h-6 w-6 transition-colors text-primary-foreground`} />
            </div>
            <span className={`text-xl font-bold font-headline transition-colors text-black`}>
              House Rent Kenya
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className={linkClasses}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" className={buttonBorderClasses} asChild>
              <Link href="/admin/properties/new">List your property</Link>
            </Button>
            {renderUserAuth()}
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={`text-black hover:bg-black/20`}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background p-0">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center p-4 border-b">
                     <Link href="/" className="flex items-center gap-2">
                        <div className="p-2 rounded-md bg-primary">
                            <Building className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold font-headline">House Rent Kenya</span>
                    </Link>
                    <SheetClose asChild>
                       <Button variant="ghost" size="icon">
                         <X className="h-6 w-6" />
                       </Button>
                    </SheetClose>
                  </div>
                  <nav className="flex-1 flex flex-col gap-1 p-4">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={`${link.href}-${link.label}`}>
                        <Link
                          href={link.href}
                          className="text-lg font-medium transition-colors hover:text-primary py-2"
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="p-4 border-t flex flex-col gap-4">
                    <SheetClose asChild>
                      <Button variant="outline" className='border-primary text-primary' asChild>
                        <Link href="/admin/properties/new">List your property</Link>
                      </Button>
                    </SheetClose>
                     <Separator />
                     <MobileUserAuth />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
