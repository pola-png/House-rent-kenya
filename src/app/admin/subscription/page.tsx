
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, Package, Star, Zap } from "lucide-react";

const plans = [
    {
        name: "Basic",
        price: "Free",
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
                    <Button className="w-full" disabled={plan.isCurrent}>
                        {plan.cta}
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
