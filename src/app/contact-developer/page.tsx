import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Code, Smartphone, Globe, Zap, Users } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Web Developer | Professional Web Development Services',
  description: 'Get in touch with our expert web developer for custom websites, mobile apps, and digital solutions. WhatsApp: +2349035986401',
};

export default function ContactDeveloperPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline mb-4">Contact Web Developer</h1>
          <p className="text-xl text-muted-foreground mb-4">
            Professional web development services for your business needs
          </p>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
            <p className="text-lg font-semibold text-green-800 mb-2">
              🏠 We are the developers behind the success of House Rent Kenya!
            </p>
            <p className="text-sm text-green-700">
              Experience the same quality and expertise that powers this platform for your next project.
            </p>
          </div>
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
                  Built with cutting-edge technologies and modern frameworks for optimal performance, security, and scalability.
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
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border-2 border-green-200">
              <h3 className="font-semibold text-lg mb-2">🏠 Real Estate & Property Management</h3>
              <p className="text-muted-foreground mb-3">
                <strong className="text-green-700">Featured Success: House Rent Kenya</strong> - We built this comprehensive 
                real estate platform with advanced search, user management, secure payment processing, and administrative dashboards.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Custom search and filtering systems</li>
                <li>• Secure user authentication and management</li>
                <li>• Payment gateway integration</li>
                <li>• Advanced analytics and reporting</li>
                <li>• Mobile-responsive design</li>
                <li>• SEO optimization and performance</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🛒 E-commerce & Online Stores</h3>
              <p className="text-muted-foreground mb-3">
                Complete e-commerce solutions with inventory management, order processing, 
                and secure payment systems for online businesses.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Product catalog and inventory management</li>
                <li>• Shopping cart and checkout systems</li>
                <li>• Multi-payment gateway integration</li>
                <li>• Order tracking and management</li>
                <li>• Customer account portals</li>
                <li>• Sales analytics and reporting</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🏥 Healthcare & Medical Systems</h3>
              <p className="text-muted-foreground mb-3">
                HIPAA-compliant healthcare platforms with appointment scheduling, 
                patient management, and telemedicine capabilities.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Patient portal and medical records</li>
                <li>• Appointment booking systems</li>
                <li>• Telemedicine and video consultations</li>
                <li>• Prescription management</li>
                <li>• Medical billing integration</li>
                <li>• HIPAA compliance and security</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🎓 Education & Learning Management</h3>
              <p className="text-muted-foreground mb-3">
                Educational platforms with course management, student tracking, 
                and interactive learning tools for schools and training centers.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Learning management systems (LMS)</li>
                <li>• Student and instructor portals</li>
                <li>• Course creation and delivery</li>
                <li>• Assessment and grading tools</li>
                <li>• Progress tracking and analytics</li>
                <li>• Virtual classroom integration</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">💼 Business Management & CRM</h3>
              <p className="text-muted-foreground mb-3">
                Custom business solutions with customer relationship management, 
                project tracking, and workflow automation.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Customer relationship management (CRM)</li>
                <li>• Project management and tracking</li>
                <li>• Inventory and supply chain management</li>
                <li>• Employee management systems</li>
                <li>• Financial reporting and analytics</li>
                <li>• Workflow automation tools</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🚛 Transportation & Logistics</h3>
              <p className="text-muted-foreground mb-3">
                Fleet management and logistics platforms with real-time tracking, 
                route optimization, and delivery management.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Fleet tracking and management</li>
                <li>• Route optimization systems</li>
                <li>• Delivery scheduling and tracking</li>
                <li>• Driver management portals</li>
                <li>• Fuel and maintenance tracking</li>
                <li>• Customer delivery notifications</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">📱 Social Media & Networking</h3>
              <p className="text-muted-foreground mb-3">
                Social networking platforms with user engagement, content management, 
                and community building features.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• User profiles and social connections</li>
                <li>• Content sharing and media uploads</li>
                <li>• Real-time messaging and chat</li>
                <li>• News feeds and timeline features</li>
                <li>• Community groups and forums</li>
                <li>• Social analytics and insights</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🏫 School Portals & Management</h3>
              <p className="text-muted-foreground mb-3">
                Comprehensive school management systems with student information, 
                academic tracking, and parent communication tools.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Student information systems (SIS)</li>
                <li>• Grade and attendance tracking</li>
                <li>• Parent-teacher communication portals</li>
                <li>• Class scheduling and timetables</li>
                <li>• Fee management and billing</li>
                <li>• Academic performance analytics</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🎮 Entertainment & Gaming</h3>
              <p className="text-muted-foreground mb-3">
                Interactive gaming platforms and entertainment apps with user engagement, 
                leaderboards, and social gaming features.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Multiplayer gaming systems</li>
                <li>• User profiles and achievements</li>
                <li>• Leaderboards and competitions</li>
                <li>• In-app purchases and monetization</li>
                <li>• Social gaming features</li>
                <li>• Real-time game analytics</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🏦 Financial & Banking Systems</h3>
              <p className="text-muted-foreground mb-3">
                Secure financial platforms with transaction processing, 
                account management, and compliance features.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Digital banking and account management</li>
                <li>• Payment processing and transfers</li>
                <li>• Loan and credit management</li>
                <li>• Financial reporting and analytics</li>
                <li>• Compliance and security features</li>
                <li>• Mobile banking applications</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-lime-50 to-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🍽️ Food & Restaurant Management</h3>
              <p className="text-muted-foreground mb-3">
                Restaurant and food delivery platforms with order management, 
                inventory tracking, and customer service tools.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Online ordering and delivery systems</li>
                <li>• Menu management and pricing</li>
                <li>• Kitchen display and order tracking</li>
                <li>• Customer loyalty programs</li>
                <li>• Inventory and supplier management</li>
                <li>• Sales and performance analytics</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">✈️ Travel & Hospitality</h3>
              <p className="text-muted-foreground mb-3">
                Travel booking and hospitality management systems with reservations, 
                customer service, and booking management.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Hotel and flight booking systems</li>
                <li>• Reservation management</li>
                <li>• Customer check-in and check-out</li>
                <li>• Travel itinerary planning</li>
                <li>• Payment and billing integration</li>
                <li>• Customer review and rating systems</li>
              </ul>
            </div>sName="text-sm text-muted-foreground space-y-1">
                <li>• Customer relationship management (CRM)</li>
                <li>• Project management and tracking</li>
                <li>• Inventory and supply chain management</li>
                <li>• Employee management systems</li>
                <li>• Financial reporting and analytics</li>
                <li>• Workflow automation tools</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🚗 Transportation & Logistics</h3>
              <p className="text-muted-foreground mb-3">
                Fleet management and logistics platforms with real-time tracking, 
                route optimization, and delivery management.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Fleet tracking and management</li>
                <li>• Route optimization systems</li>
                <li>• Delivery scheduling and tracking</li>
                <li>• Driver management portals</li>
                <li>• Fuel and maintenance tracking</li>
                <li>• Customer delivery notifications</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold">Frontend Development</h4>
                <p className="text-sm text-muted-foreground">Modern Web Technologies</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold">Backend Systems</h4>
                <p className="text-sm text-muted-foreground">Secure Database Solutions</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold">Mobile Apps</h4>
                <p className="text-sm text-muted-foreground">Cross-Platform Development</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold">Cloud Solutions</h4>
                <p className="text-sm text-muted-foreground">Scalable Infrastructure</p>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <h4 className="font-semibold">API Development</h4>
                <p className="text-sm text-muted-foreground">RESTful & GraphQL APIs</p>
              </div>
              <div className="text-center p-4 bg-teal-50 rounded-lg">
                <h4 className="font-semibold">DevOps & Deployment</h4>
                <p className="text-sm text-muted-foreground">CI/CD & Automation</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold">UI/UX Design</h4>
                <p className="text-sm text-muted-foreground">User-Centered Design</p>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <h4 className="font-semibold">Data Analytics</h4>
                <p className="text-sm text-muted-foreground">Business Intelligence</p>
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