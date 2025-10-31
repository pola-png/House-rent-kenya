'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth-supabase';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Users, Shield, UserCog, Ban, CheckCircle, Crown, Activity, Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phoneNumber?: string;
  createdAt: string;
  isActive?: boolean;
  isPro?: boolean;
  proExpiresAt?: string;
  isBanned?: boolean;
  propertyCount?: number;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchUsers();
    
    // Real-time updates every 30 seconds
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('createdAt', { ascending: false });

      // Get property counts for agents
      const { data: propertyCounts } = await supabase
        .from('properties')
        .select('landlordId')
        .not('landlordId', 'is', null);

      const propertyCountMap = propertyCounts?.reduce((acc: any, prop) => {
        acc[prop.landlordId] = (acc[prop.landlordId] || 0) + 1;
        return acc;
      }, {}) || {};

      const usersWithCounts = (data || []).map(user => ({
        ...user,
        propertyCount: propertyCountMap[user.id] || 0
      }));

      if (error) throw error;
      setUsers(usersWithCounts);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(u => u.isActive !== false);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(u => u.isActive === false);
      } else if (statusFilter === 'pro') {
        filtered = filtered.filter(u => u.isPro === true);
      }
    }

    setFilteredUsers(filtered);
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    // Admin confirmation
    if (newRole === 'admin') {
      const userToPromote = users.find(u => u.id === userId);
      const confirmed = confirm(
        `Are you sure you want to make ${userToPromote?.displayName || userToPromote?.email} an ADMIN?\n\nThis will give them full administrative access to the platform.`
      );
      if (!confirmed) return;
    }

    // Instant state update
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      toast({ title: 'Role Updated', description: `User role changed to ${newRole}.` });
    } catch (error) {
      console.error('Error updating role:', error);
      // Revert on error
      fetchUsers();
      toast({ title: 'Error', description: 'Failed to update user role.', variant: 'destructive' });
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    const newStatus = !isActive;
    
    // Instant state update
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: newStatus } : u));
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ isActive: newStatus })
        .eq('id', userId);

      if (error) throw error;
      toast({ title: newStatus ? 'User Activated' : 'User Deactivated', description: 'User status updated.' });
    } catch (error) {
      console.error('Error toggling status:', error);
      // Revert on error
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: isActive } : u));
      toast({ title: 'Error', description: 'Failed to update user status.', variant: 'destructive' });
    }
  };

  const toggleProStatus = async (userId: string, isPro: boolean) => {
    const newProStatus = !isPro;
    const expiryDate = newProStatus ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null;
    
    // Instant state update
    setUsers(prev => prev.map(u => u.id === userId ? { 
      ...u, 
      isPro: newProStatus,
      proExpiresAt: expiryDate 
    } : u));
    
    try {
      const updates: any = { isPro: newProStatus };
      if (newProStatus) {
        updates.proExpiresAt = expiryDate;
      } else {
        updates.proExpiresAt = null;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      toast({ title: newProStatus ? 'Pro Activated' : 'Pro Removed', description: 'Pro status updated.' });
    } catch (error) {
      console.error('Error toggling pro:', error);
      // Revert on error
      setUsers(prev => prev.map(u => u.id === userId ? { 
        ...u, 
        isPro: isPro,
        proExpiresAt: u.proExpiresAt 
      } : u));
      toast({ title: 'Error', description: 'Failed to update Pro status.', variant: 'destructive' });
    }
  };

  if (user?.role !== 'admin') return null;

  const banUser = async (userId: string, currentStatus: boolean) => {
    const newBanStatus = !currentStatus;
    
    // Instant state update
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: newBanStatus } : u));
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ isBanned: newBanStatus })
        .eq('id', userId);

      if (error) throw error;
      toast({ 
        title: newBanStatus ? 'User Banned' : 'User Unbanned', 
        description: 'User status updated successfully.' 
      });
    } catch (error) {
      console.error('Error updating ban status:', error);
      // Revert on error
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: currentStatus } : u));
      toast({ title: 'Error', description: 'Failed to update ban status.', variant: 'destructive' });
    }
  };

  const deleteUser = async (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    const confirmed = confirm(
      `⚠️ PERMANENT DELETION\n\nAre you sure you want to permanently delete:\n${userToDelete?.displayName || userToDelete?.email}?\n\nThis will:\n- Delete their profile\n- Delete their auth account\n- Remove all their properties\n- Cannot be undone`
    );
    if (!confirmed) return;
    
    // Instant state update
    setUsers(prev => prev.filter(u => u.id !== userId));
    
    try {
      // Delete from auth (this will cascade to profiles due to foreign key)
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) {
        // If auth deletion fails, try profile deletion
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);
          
        if (profileError) throw profileError;
      }

      toast({ title: 'User Deleted', description: 'User and all associated data permanently deleted.' });
    } catch (error) {
      console.error('Error deleting user:', error);
      // Revert on error
      fetchUsers();
      toast({ title: 'Error', description: 'Failed to delete user. They may still be logged in.', variant: 'destructive' });
    }
  };

  const stats = {
    total: users.length,
    agents: users.filter(u => u.role === 'agent').length,
    admins: users.filter(u => u.role === 'admin').length,
    pro: users.filter(u => u.isPro).length,
    active: users.filter(u => u.isActive !== false).length,
    banned: users.filter(u => u.isBanned).length
  };

  if (user?.role !== 'admin') return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users & Agents</h1>
          <p className="text-muted-foreground">Comprehensive user management and control</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Activity className="h-3 w-3 mr-1" />
            Live Data
          </Badge>
        </div>
      </div>

      {/* Enhanced Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agents</CardTitle>
            <UserCog className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.agents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pro Users</CardTitle>
            <Crown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pro}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banned</CardTitle>
            <Ban className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.banned}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="agent">Agents</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pro">Pro Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users & Agents ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{u.displayName || `${u.firstName} ${u.lastName}`}</div>
                    {u.isPro && <Crown className="h-4 w-4 text-yellow-500" />}
                    {u.isActive === false && <Ban className="h-4 w-4 text-red-500" />}
                    {u.isBanned && <Ban className="h-4 w-4 text-red-600" />}
                  </div>
                  <div className="text-sm text-muted-foreground">{u.email}</div>
                  {u.phoneNumber && <div className="text-sm text-muted-foreground">{u.phoneNumber}</div>}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span>Joined: {new Date(u.createdAt).toLocaleDateString()}</span>
                    {u.role === 'agent' && (
                      <span>Properties: {u.propertyCount || 0}</span>
                    )}
                    {u.isPro && u.proExpiresAt && (
                      <span>Pro expires: {new Date(u.proExpiresAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                {/* Real-time Controls */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-12">Active</span>
                    <Switch
                      checked={u.isActive !== false}
                      onCheckedChange={() => toggleUserStatus(u.id, u.isActive !== false)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-12">Pro</span>
                    <Switch
                      checked={u.isPro || false}
                      onCheckedChange={() => toggleProStatus(u.id, u.isPro || false)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-12">Ban</span>
                    <Switch
                      checked={u.isBanned || false}
                      onCheckedChange={() => banUser(u.id, u.isBanned || false)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Badge variant={u.role === 'admin' ? 'default' : u.role === 'agent' ? 'secondary' : 'outline'}>
                    {u.role}
                  </Badge>
                  <Select value={u.role} onValueChange={(value) => updateUserRole(u.id, value)}>
                    <SelectTrigger className="w-24 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteUser(u.id)}
                    className="h-8 text-xs"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
