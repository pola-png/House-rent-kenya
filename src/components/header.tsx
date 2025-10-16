
"use client";

import Link from 'next/link';
import { Building, Menu, User, X, ChevronDown, ChevronUp, Briefcase, UserCircle, LogOut, Home, Settings, Search } from 'lucide-react';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { Separator } from './ui/separator';
import { useAuth } from '@/hooks/use-auth-supabase';

const navLinks = [
  { href: '/search?type=rent', label: 'To Rent' },
  { href: '/search?type=buy', label: 'For Sale' },
  { href: '/developments', label: 'Developments' },
  { href: '/advice', label: 'Property Advice' },
  { href: '/agents', label: 'Find Agents' },
  { href: '/blog', label: 'Blog' },
];

const seoPages = [
  { href: '/house-rent-in-kenya', label: 'House Rent in Kenya' },
  { href: '/houses-for-rent-in-kenya', label: 'Houses for Rent in Kenya' },
  { href: '/house-rent-in-nairobi', label: 'House Rent in Nairobi' },
  { href: '/2-bedroom-rent-in-kenya', label: '2 Bedroom Rent in Kenya' },
  { href: '/3-bedroom-rent-in-kenya', label: '3 Bedroom Rent in Kenya' },
  { href: '/bedsitter-for-rent-in-kasarani', label: 'Bedsitter for Rent in Kasarani' },
  { href: '/1-bedroom-house-for-rent-in-kisumu', label: '1 Bedroom in Kisumu' },
  { href: '/2-bedroom-house-for-rent-in-mombasa', label: '2 Bedroom in Mombasa' },
  { href: '/3-bedroom-house-for-rent-in-meru', label: '3 Bedroom in Meru' },
  { href: '/real-estate-for-sale', label: 'Real Estate for Sale' },
  { href: '/homes-for-sale', label: 'Homes for Sale' },
  { href: '/houses-for-sale', label: 'Houses for Sale' },
  { href: '/property-for-sale', label: 'Property for Sale' },
  { href: '/real-estate-agents-near-me', label: 'Real Estate Agents Near Me' },
];

export function Header() {
  const { user, logout, loading: isUserLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const isHomepage = pathname === '/';
  
  const linkClasses = `text-sm font-medium transition-colors hover:text-primary text-black`;
  const buttonBorderClasses = 'border-primary text-primary hover:bg-primary hover:text-primary-foreground';

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const renderUserAuth = () => {
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName ?? 'User'} />}
                <AvatarFallback>
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(user.role === 'agent' || user.role === 'admin') && (
              <DropdownMenuItem asChild>
                <Link href="/admin/dashboard">Dashboard</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/admin/profile">Profile</Link>
            </DropdownMenuItem>
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
  };
  
  const MobileUserAuth = () => {
    if (user) {
      return (
        <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground px-4">My Account</p>
            {(user.role === 'agent' || user.role === 'admin') && (
              <SheetClose asChild>
                  <Link href="/admin/dashboard" className="flex items-center gap-2 p-4 text-lg font-medium transition-colors hover:text-primary"><Home className="h-5 w-5"/> Dashboard</Link>
              </SheetClose>
            )}
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

          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className={linkClasses}
                >
                  {link.label}
                </Link>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium text-black hover:text-primary">
                    Browse Properties <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  {seoPages.map((page) => (
                    <DropdownMenuItem key={page.href} asChild>
                      <Link href={page.href} className="text-sm">
                        {page.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
            
            {!isHomepage && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search properties..."
                  className="w-64 pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {user && (user.role === 'agent' || user.role === 'admin') && (
              <Button variant="outline" className={buttonBorderClasses} asChild>
                <Link href="/admin/properties/new">List your property</Link>
              </Button>
            )}
            {renderUserAuth()}
          </div>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={`text-black hover:bg-black/20`}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[400px] bg-background p-0 flex flex-col max-h-screen">
                <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
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
                
                <div className="flex-1 overflow-y-auto">
                  {!isHomepage && (
                    <div className="p-4 border-b">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Search properties..."
                          className="w-full pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                      </div>
                    </div>
                  )}
                  <nav className="flex flex-col gap-1 p-4">
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
                    <Separator className="my-2" />
                    <button
                      onClick={() => setIsBrowseOpen(!isBrowseOpen)}
                      className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground px-2 py-2 hover:text-primary transition-colors"
                    >
                      <span>Browse Properties</span>
                      {isBrowseOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    {isBrowseOpen && (
                      <div className="ml-2 border-l border-muted pl-2 space-y-1">
                        {seoPages.map((page) => (
                          <SheetClose asChild key={page.href}>
                            <Link
                              href={page.href}
                              className="block text-sm font-medium transition-colors hover:text-primary py-1 px-2"
                            >
                              {page.label}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    )}
                  </nav>
                </div>
                
                <div className="p-4 border-t flex flex-col gap-4 flex-shrink-0">
                  {user && (user.role === 'agent' || user.role === 'admin') && (
                    <SheetClose asChild>
                      <Button variant="outline" className='border-primary text-primary' asChild>
                        <Link href="/admin/properties/new">List your property</Link>
                      </Button>
                    </SheetClose>
                  )}
                   <Separator />
                   <MobileUserAuth />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
