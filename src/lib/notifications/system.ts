// ── Enterprise System Notifications Engine ─────────────────────────────────────

export type NotificationType =
  | "PUBLISH_SUCCESS"
  | "PUBLISH_FAILURE"
  | "SCHEDULED_REMINDER"
  | "TOKEN_EXPIRY"
  | "AI_COMPLETED";

export interface SystemNotification {
  id: string;
  workspaceId: string;
  brandId?: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

const NOTIFICATIONS_STORE: SystemNotification[] = [
  {
    id: "notif_1",
    workspaceId: "ws_acme_enterprise",
    brandId: "b1",
    type: "PUBLISH_SUCCESS",
    title: "Post Published to YouTube",
    message: "'Building Enterprise AI Content OS Pipelines' was published successfully.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "notif_2",
    workspaceId: "ws_acme_enterprise",
    brandId: "b1",
    type: "AI_COMPLETED",
    title: "AI Metadata Package Generated",
    message: "Multi-channel metadata generated for 4 target platforms.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "notif_3",
    workspaceId: "ws_acme_enterprise",
    brandId: "b2",
    type: "TOKEN_EXPIRY",
    title: "Instagram Connection Token Notice",
    message: "Token for Aura Modern Living expires in 5 days. Click to refresh.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
];

export class NotificationEngine {
  /**
   * Emit new notification event
   */
  static notify(
    workspaceId: string,
    type: NotificationType,
    title: string,
    message: string,
    brandId?: string,
    metadata?: Record<string, any>
  ): SystemNotification {
    const notif: SystemNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      workspaceId,
      brandId,
      type,
      title,
      message,
      read: false,
      metadata,
      createdAt: new Date().toISOString(),
    };

    NOTIFICATIONS_STORE.unshift(notif);
    return notif;
  }

  /**
   * Fetch unread notifications for a workspace
   */
  static getNotifications(workspaceId: string = "ws_acme_enterprise"): SystemNotification[] {
    return NOTIFICATIONS_STORE.filter((n) => n.workspaceId === workspaceId);
  }

  /**
   * Mark notification as read
   */
  static markAsRead(id: string): void {
    const notif = NOTIFICATIONS_STORE.find((n) => n.id === id);
    if (notif) notif.read = true;
  }
}
