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
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth-supabase";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, ChevronRight } from "lucide-react";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState<'agent' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const persisted = window.localStorage.getItem('adminViewMode');
      if (persisted === 'admin' || persisted === 'agent') return persisted as 'agent' | 'admin';
    }
    return 'agent';
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/admin/dashboard");
    }
  }, [user, loading, router]);

  useEffect(() => {}, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      setViewMode('agent');
      return;
    }
    const adminRoots = [
      '/admin/admin-dashboard',
      '/admin/users',
      '/admin/analytics',
      '/admin/bulk-actions',
      '/admin/settings',
      '/admin/blog',
      '/admin/blog/new',
      '/admin/all-properties',
      '/admin/promotions',
      '/admin/payment-approvals',
      '/admin/system-settings',
      '/admin/leads',
      '/admin/my-team',
    ];
    const isAdminPath = adminRoots.some((r) => pathname?.startsWith(r));
    const mode = isAdminPath ? 'admin' : 'agent';
    setViewMode(mode);
    try { window.localStorage.setItem('adminViewMode', mode); } catch {}
  }, [pathname, user]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isAdmin = user?.role === 'admin';
  const isAdminMode = isAdmin && (typeof viewMode !== 'undefined' ? viewMode === 'admin' : false);

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
    <div className={isAdminMode ? "dark bg-black text-white min-h-screen" : "min-h-screen bg-background text-foreground"}>
      <Header />
      <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar collapsible="icon">
        <SidebarContent className="flex flex-col">
          <SidebarHeader className="p-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold min-w-0">
              <Building className="h-6 w-6 text-primary shrink-0" />
              <span className="font-headline text-lg whitespace-nowrap truncate" title="Agent Panel">Agent Panel</span>
            </Link>
          </SidebarHeader>
          <SidebarMenu className="flex-1 p-4">
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/admin/dashboard" onClick={() => setOpen(false)}>
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
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
                  <SidebarMenuButton asChild tooltip="Post a Development">
                    <Link href="/admin/developments/new" onClick={() => setOpen(false)}>
                      <PlusCircle className="h-5 w-5" />
                      <span>Post a Development</span>
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

            {isAdmin && viewMode === 'admin' && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Overview" onClick={() => { try { window.localStorage.setItem('adminViewMode', 'admin'); } catch {}; router.push('/admin/admin-dashboard'); }}>
                    <Home className="h-5 w-5" />
                    <span>Overview</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Users">
                    <Link href="/admin/users" onClick={() => setOpen(false)}>
                      <Users className="h-5 w-5" />
                      <span>Users</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="All Properties">
                    <Link href="/admin/all-properties" onClick={() => setOpen(false)}>
                      <Package className="h-5 w-5" />
                      <span>All Properties</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Promotions">
                    <Link href="/admin/promotions" onClick={() => setOpen(false)}>
                      <Star className="h-5 w-5" />
                      <span>Promotions</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Analytics">
                    <Link href="/admin/analytics" onClick={() => setOpen(false)}>
                      <LineChart className="h-5 w-5" />
                      <span>Analytics</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Blog Posts">
                    <Link href="/admin/blog" onClick={() => setOpen(false)}>
                      <List className="h-5 w-5" />
                      <span>Blog</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="New Blog Post">
                    <Link href="/admin/blog/new" onClick={() => setOpen(false)}>
                      <PlusCircle className="h-5 w-5" />
                      <span>New Blog Post</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Bulk">
                    <Link href="/admin/bulk-actions" onClick={() => setOpen(false)}>
                      <List className="h-5 w-5" />
                      <span>Bulk</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Payment Approvals">
                    <Link href="/admin/payment-approvals" onClick={() => setOpen(false)}>
                      <CheckCircle className="h-5 w-5" />
                      <span>Payment Approvals</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Leads">
                    <Link href="/admin/leads" onClick={() => setOpen(false)}>
                      <Users2 className="h-5 w-5" />
                      <span>Leads</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="My Team">
                    <Link href="/admin/my-team" onClick={() => setOpen(false)}>
                      <Users2 className="h-5 w-5" />
                      <span>My Team</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="System Settings">
                    <Link href="/admin/system-settings" onClick={() => setOpen(false)}>
                      <Settings className="h-5 w-5" />
                      <span>System Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Settings">
                    <Link href="/admin/settings" onClick={() => setOpen(false)}>
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
            
            {user.role === 'admin' && viewMode === 'admin' && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Admin Dashboard">
                  <Link href="/admin/admin-dashboard" onClick={() => setOpen(false)}>
                    <Shield className="h-5 w-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            
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
        <header className={`sticky top-0 z-30 flex flex-col gap-2 border-b px-4 sm:px-6 py-3 ${isAdminMode ? 'bg-black/70 sm:bg-black' : 'bg-background/70 sm:bg-background'}`}>
          <div className="flex w-full items-center gap-4">
            <SidebarTrigger />
          
          <div className="relative ml-auto flex-1 md:grow-0">
          </div>
          
          {user?.role === 'admin' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (viewMode === 'admin') {
                    try { window.localStorage.setItem('adminViewMode', 'agent'); } catch {}
                    router.push('/admin/dashboard');
                  } else {
                    try { window.localStorage.setItem('adminViewMode', 'admin'); } catch {}
                    router.push('/admin/admin-dashboard');
                  }
                }}
                className="hidden sm:flex items-center gap-2 bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 transition-all duration-200"
              >
                <Shield className="h-4 w-4" />
                <span className="text-xs font-semibold">{viewMode === 'admin' ? 'Switch to Agent' : 'Switch to Admin'}</span>
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (viewMode === 'admin') {
                    try { window.localStorage.setItem('adminViewMode', 'agent'); } catch {}
                    router.push('/admin/dashboard');
                  } else {
                    try { window.localStorage.setItem('adminViewMode', 'admin'); } catch {}
                    router.push('/admin/admin-dashboard');
                  }
                }}
                className="sm:hidden bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800"
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
          </div>
        </header>
        <div className="px-4 sm:px-6 py-2 border-b">
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
            {pathname && pathname.split('/').filter(Boolean).length > 1 && (
              <>
                <Link href="/admin/dashboard" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
                {pathname.split('/').filter(Boolean).slice(1).map((segment, index) => {
                  const currentPath = '/admin/' + pathname.split('/').filter(Boolean).slice(1, index + 2).join('/');
                  let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
                  
                  if (segment === 'all-properties') label = 'All Properties';
                  if (segment === 'properties') label = 'My Properties';
                  if (segment === 'new') label = 'Add New';
                  if (segment === 'admin-dashboard') label = 'Admin Overview';
                  
                  return (
                    <React.Fragment key={currentPath}>
                      <ChevronRight className="h-4 w-4" />
                      <Link
                        href={currentPath}
                        className={`hover:text-primary transition-colors ${
                          index === pathname.split('/').filter(Boolean).slice(1).length - 1 ? 'text-foreground font-medium' : ''
                        }`}
                      >
                        {label}
                      </Link>
                    </React.Fragment>
                  );
                })}
              </>
            )}
          </nav>
        </div>
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
    </div>
  );
}