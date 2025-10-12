"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, MapPin, Calendar } from "lucide-react";

export function MarketAnalytics() {
  const marketData = {
    averageRent: 85000,
    priceChange: 5.2,
    daysOnMarket: 18,
    occupancyRate: 94,
    topAreas: [
      { name: "Kilimani", avgPrice: 120000, change: 8.5 },
      { name: "Westlands", avgPrice: 95000, change: -2.1 },
      { name: "Kileleshwa", avgPrice: 110000, change: 12.3 },
      { name: "Lavington", avgPrice: 150000, change: 6.7 }
    ]
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Market Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              Ksh {marketData.averageRent.toLocaleString()}
            </div>
            <div className="text-sm text-blue-700">Avg Monthly Rent</div>
            <div className="flex items-center justify-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">+{marketData.priceChange}%</span>
            </div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{marketData.daysOnMarket}</div>
            <div className="text-sm text-green-700">Days on Market</div>
            <div className="text-xs text-muted-foreground mt-1">Average</div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{marketData.occupancyRate}%</div>
            <div className="text-sm text-purple-700">Occupancy Rate</div>
            <div className="text-xs text-muted-foreground mt-1">City-wide</div>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">2.3x</div>
            <div className="text-sm text-orange-700">Demand Ratio</div>
            <div className="text-xs text-muted-foreground mt-1">Inquiries/Listing</div>
          </div>
        </div>

        {/* Top Performing Areas */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Top Performing Areas
          </h4>
          <div className="space-y-3">
            {marketData.topAreas.map((area, index) => (
              <div key={area.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <div>
                    <div className="font-medium">{area.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Avg: Ksh {area.avgPrice.toLocaleString()}/month
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {area.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${area.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {area.change > 0 ? '+' : ''}{area.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Insights */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            This Month's Insights
          </h4>
          <ul className="space-y-2 text-sm text-indigo-700">
            <li>• Rental demand increased by 15% compared to last month</li>
            <li>• 2-bedroom apartments are the most sought-after (45% of searches)</li>
            <li>• Properties with parking rent 20% faster on average</li>
            <li>• Furnished properties command 25% premium in rent</li>
          </ul>
        </div>

        {/* Price Prediction */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Price Prediction (Next 3 Months)</h4>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gradient-to-r from-green-200 to-green-300 h-2 rounded-full">
              <div className="bg-green-600 h-2 rounded-full w-3/4"></div>
            </div>
            <div className="text-sm font-medium text-green-600">+3-7% Expected Growth</div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Based on historical data and current market trends
          </p>
        </div>
      </CardContent>
    </Card>
  );
}