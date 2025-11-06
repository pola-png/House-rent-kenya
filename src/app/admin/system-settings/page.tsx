"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield, Zap, DollarSign, Bell, CheckCircle, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SystemSettings, getSystemSettings, saveSystemSettings } from "@/lib/system-settings";
import { useAuth } from "@/hooks/use-auth-supabase";
import { useRouter } from "next/navigation";

export default function SystemSettingsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<SystemSettings>(getSystemSettings());

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    setSettings(getSystemSettings());
  }, []);

  const handleSave = () => {
    saveSystemSettings(settings);
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully.",
    });
  };

  const updateFeature = (key: keyof SystemSettings["features"], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      features: { ...prev.features, [key]: value },
    }));
  };

  const updateProFeature = (key: keyof SystemSettings["proFeatures"], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      proFeatures: { ...prev.proFeatures, [key]: value },
    }));
  };

  const updateLimit = (key: keyof SystemSettings["limits"], value: number) => {
    setSettings((prev) => ({
      ...prev,
      limits: { ...prev.limits, [key]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground">Manage platform features and configurations</p>
      </div>

      <Tabs defaultValue="features" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-7">
          <TabsTrigger value="features" className="text-xs sm:text-sm">
            <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Features</span>
            <span className="sm:hidden">Feat</span>
          </TabsTrigger>
          <TabsTrigger value="pro" className="text-xs sm:text-sm">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Pro</span>
            <span className="sm:hidden">Pro</span>
          </TabsTrigger>
          <TabsTrigger value="limits" className="text-xs sm:text-sm">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Limits</span>
            <span className="sm:hidden">Lim</span>
          </TabsTrigger>
          <TabsTrigger value="pricing" className="text-xs sm:text-sm">
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Pricing</span>
            <span className="sm:hidden">$</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm">
            <Bell className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Notifications</span>
            <span className="sm:hidden">Notif</span>
          </TabsTrigger>
          <TabsTrigger value="moderation" className="text-xs sm:text-sm">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Moderation</span>
            <span className="sm:hidden">Mod</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="text-xs sm:text-sm">
            <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Payments</span>
            <span className="sm:hidden">Pay</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Features</CardTitle>
              <CardDescription>Enable or disable core platform features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Property Listing</Label>
                  <p className="text-sm text-muted-foreground">Allow users to create property listings</p>
                </div>
                <Switch
                  checked={settings.features.enablePropertyListing}
                  onCheckedChange={(v) => updateFeature("enablePropertyListing", v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Callback Requests</Label>
                  <p className="text-sm text-muted-foreground">Enable callback request functionality</p>
                </div>
                <Switch
                  checked={settings.features.enableCallbackRequests}
                  onCheckedChange={(v) => updateFeature("enableCallbackRequests", v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Messaging System</Label>
                  <p className="text-sm text-muted-foreground">Enable direct messaging between users</p>
                </div>
                <Switch
                  checked={settings.features.enableMessaging}
                  onCheckedChange={(v) => updateFeature("enableMessaging", v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Advanced Search</Label>
                  <p className="text-sm text-muted-foreground">Enable advanced search filters</p>
                </div>
                <Switch
                  checked={settings.features.enableAdvancedSearch}
                  onCheckedChange={(v) => updateFeature("enableAdvancedSearch", v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Property Comparison</Label>
                  <p className="text-sm text-muted-foreground">Allow users to compare properties</p>
                </div>
                <Switch
                  checked={settings.features.enablePropertyComparison}
                  onCheckedChange={(v) => updateFeature("enablePropertyComparison", v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Market Analytics</Label>
                  <p className="text-sm text-muted-foreground">Display market trends and analytics</p>
                </div>
                <Switch
                  checked={settings.features.enableMarketAnalytics}
                  onCheckedChange={(v) => updateFeature("enableMarketAnalytics", v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>AI Recommendations</Label>
                  <p className="text-sm text-muted-foreground">Enable AI-powered property recommendations</p>
                </div>
                <Switch
                  checked={settings.features.enableAIRecommendations}
                  onCheckedChange={(v) => updateFeature("enableAIRecommendations", v)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment & Promotions</CardTitle>
              <CardDescription>Configure M-Pesa and promotion details shown in the listing form</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Promotions</Label>
                  <p className="text-sm text-muted-foreground">Allow agents to promote a listing via payment</p>
                </div>
                <Switch
                  checked={settings.payment.enablePromotion}
                  onCheckedChange={(v) => setSettings(prev => ({ ...prev, payment: { ...prev.payment, enablePromotion: v } }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Currency</Label>
                  <Input value={settings.payment.currency}
                         onChange={(e) => setSettings(prev => ({ ...prev, payment: { ...prev.payment, currency: e.target.value } }))}
                         placeholder="KES" />
                </div>
                <div>
                  <Label>Weekly Promotion Rate</Label>
                  <Input type="number" value={settings.payment.weeklyPromoRate}
                         onChange={(e) => setSettings(prev => ({ ...prev, payment: { ...prev.payment, weeklyPromoRate: Number(e.target.value || 0) } }))}
                         placeholder="5" />
                </div>
                <div>
                  <Label>M-Pesa Number</Label>
                  <Input value={settings.payment.mpesaNumber}
                         onChange={(e) => setSettings(prev => ({ ...prev, payment: { ...prev.payment, mpesaNumber: e.target.value } }))}
                         placeholder="+2547..." />
                </div>
                <div>
                  <Label>Account/Name</Label>
                  <Input value={settings.payment.accountName}
                         onChange={(e) => setSettings(prev => ({ ...prev, payment: { ...prev.payment, accountName: e.target.value } }))}
                         placeholder="House Rent Kenya" />
                </div>
                <div>
                  <Label>Paybill (optional)</Label>
                  <Input value={settings.payment.paybill || ''}
                         onChange={(e) => setSettings(prev => ({ ...prev, payment: { ...prev.payment, paybill: e.target.value || undefined } }))}
                         placeholder="Paybill" />
                </div>
                <div>
                  <Label>Bank Name (optional)</Label>
                  <Input value={settings.payment.bankName || ''}
                         onChange={(e) => setSettings(prev => ({ ...prev, payment: { ...prev.payment, bankName: e.target.value || undefined } }))}
                         placeholder="Bank" />
                </div>
                <div>
                  <Label>Bank Account (optional)</Label>
                  <Input value={settings.payment.bankAccount || ''}
                         onChange={(e) => setSettings(prev => ({ ...prev, payment: { ...prev.payment, bankAccount: e.target.value || undefined } }))}
                         placeholder="Account" />
                </div>
                <div className="sm:col-span-2">
                  <Label>Instructions</Label>
                  <Input value={settings.payment.instructions || ''}
                         onChange={(e) => setSettings(prev => ({ ...prev, payment: { ...prev.payment, instructions: e.target.value || undefined } }))}
                         placeholder="Send payment and attach screenshot to activate promotion." />
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleSave}>Save</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pro" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pro Features</CardTitle>
              <CardDescription>Configure premium features for Pro users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Featured Listings</Label>
                  <p className="text-sm text-muted-foreground">Allow Pro users to feature their listings</p>
                </div>
                <Switch
                  checked={settings.proFeatures.featuredListings}
                  onCheckedChange={(v) => updateProFeature("featuredListings", v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Priority Support</Label>
                  <p className="text-sm text-muted-foreground">Provide priority support to Pro users</p>
                </div>
                <Switch
                  checked={settings.proFeatures.prioritySupport}
                  onCheckedChange={(v) => updateProFeature("prioritySupport", v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Advanced Analytics</Label>
                  <p className="text-sm text-muted-foreground">Access to detailed analytics and insights</p>
                </div>
                <Switch
                  checked={settings.proFeatures.advancedAnalytics}
                  onCheckedChange={(v) => updateProFeature("advancedAnalytics", v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Unlimited Listings</Label>
                  <p className="text-sm text-muted-foreground">Remove listing limits for Pro users</p>
                </div>
                <Switch
                  checked={settings.proFeatures.unlimitedListings}
                  onCheckedChange={(v) => updateProFeature("unlimitedListings", v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Custom Branding</Label>
                  <p className="text-sm text-muted-foreground">Allow custom branding for agencies</p>
                </div>
                <Switch
                  checked={settings.proFeatures.customBranding}
                  onCheckedChange={(v) => updateProFeature("customBranding", v)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Limits</CardTitle>
              <CardDescription>Configure usage limits and restrictions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Free User Listings Limit</Label>
                <Input
                  type="number"
                  value={settings.limits.freeListingsLimit}
                  onChange={(e) => updateLimit("freeListingsLimit", parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">Maximum listings for free users</p>
              </div>

              <div className="space-y-2">
                <Label>Pro User Listings Limit</Label>
                <Input
                  type="number"
                  value={settings.limits.proListingsLimit}
                  onChange={(e) => updateLimit("proListingsLimit", parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">Maximum listings for Pro users (999 = unlimited)</p>
              </div>

              <div className="space-y-2">
                <Label>Featured Listing Duration (days)</Label>
                <Input
                  type="number"
                  value={settings.limits.featuredDuration}
                  onChange={(e) => updateLimit("featuredDuration", parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">How long featured listings remain active</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Configuration</CardTitle>
              <CardDescription>Set subscription and feature pricing (in KSh)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Pro Monthly Subscription</Label>
                <Input
                  type="number"
                  value={settings.pricing.proMonthly}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    pricing: { ...prev.pricing, proMonthly: parseInt(e.target.value) }
                  }))}
                />
                <p className="text-sm text-muted-foreground">Monthly Pro subscription price</p>
              </div>

              <div className="space-y-2">
                <Label>Pro Yearly Subscription</Label>
                <Input
                  type="number"
                  value={settings.pricing.proYearly}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    pricing: { ...prev.pricing, proYearly: parseInt(e.target.value) }
                  }))}
                />
                <p className="text-sm text-muted-foreground">Yearly Pro subscription price</p>
              </div>

              <div className="space-y-2">
                <Label>Featured Listing Price</Label>
                <Input
                  type="number"
                  value={settings.pricing.featuredListingPrice}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    pricing: { ...prev.pricing, featuredListingPrice: parseInt(e.target.value) }
                  }))}
                />
                <p className="text-sm text-muted-foreground">One-time featured listing promotion price</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure notification channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send notifications via email</p>
                </div>
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(v) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, emailNotifications: v }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                </div>
                <Switch
                  checked={settings.notifications.smsNotifications}
                  onCheckedChange={(v) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, smsNotifications: v }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send browser push notifications</p>
                </div>
                <Switch
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(v) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, pushNotifications: v }
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Moderation</CardTitle>
              <CardDescription>Configure content approval and verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Approve Listings</Label>
                  <p className="text-sm text-muted-foreground">Automatically approve new property listings</p>
                </div>
                <Switch
                  checked={settings.moderation.autoApproveListings}
                  onCheckedChange={(v) => setSettings(prev => ({
                    ...prev,
                    moderation: { ...prev.moderation, autoApproveListings: v }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">Users must verify email before posting</p>
                </div>
                <Switch
                  checked={settings.moderation.requireEmailVerification}
                  onCheckedChange={(v) => setSettings(prev => ({
                    ...prev,
                    moderation: { ...prev.moderation, requireEmailVerification: v }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Phone Verification</Label>
                  <p className="text-sm text-muted-foreground">Users must verify phone before posting</p>
                </div>
                <Switch
                  checked={settings.moderation.requirePhoneVerification}
                  onCheckedChange={(v) => setSettings(prev => ({
                    ...prev,
                    moderation: { ...prev.moderation, requirePhoneVerification: v }
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="w-full sm:w-auto">
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
