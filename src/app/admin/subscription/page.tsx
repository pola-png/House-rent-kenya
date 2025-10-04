
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, Package, Star, Zap, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useToast } from "@/hooks/use-toast";


const plans = [
    {
        name: "Basic",
        price: "Free",
        amount: 0,
        period: "",
        description: "For agents just getting started.",
        features: [
            "Up to 5 active listings",
            "Basic support",
            "Standard placement in search results",
        ],
        cta: "Current Plan",
        isCurrent: true,
    },
    {
        name: "Pro",
        price: "Ksh 5,000",
        amount: 5000,
        period: "/month",
        description: "For professionals who want to stand out.",
        features: [
            "Up to 50 active listings",
            "Priority support",
            "Promote listings with 'Pro' badge",
            "Higher placement in search results",
        ],
        cta: "Upgrade to Pro",
        isCurrent: false,
    },
    {
        name: "VIP",
        price: "Ksh 15,000",
        amount: 15000,
        period: "/month",
        description: "For top-tier agencies needing maximum visibility.",
        features: [
            "Unlimited active listings",
            "Dedicated account manager",
            "Promote listings with 'VIP' badge",
            "Top placement on homepage & search",
            "Advanced performance analytics",
        ],
        cta: "Upgrade to VIP",
        isCurrent: false,
    }
];


export default function SubscriptionPage() {
    const { toast } = useToast();
    const [isConfirming, setIsConfirming] = React.useState(false);

    const handleConfirmPayment = () => {
        setIsConfirming(true);
        // Simulate API call to verify payment
        setTimeout(() => {
            setIsConfirming(false);
            toast({
                title: "Payment Received!",
                description: "Your payment is being verified. Your plan will be upgraded shortly.",
            });
            // Here you would close the dialog, which can be handled by controlling the `open` state of the Dialog.
            // For now, we'll just show the toast.
        }, 3000);
    }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Subscription Plans</h1>
        <p className="text-muted-foreground mt-2">Choose the plan that's right for your business.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
            <Card key={plan.name} className={`flex flex-col ${plan.name === 'Pro' ? 'border-primary shadow-lg' : ''}`}>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                        {plan.name === 'Pro' && <Star className="h-6 w-6 text-primary" />}
                        {plan.name === 'VIP' && <Zap className="h-6 w-6 text-yellow-500" />}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-6">
                    <div className="text-4xl font-bold">
                        {plan.price}
                        {plan.period && <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>}
                    </div>
                    <ul className="space-y-3">
                        {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center">
                                <Check className="h-4 w-4 mr-2 text-green-600" />
                                <span className="text-muted-foreground">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    {plan.isCurrent ? (
                         <Button className="w-full" disabled={plan.isCurrent}>
                            {plan.cta}
                        </Button>
                    ) : (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full">{plan.cta}</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                <DialogTitle>Complete Payment via M-Pesa</DialogTitle>
                                <DialogDescription>
                                    Follow the instructions below to upgrade to the <span className="font-bold text-primary">{plan.name}</span> plan.
                                </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <p className="text-sm text-center bg-muted p-4 rounded-md">
                                        Go to M-Pesa on your phone and select Lipa na M-Pesa.
                                    </p>
                                    <div className="space-y-2">
                                        <Label>Business Number:</Label>
                                        <Input readOnly value="123456" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Account Number:</Label>
                                        <Input readOnly value="AGENT123" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Amount:</Label>
                                        <Input readOnly value={plan.price} />
                                    </div>
                                    <Separator />
                                     <div className="space-y-2">
                                        <Label htmlFor="mpesa-code">M-Pesa Confirmation Code</Label>
                                        <Input id="mpesa-code" placeholder="e.g., RG83..."/>
                                        <p className="text-xs text-muted-foreground">Enter the code you receive from M-Pesa after payment.</p>
                                    </div>
                                </div>
                                <DialogFooter>
                                <Button type="button" onClick={handleConfirmPayment} disabled={isConfirming}>
                                    {isConfirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Confirm Payment
                                </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
