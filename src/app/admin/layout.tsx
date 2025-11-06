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
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const [reauthOpen, setReauthOpen] = useState(false);
  const [reauthLoading, setReauthLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [reauthTarget, setReauthTarget] = useState<null | 'admin' | 'agent'>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/admin/dashboard");
    }
  }, [user, loading, router]);

  // Allow pages to open the reauth overlay via event
  useEffect(() => {
    const handler = (e: any) => {
      const to = e?.detail?.to as 'admin' | 'agent' | undefined;
      setReauthTarget(to ?? null);
      setReauthOpen(true);
    };
    // @ts-ignore
    window.addEventListener('open-admin-reauth', handler);
    return () => {
      // @ts-ignore
      window.removeEventListener('open-admin-reauth', handler);
    };
  }, []);

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
    <div className="dark bg-black text-white min-h-screen">
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

            {/* Admin-only menu */}
            {isAdmin && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Overview" onClick={() => { setReauthTarget('admin'); setReauthOpen(true); }}>
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
                  <SidebarMenuButton asChild tooltip="Properties">
                    <Link href="/admin/properties" onClick={() => setOpen(false)}>
                      <Package className="h-5 w-5" />
                      <span>Properties</span>
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
                  <SidebarMenuButton asChild tooltip="Settings">
                    <Link href="/admin/settings" onClick={() => setOpen(false)}>
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
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
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-black/70 px-4 sm:static sm:h-auto sm:border-0 sm:bg-black sm:px-6">
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
                onClick={() => setReauthOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 transition-all duration-200"
              >
                <Shield className="h-4 w-4" />
                <span className="text-xs font-semibold">Switch to Admin</span>
              </Button>
              
              {/* Mobile Switch Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setReauthOpen(true)}
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
        </header>
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
    {/* Re-auth overlay */}
    {reauthOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div className="w-full max-w-sm rounded-lg border border-zinc-700 bg-zinc-900 p-4 text-white shadow-lg">
          <div className="mb-3 text-lg font-semibold">Confirm Admin Access</div>
          <p className="mb-3 text-sm text-zinc-300">For security, please re-enter your password to switch admin views.</p>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm outline-none focus:border-zinc-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={reauthLoading}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => { setReauthOpen(false); setPassword(""); }} disabled={reauthLoading} className="border-zinc-700 text-white hover:bg-zinc-800">Cancel</Button>
            <Button
              onClick={async () => {
                if (!user?.email) {
                  router.push('/login?redirect=/admin/admin-dashboard');
                  return;
                }
                try {
                  setReauthLoading(true);
                  const { error } = await supabase.auth.signInWithPassword({ email: user.email, password });
                  if (error) throw error;
                  // Navigate based on chosen target or toggle
                  const currentPath = window.location.pathname;
                  if (reauthTarget === 'admin') {
                    router.push('/admin/admin-dashboard');
                  } else if (reauthTarget === 'agent') {
                    router.push('/admin/dashboard');
                  } else {
                    if (currentPath === '/admin/admin-dashboard') router.push('/admin/dashboard');
                    else router.push('/admin/admin-dashboard');
                  }
                  setReauthOpen(false); setPassword("");
                } catch (e: any) {
                  toast({ variant: 'destructive', title: 'Re-auth failed', description: e?.message || 'Invalid password' });
                } finally {
                  setReauthLoading(false);
                }
              }}
              disabled={reauthLoading || password.length < 4}
            >
              {reauthLoading ? 'Checking…' : 'Confirm'}
            </Button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
