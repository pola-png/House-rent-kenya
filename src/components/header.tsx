"use client";

import Link from 'next/link';
import { Building, Menu, Search, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import React from 'react';

const navLinks = [
  { href: '/search?type=rent', label: 'Rent' },
  { href: '/search?type=buy', label: 'Buy' },
  { href: '#', label: 'Agents' },
  { href: '#', label: 'Blog' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className={`p-2 rounded-md transition-colors ${isScrolled ? 'bg-primary' : 'bg-white'}`}>
                <Building className={`h-6 w-6 transition-colors ${isScrolled ? 'text-primary-foreground' : 'text-primary'}`} />
            </div>
            <span className={`text-xl font-bold font-headline transition-colors ${isScrolled ? 'text-foreground' : 'text-white'}`}>
              House Rent Kenya
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${isScrolled ? 'text-foreground' : 'text-white'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" className={`${isScrolled ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground' : 'border-white text-white hover:bg-white hover:text-primary'}`}>List your property</Button>
            <Button asChild className={`${isScrolled ? '' : 'bg-white text-primary hover:bg-gray-200'}`}>
              <Link href="/login">
                <User className="mr-2 h-4 w-4" /> Sign In
              </Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={`${isScrolled ? 'text-foreground' : 'text-white hover:bg-white/20'}`}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background">
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
                  <nav className="flex-1 flex flex-col gap-4 p-4">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className="text-lg font-medium transition-colors hover:text-primary"
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="p-4 border-t flex flex-col gap-4">
                     <Button variant="outline" className='border-primary text-primary'>List your property</Button>
                     <Button asChild>
                      <Link href="/login">
                        <User className="mr-2 h-4 w-4" /> Sign In
                      </Link>
                    </Button>
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
