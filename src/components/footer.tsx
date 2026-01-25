import Link from 'next/link';
import { Building, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Blog', href: '/blog' },
  ],
  explore: [
    { label: 'Rent', href: '/search?type=rent' },
    { label: 'Buy', href: '/search?type=buy' },
    { label: 'Agents', href: '/agents' },
  ],
  support: [
    { label: 'Help Center', href: '/contact' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Contact Web Developer', href: '/contact-developer' },
    { label: 'Sitemap', href: '/sitemap.xml' },
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
    <footer className="bg-secondary text-secondary-foreground mt-16">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-md bg-primary">
                <Building className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold font-headline">House Rent Kenya</span>
            </Link>
            <p className="text-muted-foreground mb-6">
              Your one-stop platform for finding rental properties across Kenya. We simplify the search for your next home.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <Button key={social.name} variant="outline" size="icon" asChild className="bg-background hover:bg-primary hover:text-primary-foreground">
                  <a href={social.href} aria-label={social.name}>
                    <social.icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-bold font-headline mb-4 text-lg">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold font-headline mb-4 text-lg">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold font-headline mb-4 text-lg">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-6">
          <p className="text-sm text-muted-foreground text-center">&copy; {new Date().getFullYear()} House Rent Kenya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
