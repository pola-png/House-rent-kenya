
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Camera, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth-supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    agencyName: ''
  });

  useEffect(() => {
    if (user && !loading) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        agencyName: user.agencyName || ''
      });
    }
  }, [user, loading]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      // Delete old photo if exists
      if (user.photoURL) {
        const oldPath = user.photoURL.split('/').slice(-2).join('/');
        await supabase.storage.from('user-uploads').remove([oldPath]);
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.uid}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        if (uploadError.message.includes('not found')) {
          throw new Error('Storage bucket not configured. Please contact admin.');
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);

      const newPhotoURL = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase.auth.updateUser({
        data: { photoURL: newPhotoURL }
      });

      if (updateError) throw updateError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ photoURL: newPhotoURL })
        .eq('id', user.uid);

      if (profileError) throw profileError;

      toast({
        title: "Success!",
        description: "Profile photo updated successfully."
      });
      
      setTimeout(() => window.location.reload(), 500);
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Could not upload photo. Ensure storage is configured."
      });
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          agencyName: formData.agencyName,
          displayName: `${formData.firstName} ${formData.lastName}`
        }
      });

      if (authError) throw authError;

      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          agencyName: formData.agencyName,
          displayName: `${formData.firstName} ${formData.lastName}`,
          updatedAt: new Date().toISOString()
        })
        .eq('id', user.uid);

      if (profileError) throw profileError;

      toast({
        title: "Success!",
        description: "Profile updated successfully."
      });
      
      window.location.reload();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not update profile."
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-6 w-6" />
          Profile
        </CardTitle>
        <CardDescription>
          Manage your personal and agency profile information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName} />}
              <AvatarFallback className="text-2xl">
                {user.displayName?.charAt(0).toUpperCase() || <User />}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>
          <div className="text-center">
            <p className="font-semibold">{user.displayName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>

          {user.role === 'agent' && (
            <div className="space-y-2">
              <Label htmlFor="agencyName">Agency Name</Label>
              <Input
                id="agencyName"
                value={formData.agencyName}
                onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
              />
            </div>
          )}

          <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
