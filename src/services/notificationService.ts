// Browser Web Notification Service with explicit permission checks

export interface NotificationStatus {
  isSupported: boolean;
  permission: NotificationPermission | 'unsupported';
}

export function getNotificationStatus(): NotificationStatus {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { isSupported: false, permission: 'unsupported' };
  }
  return { isSupported: true, permission: Notification.permission };
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    throw new Error('Notifications are not supported in this browser environment.');
  }

  const permission = await Notification.requestPermission();
  return permission;
}

export function sendLocalAQIAlert(
  title: string,
  body: string,
  tag: string = 'hawasaathi-alert'
): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    new Notification(title, {
      body,
      icon: '/favicon.svg',
      tag,
      badge: '/favicon.svg',
    });
    return true;
  } catch (err) {
    console.error('Failed to trigger browser notification:', err);
    return false;
  }
}
