"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, Heart, TrendingDown, MapPin, Clock, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/use-auth-supabase";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

interface Notification {
  id: string;
  type: 'price_drop' | 'new_match' | 'saved_property' | 'market_update' | 'agent_response';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

export function SmartNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log('SmartNotifications: User detected, generating notifications for:', user.uid);
      generateRealNotifications();
    }
  }, [user]);

  // Force refresh every 60 seconds
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        console.log('SmartNotifications: Auto-refreshing notifications');
        generateRealNotifications();
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const generateRealNotifications = async () => {
    if (!user) return;

    try {
      console.log('Generating notifications for user:', user.uid);
      
      const { data: properties, error: propsError } = await supabase
        .from('properties')
        .select('*')
        .eq('landlordId', user.uid)
        .order('createdAt', { ascending: false });

      if (propsError) {
        console.error('Error fetching user properties:', propsError);
        throw propsError;
      }

      const { data: allProperties } = await supabase
        .from('properties')
        .select('location, price, createdAt')
        .order('createdAt', { ascending: false })
        .limit(10);

      console.log('User properties:', properties?.length || 0);
      const realNotifications: Notification[] = [];

      if (properties && properties.length > 0) {
        // High view property notification
        const highViewProperty = properties.find(p => (p.views || 0) > 5);
        if (highViewProperty) {
          realNotifications.push({
            id: '1',
            type: 'market_update',
            title: 'High Interest Property',
            message: `Your property "${highViewProperty.title}" has ${highViewProperty.views} views`,
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            read: false,
            priority: 'high'
          });
        }

        // New property in same area
        if (allProperties) {
          const userLocations = properties.map(p => p.location);
          const newInArea = allProperties.find(p => 
            userLocations.includes(p.location) && 
            p.createdAt > new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
          );
          
          if (newInArea) {
            realNotifications.push({
              id: '2',
              type: 'new_match',
              title: 'New Competition',
              message: `New property listed in ${newInArea.location} for Ksh ${newInArea.price.toLocaleString()}`,
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
              read: false,
              priority: 'medium'
            });
          }
        }

        // Low view property suggestion
        const lowViewProperty = properties.find(p => (p.views || 0) < 2);
        if (lowViewProperty) {
          realNotifications.push({
            id: '3',
            type: 'market_update',
            title: 'Optimization Suggestion',
            message: `Consider adding more photos to "${lowViewProperty.title}" to increase views`,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
            read: true,
            priority: 'low'
          });
        }
      }

      // Only add welcome notification for new users with no properties
      if (!properties || properties.length === 0) {
        realNotifications.push({
          id: '0',
          type: 'market_update',
          title: 'Welcome to House Rent Kenya!',
          message: 'Start by posting your first property to attract potential tenants',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          read: false,
          priority: 'high'
        });
      }

      console.log('Generated notifications:', realNotifications.length);
      setNotifications(realNotifications);
    } catch (error) {
      console.error('Error generating notifications:', error);
    }
  };

  const [showAll, setShowAll] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'price_drop': return TrendingDown;
      case 'new_match': return Star;
      case 'saved_property': return Heart;
      case 'market_update': return MapPin;
      case 'agent_response': return Bell;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-200';
      case 'medium': return 'bg-yellow-100 border-yellow-200';
      case 'low': return 'bg-blue-100 border-blue-200';
    }
  };

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Smart Notifications</span>
            <span className="sm:hidden">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1 sm:ml-2 text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowAll(!showAll)} className="text-xs sm:text-sm">
            {showAll ? 'Less' : 'All'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayedNotifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notifications yet</p>
            <p className="text-sm">We'll notify you about important updates</p>
          </div>
        ) : (
          displayedNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            return (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  notification.read ? 'bg-gray-50' : getPriorityColor(notification.priority)
                } ${!notification.read ? 'shadow-sm' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    notification.read ? 'bg-gray-200' : 'bg-white'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1 gap-2">
                      <h4 className={`font-medium text-xs sm:text-sm flex-1 ${
                        !notification.read ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 sm:h-6 sm:w-6 p-0"
                          onClick={() => removeNotification(notification.id)}
                        >
                          <X className="h-2 w-2 sm:h-3 sm:w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 pr-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-6"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                        {notification.actionUrl && (
                          <Button size="sm" className="text-xs h-6">
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {notifications.length > 3 && !showAll && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowAll(true)}
          >
            View {notifications.length - 3} more notifications
          </Button>
        )}

        {unreadCount > 0 && (
          <Button
            variant="ghost"
            className="w-full text-sm"
            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          >
            Mark all as read
          </Button>
        )}
      </CardContent>
    </Card>
  );
}