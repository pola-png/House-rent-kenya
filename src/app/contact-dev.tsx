import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Code, Smartphone, Globe, Zap, Users } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Web Developer | Professional Web Development Services',
  description: 'Get in touch with our expert web developer for custom websites, mobile apps, and digital solutions. WhatsApp: +2349035986401',
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline mb-4">Contact Web Developer</h1>
          <p className="text-xl text-muted-foreground">
            Professional web development services for your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-green-600" />
                Get In Touch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-semibold">WhatsApp</p>
                    <p className="text-lg font-mono">+2349035986401</p>
                  </div>
                </div>
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link href="https://wa.me/2349035986401" target="_blank">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat on WhatsApp
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-6 w-6 text-blue-600" />
                Services Offered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-600" />
                  Custom Website Development
                </li>
                <li className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  Mobile App Development
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  E-commerce Solutions
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  Business Management Systems
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why Choose Our Development Services?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">🚀 Modern Technology Stack</h3>
                <p className="text-muted-foreground">
                  Built with cutting-edge technologies like Next.js, React, TypeScript, and modern databases for optimal performance and scalability.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📱 Mobile-First Design</h3>
                <p className="text-muted-foreground">
                  All websites and applications are designed to work perfectly on mobile devices, tablets, and desktops.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">⚡ Fast & Secure</h3>
                <p className="text-muted-foreground">
                  Optimized for speed with advanced security measures to protect your business and customer data.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🎯 Custom Solutions</h3>
                <p className="text-muted-foreground">
                  Tailored solutions that fit your specific business needs and requirements, not one-size-fits-all templates.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Featured Projects & Expertise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🏠 Real Estate Platforms</h3>
              <p className="text-muted-foreground mb-3">
                Specialized in building comprehensive real estate platforms like House Rent Kenya with advanced search, 
                property management, user authentication, payment integration, and admin dashboards.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Property listing and search functionality</li>
                <li>• User management and authentication systems</li>
                <li>• Payment gateway integration</li>
                <li>• Advanced filtering and analytics</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold">Web Development</h4>
                <p className="text-sm text-muted-foreground">React, Next.js, TypeScript</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold">Backend Systems</h4>
                <p className="text-sm text-muted-foreground">Node.js, Supabase, APIs</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold">Mobile Apps</h4>
                <p className="text-sm text-muted-foreground">React Native, Flutter</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Ready to bring your ideas to life? Let's discuss your project!
          </p>
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href="https://wa.me/2349035986401" target="_blank">
              <MessageCircle className="mr-2 h-5 w-5" />
              Start Your Project Today
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}