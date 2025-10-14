"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth-supabase";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Users, Building, Mail, Trash2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function BulkActionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [userIds, setUserIds] = useState("");
  const [propertyIds, setPropertyIds] = useState("");
  const [bulkAction, setBulkAction] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  if (user?.role !== "admin") {
    router.push("/admin/dashboard");
    return null;
  }

  const handleBulkUserAction = async () => {
    setIsProcessing(true);
    try {
      const ids = userIds.split("\n").map((id) => id.trim()).filter(Boolean);
      
      if (bulkAction === "activate") {
        await supabase.from("profiles").update({ isActive: true }).in("id", ids);
        toast({ title: "Success", description: `Activated ${ids.length} users` });
      } else if (bulkAction === "deactivate") {
        await supabase.from("profiles").update({ isActive: false }).in("id", ids);
        toast({ title: "Success", description: `Deactivated ${ids.length} users` });
      } else if (bulkAction === "makePro") {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        await supabase.from("profiles").update({ isPro: true, proExpiresAt: expiryDate.toISOString() }).in("id", ids);
        toast({ title: "Success", description: `Made ${ids.length} users Pro` });
      } else if (bulkAction === "removePro") {
        await supabase.from("profiles").update({ isPro: false, proExpiresAt: null }).in("id", ids);
        toast({ title: "Success", description: `Removed Pro from ${ids.length} users` });
      } else if (bulkAction === "delete") {
        await supabase.from("profiles").delete().in("id", ids);
        toast({ title: "Success", description: `Deleted ${ids.length} users` });
      }
      
      setUserIds("");
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to process bulk action", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkPropertyAction = async () => {
    setIsProcessing(true);
    try {
      const ids = propertyIds.split("\n").map((id) => id.trim()).filter(Boolean);
      
      if (bulkAction === "feature") {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        await supabase.from("properties").update({ featured: true, featuredExpiresAt: expiryDate.toISOString() }).in("id", ids);
        toast({ title: "Success", description: `Featured ${ids.length} properties` });
      } else if (bulkAction === "unfeature") {
        await supabase.from("properties").update({ featured: false, featuredExpiresAt: null }).in("id", ids);
        toast({ title: "Success", description: `Unfeatured ${ids.length} properties` });
      } else if (bulkAction === "approve") {
        await supabase.from("properties").update({ status: "For Rent" }).in("id", ids);
        toast({ title: "Success", description: `Approved ${ids.length} properties` });
      } else if (bulkAction === "delete") {
        await supabase.from("properties").delete().in("id", ids);
        toast({ title: "Success", description: `Deleted ${ids.length} properties` });
      }
      
      setPropertyIds("");
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to process bulk action", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkEmail = async () => {
    setIsProcessing(true);
    try {
      const ids = userIds.split("\n").map((id) => id.trim()).filter(Boolean);
      const { data: users } = await supabase.from("profiles").select("email").in("id", ids);
      
      // In production, integrate with email service
      console.log("Sending emails to:", users?.map(u => u.email));
      
      toast({ 
        title: "Emails Queued", 
        description: `${users?.length || 0} emails queued for sending` 
      });
      
      setEmailSubject("");
      setEmailBody("");
      setUserIds("");
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to send emails", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bulk Actions</h1>
        <p className="text-muted-foreground">Perform actions on multiple items at once</p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="text-xs sm:text-sm">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Users</span>
            <span className="sm:hidden">Users</span>
          </TabsTrigger>
          <TabsTrigger value="properties" className="text-xs sm:text-sm">
            <Building className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Properties</span>
            <span className="sm:hidden">Props</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="text-xs sm:text-sm">
            <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span>Email</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk User Actions</CardTitle>
              <CardDescription>Perform actions on multiple users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>User IDs (one per line)</Label>
                <Textarea
                  placeholder="Enter user IDs, one per line"
                  value={userIds}
                  onChange={(e) => setUserIds(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label>Action</Label>
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activate">Activate Users</SelectItem>
                    <SelectItem value="deactivate">Deactivate Users</SelectItem>
                    <SelectItem value="makePro">Make Pro</SelectItem>
                    <SelectItem value="removePro">Remove Pro</SelectItem>
                    <SelectItem value="delete">Delete Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleBulkUserAction} disabled={isProcessing || !bulkAction || !userIds} className="w-full sm:w-auto">
                <Zap className="h-4 w-4 mr-2" />
                {isProcessing ? "Processing..." : "Execute Action"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Property Actions</CardTitle>
              <CardDescription>Perform actions on multiple properties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Property IDs (one per line)</Label>
                <Textarea
                  placeholder="Enter property IDs, one per line"
                  value={propertyIds}
                  onChange={(e) => setPropertyIds(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label>Action</Label>
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feature">Feature Properties</SelectItem>
                    <SelectItem value="unfeature">Unfeature Properties</SelectItem>
                    <SelectItem value="approve">Approve Properties</SelectItem>
                    <SelectItem value="delete">Delete Properties</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleBulkPropertyAction} disabled={isProcessing || !bulkAction || !propertyIds} className="w-full sm:w-auto">
                <Zap className="h-4 w-4 mr-2" />
                {isProcessing ? "Processing..." : "Execute Action"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Email</CardTitle>
              <CardDescription>Send emails to multiple users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>User IDs (one per line)</Label>
                <Textarea
                  placeholder="Enter user IDs, one per line"
                  value={userIds}
                  onChange={(e) => setUserIds(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Subject</Label>
                <Textarea
                  placeholder="Email subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  rows={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  placeholder="Email body"
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={8}
                />
              </div>

              <Button onClick={handleBulkEmail} disabled={isProcessing || !userIds || !emailSubject || !emailBody} className="w-full sm:w-auto">
                <Mail className="h-4 w-4 mr-2" />
                {isProcessing ? "Sending..." : "Send Emails"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
