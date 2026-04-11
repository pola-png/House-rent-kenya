import Link from 'next/link';
import Image from 'next/image';
import { Building, User, Briefcase, ArrowRight, Star, Shield, Zap } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SignupOptionsPage() {
    const bgImage = placeholderImages.placeholderImages.find(img => img.id === 'auth_bg');

  return (
    <div className="w-full lg:grid lg:min-h-[calc(100vh-5rem)] lg:grid-cols-2 xl:min-h-[calc(100vh-5rem)] bg-gradient-to-br from-background to-muted/20">
      <div className="flex items-center justify-center py-12 px-4">
        <div className="mx-auto max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-blue-600 rounded-full mb-6">
              <User className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
              Join Our Community
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Choose your account type to get started with the perfect property experience.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Shield className="h-3 w-3 mr-1" /> Secure
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Zap className="h-3 w-3 mr-1" /> Fast Setup
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Star className="h-3 w-3 mr-1" /> Free
              </Badge>
            </div>
          </div>
          
          <div className="space-y-4">
            <Link href="/signup/user" className="block group">
                <Card className="hover:shadow-xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-6">
                        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white group-hover:scale-110 transition-transform">
                            <User className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-xl mb-2">Property Seeker</h3>
                            <p className="text-muted-foreground">Find your perfect home with personalized recommendations and saved searches.</p>
                            <div className="flex items-center gap-2 mt-3">
                              <Badge variant="secondary" className="text-xs">Save Properties</Badge>
                              <Badge variant="secondary" className="text-xs">Get Alerts</Badge>
                            </div>
                        </div>
                         <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </CardHeader>
                </Card>
            </Link>

            <Link href="/signup/agent" className="block group">
                <Card className="hover:shadow-xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-6">
                        <div className="p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white group-hover:scale-110 transition-transform">
                            <Briefcase className="h-8 w-8" />
                        </div>
                         <div className="flex-1">
                            <h3 className="font-bold text-xl mb-2">Real Estate Agent</h3>
                            <p className="text-muted-foreground">List properties, manage clients, and grow your real estate business.</p>
                            <div className="flex items-center gap-2 mt-3">
                              <Badge variant="secondary" className="text-xs">List Properties</Badge>
                              <Badge variant="secondary" className="text-xs">Manage Leads</Badge>
                            </div>
                        </div>
                         <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </CardHeader>
                </Card>
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm mb-4">Already have an account?</p>
            <Button variant="outline" asChild className="w-full">
              <Link href="/login">
                Sign in to your account
              </Link>
            </Button>
          </div>
        </div>
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
                <h2 className="text-5xl font-bold font-headline mb-6 leading-tight">Start Your Property Journey Today</h2>
                <p className="text-xl text-white/90 leading-relaxed mb-8">Join thousands of property seekers and agents who trust us to connect them with their perfect match.</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span>10,000+ Properties</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                    <span>Verified Agents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                    <span>Instant Alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                    <span>Free to Join</span>
                  </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
