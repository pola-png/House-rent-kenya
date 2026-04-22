"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building,
  Home,
  LineChart,
  Package,
  PlusCircle,
  Users,
  MessageSquare,
  User,
  PhoneCall,
  Star,
  AreaChart,
  Users2,
  List,
  Settings,
  LifeBuoy,
  LogOut,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/components/header";
import { NavigationLoader } from "@/components/navigation-loader";
import { useAuth } from "@/hooks/use-auth-supabase";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Shield } from "lucide-react";
import React from "react";
import { getDashboardUrlForPath, isAdminModePath } from "@/lib/admin-navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/admin/dashboard");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    router.prefetch("/admin/dashboard");
    if (user.role === "admin") {
      router.prefetch("/admin/admin-dashboard");
      router.prefetch("/admin/users");
      router.prefetch("/admin/all-properties");
      router.prefetch("/admin/payment-approvals");
      router.prefetch("/admin/analytics");
    }
  }, [router, user]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isAdmin = user?.role === 'admin';
  const isAdminMode = isAdmin && isAdminModePath(pathname);
  const viewMode: 'agent' | 'admin' = isAdminMode ? 'admin' : 'agent';
  const nextDashboardPath = getDashboardUrlForPath(pathname, user?.role);
  const switchModePath = isAdminMode ? '/admin/dashboard' : '/admin/admin-dashboard';

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <NavigationLoader />
        <Header />
        <div className="mx-auto flex max-w-7xl gap-6 px-3 pt-28 sm:px-6">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="rounded-xl border bg-card p-4">
              <div className="space-y-4">
                <Skeleton className="h-7 w-32" />
                <div className="space-y-3">
                  {Array.from({ length: 7 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-md" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
          <div className="min-w-0 flex-1 space-y-6">
            <div className="sticky top-0 z-30 rounded-xl border bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-10 w-10 rounded-md lg:hidden" />
                <div className="ml-auto flex items-center gap-3">
                  <Skeleton className="hidden h-9 w-36 sm:block" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
            </div>
            <div className="space-y-6 pb-10">
              <div className="space-y-2">
                <Skeleton className="h-9 w-56" />
                <Skeleton className="h-4 w-80 max-w-full" />
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="rounded-xl border bg-card p-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="mt-4 h-8 w-28" />
                    <Skeleton className="mt-3 h-3 w-20" />
                  </div>
                ))}
              </div>
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="rounded-xl border bg-card p-6">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="mt-2 h-4 w-52" />
                    <div className="mt-6 space-y-4">
                      {Array.from({ length: 4 }).map((__, rowIndex) => (
                        <div key={rowIndex} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                          <Skeleton className="h-6 w-14 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={isAdminMode ? "dark bg-black text-white min-h-screen" : "min-h-screen bg-background text-foreground"}>
      <NavigationLoader />
      <div className={isAdminMode ? "dark" : ""}>
        <Header />
      </div>
      <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar collapsible="icon" className="mt-28 h-[calc(100vh-8rem)] flex flex-col">
        <SidebarContent className="flex flex-col">
          <SidebarHeader className="p-4">
            <Link href={nextDashboardPath} className="flex items-center gap-2 font-semibold min-w-0">
              <Building className="h-6 w-6 text-primary shrink-0" />
              <span className="font-headline text-lg whitespace-nowrap truncate" title={viewMode === 'admin' ? 'Admin Panel' : 'Agent Panel'}>
                {viewMode === 'admin' ? 'Admin Panel' : 'Agent Panel'}
              </span>
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
            
            {(user.role === 'agent' || user.role === 'admin') && viewMode === 'agent' && (
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
                  <SidebarMenuButton tooltip="Overview" onClick={() => router.push('/admin/admin-dashboard')}>
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
            
            {viewMode === 'agent' && (
              <>
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
              </>
            )}
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
                onClick={() => router.push(switchModePath)}
                className="hidden sm:flex items-center gap-2 bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 transition-all duration-200"
              >
                <Shield className="h-4 w-4" />
                <span className="text-xs font-semibold">{viewMode === 'admin' ? 'Switch to Agent' : 'Switch to Admin'}</span>
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(switchModePath)}
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
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
    </div>
  );
}
