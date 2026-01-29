import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { getNotificationConfig, subscribeToNotifications } from '@/lib/api';
import { toast } from 'sonner';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationToggle() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setSupported(true);
      checkSubscription();
    }
  }, []);

  async function checkSubscription() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    setIsSubscribed(!!subscription);
  }

  async function handleSubscribe() {
    setLoading(true);
    try {
      const { publicKey } = await getNotificationConfig();
      if (!publicKey) throw new Error("No public key found");

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      await subscribeToNotifications(subscription);
      setIsSubscribed(true);
      toast.success("Notifications enabled!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to enable notifications. " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (!supported) return null;

  if (isSubscribed) {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2">
        <Bell className="h-4 w-4 text-green-500" />
        Enabled
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleSubscribe} 
      disabled={loading}
      className="gap-2"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BellOff className="h-4 w-4" />}
      Enable Notifications
    </Button>
  );
}
