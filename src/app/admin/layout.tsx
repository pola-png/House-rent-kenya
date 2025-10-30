"use client";

import { useState } from "react";
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
  Settings,
  LifeBuoy,
  LogOut,
  Loader2,
  CheckCircle,
  Zap
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
  SidebarRail,
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
import { useAuth } from "@/hooks/use-auth-supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/admin/dashboard");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar collapsible="icon">
        <SidebarContent className="flex flex-col">
          <SidebarHeader className="p-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
              <Building className="h-6 w-6 text-primary" />
              <span className="font-headline text-lg">Agent Panel</span>
            </Link>
          </SidebarHeader>
          <SidebarMenu className="flex-1 p-4">
            {/* Agent/User Dashboard */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/admin/dashboard" onClick={() => setOpen(false)}>
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            {/* Agent Features */}
            {(user.role === 'agent' || user.role === 'admin') && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Post a Property">
                    <Link href="/admin/properties/new" onClick={() => setOpen(false)}>
                      <PlusCircle className="h-5 w-5" />
                      <span>Post a Property</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="My Listings">
                    <Link href="/admin/properties" onClick={() => setOpen(false)}>
                      <List className="h-5 w-5" />
                      <span>My Listings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Callback Requests">
                    <Link href="/admin/callback-requests" onClick={() => setOpen(false)}>
                      <PhoneCall className="h-5 w-5" />
                      <span>Callback Requests</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Performance">
                    <Link href="/admin/performance" onClick={() => setOpen(false)}>
                      <AreaChart className="h-5 w-5" />
                      <span>Performance</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
            
            {/* Admin Only Features */}
            {user.role === 'admin' && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Admin Dashboard">
                  <Link href="/admin/admin-dashboard" onClick={() => setOpen(false)}>
                    <Shield className="h-5 w-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            
            {/* Common Features */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Profile">
                <Link href="/admin/profile" onClick={() => setOpen(false)}>
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Messages">
                <Link href="/admin/messages" onClick={() => setOpen(false)}>
                  <MessageSquare className="h-5 w-5" />
                  <span>Messages</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarFooter className="p-4 border-t">
             <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin/settings" onClick={() => setOpen(false)}>
                    <Settings className="h-5 w-5 mr-2" />
                    <span>Settings</span>
                </Link>
             </Button>
          </SidebarFooter>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <SidebarTrigger />
          
          <div className="relative ml-auto flex-1 md:grow-0">
            {/* Search can be added here if needed */}
          </div>
          
          {user?.role === 'admin' && (
            <>
              {/* Desktop Switch Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentPath = window.location.pathname;
                  if (currentPath === '/admin/dashboard') {
                    router.push('/admin/admin-dashboard');
                  } else if (currentPath === '/admin/admin-dashboard') {
                    router.push('/admin/dashboard');
                  } else {
                    router.push('/admin/admin-dashboard');
                  }
                }}
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-purple-100 transition-all duration-200"
              >
                <Shield className="h-4 w-4" />
                <span className="text-xs font-medium">
                  {typeof window !== 'undefined' && window.location.pathname === '/admin/admin-dashboard' ? 'Agent View' : 'Admin View'}
                </span>
              </Button>
              
              {/* Mobile Switch Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const currentPath = window.location.pathname;
                  if (currentPath === '/admin/dashboard') {
                    router.push('/admin/admin-dashboard');
                  } else if (currentPath === '/admin/admin-dashboard') {
                    router.push('/admin/dashboard');
                  } else {
                    router.push('/admin/admin-dashboard');
                  }
                }}
                className="sm:hidden bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-purple-100"
              >
                <Shield className="h-4 w-4" />
              </Button>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Avatar>
                    {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName} />}
                    <AvatarFallback>{user.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/support">Support</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
