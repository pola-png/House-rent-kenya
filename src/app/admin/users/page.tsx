'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth-supabase';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Users, Shield, UserCog, Ban, CheckCircle, Crown } from 'lucide-react';
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
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      toast({ title: 'Role Updated', description: 'User role has been updated successfully.' });
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({ title: 'Error', description: 'Failed to update user role.', variant: 'destructive' });
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ isActive: !isActive })
        .eq('id', userId);

      if (error) throw error;
      toast({ title: isActive ? 'User Deactivated' : 'User Activated', description: 'User status updated.' });
      fetchUsers();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast({ title: 'Error', description: 'Failed to update user status.', variant: 'destructive' });
    }
  };

  const toggleProStatus = async (userId: string, isPro: boolean) => {
    try {
      const updates: any = { isPro: !isPro };
      if (!isPro) {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        updates.proExpiresAt = expiryDate.toISOString();
      } else {
        updates.proExpiresAt = null;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      toast({ title: isPro ? 'Pro Removed' : 'Pro Activated', description: 'Pro status updated.' });
      fetchUsers();
    } catch (error) {
      console.error('Error toggling pro:', error);
      toast({ title: 'Error', description: 'Failed to update Pro status.', variant: 'destructive' });
    }
  };

  if (user?.role !== 'admin') return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">Manage user roles and permissions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agents</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role === 'agent').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{u.displayName || `${u.firstName} ${u.lastName}`}</div>
                    {u.isPro && <Crown className="h-4 w-4 text-yellow-500" />}
                    {u.isActive === false && <Ban className="h-4 w-4 text-red-500" />}
                  </div>
                  <div className="text-sm text-muted-foreground">{u.email}</div>
                  {u.phoneNumber && <div className="text-sm text-muted-foreground">{u.phoneNumber}</div>}
                  {u.isPro && u.proExpiresAt && (
                    <div className="text-xs text-muted-foreground">Pro expires: {new Date(u.proExpiresAt).toLocaleDateString()}</div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Active</span>
                      <Switch
                        checked={u.isActive !== false}
                        onCheckedChange={() => toggleUserStatus(u.id, u.isActive !== false)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Pro</span>
                      <Switch
                        checked={u.isPro || false}
                        onCheckedChange={() => toggleProStatus(u.id, u.isPro || false)}
                      />
                    </div>
                  </div>
                  <Badge variant={u.role === 'admin' ? 'default' : u.role === 'agent' ? 'secondary' : 'outline'}>
                    {u.role}
                  </Badge>
                  <Select value={u.role} onValueChange={(value) => updateUserRole(u.id, value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
