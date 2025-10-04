
import Link from "next/link";
import {
  Bell,
  Building,
  Home,
  LineChart,
  Package,
  PlusCircle,
  Users,
  PanelLeft,
  Search,
  MessageSquare,
  User,
  Heart,
  PhoneCall,
  Star,
  AreaChart,
  Users2,
  List,
  Settings
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const adminAvatar = placeholderImages.placeholderImages.find(img => img.id === 'agent_1');

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="flex flex-col">
          <SidebarHeader className="p-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
              <Building className="h-6 w-6 text-primary" />
              <span className="font-headline text-lg">Agent Panel</span>
            </Link>
          </SidebarHeader>
          <SidebarMenu className="flex-1 p-4">
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/admin/dashboard">
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Post a Property">
                <Link href="/admin/properties/new">
                  <PlusCircle className="h-5 w-5" />
                  <span>Post a Property</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="My Listings">
                <Link href="/admin/properties">
                  <List className="h-5 w-5" />
                  <span>My Listings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Leads">
                <Link href="/admin/leads">
                  <Star className="h-5 w-5" />
                  <span>Leads</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Property Requests">
                <Link href="/admin/property-requests">
                  <Heart className="h-5 w-5" />
                  <span>Property Requests</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Callback Requests">
                <Link href="/admin/callback-requests">
                  <PhoneCall className="h-5 w-5" />
                  <span>Callback Requests</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Subscription">
                <Link href="/admin/subscription">
                  <Package className="h-5 w-5" />
                  <span>Subscription</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Performance">
                <Link href="/admin/performance">
                  <AreaChart className="h-5 w-5" />
                  <span>Performance</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Profile">
                <Link href="/admin/profile">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="My Team">
                <Link href="/admin/my-team">
                  <Users2 className="h-5 w-5" />
                  <span>My Team</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Messages">
                <Link href="/admin/messages">
                  <MessageSquare className="h-5 w-5" />
                  <span>Messages</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarFooter className="p-4 border-t">
             <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin/settings">
                    <Settings className="h-5 w-5 mr-2" />
                    <span>Settings</span>
                </Link>
             </Button>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <SidebarTrigger className="sm:hidden" />
          
          <div className="relative ml-auto flex-1 md:grow-0">
            {/* Search can be added here if needed */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Avatar>
                    {adminAvatar && <AvatarImage src={adminAvatar.imageUrl} alt="Admin" />}
                    <AvatarFallback>A</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
