import Link from 'next/link';
import { Building, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const footerLinks = {
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
  ],
  explore: [
    { label: 'Rent', href: '/search?type=rent' },
    { label: 'Buy', href: '/search?type=buy' },
    { label: 'Agents', href: '#' },
    { label: 'Neighborhoods', href: '#' },
  ],
  support: [
    { label: 'Help Center', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Sitemap', href: '#' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', name: 'Facebook' },
  { icon: Twitter, href: '#', name: 'Twitter' },
  { icon: Instagram, href: '#', name: 'Instagram' },
  { icon: Linkedin, href: '#', name: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-2 xl:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-md bg-primary">
                <Building className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold font-headline">House Rent Kenya</span>
            </Link>
            <p className="max-w-md text-muted-foreground mb-6">
              Your one-stop platform for finding rental properties across Kenya. We simplify the search for your next home.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Button key={social.name} variant="outline" size="icon" asChild className="bg-background">
                  <a href={social.href} aria-label={social.name}>
                    <social.icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-3">
            <div>
              <h3 className="font-bold font-headline mb-4">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold font-headline mb-4">Explore</h3>
              <ul className="space-y-2">
                {footerLinks.explore.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold font-headline mb-4">Support</h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        <div className="border-t pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} House Rent Kenya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
