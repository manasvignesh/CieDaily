import { View, Text, FlatList, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { Notification } from "@/lib/types";

const NOTIFICATION_ICONS: Record<string, string> = {
  new_post: "doc.fill",
  hackathon_reminder: "trophy.fill",
  workshop_reminder: "book.fill",
  comment_reply: "text.bubble.fill",
  mention: "at",
  project_request: "briefcase.fill",
  new_resource: "book.fill",
  event_starting: "calendar",
  post_like: "heart.fill",
  friend_request: "person.badge.plus",
  new_message: "message.fill",
  system_announcement: "bell.fill",
};

const NOTIFICATION_COLORS: Record<string, string> = {
  new_post: "#3B82F6",
  hackathon_reminder: "#8B5CF6",
  workshop_reminder: "#10B981",
  comment_reply: "#3B82F6",
  mention: "#6366F1",
  project_request: "#F59E0B",
  new_resource: "#10B981",
  event_starting: "#EF4444",
  post_like: "#EF4444",
  friend_request: "#3B82F6",
  new_message: "#10B981",
  system_announcement: "#F59E0B",
};

function NotificationItem({ notification }: { notification: Notification }) {
  const colors = useColors();
  const store = useStore();
  const iconColor = NOTIFICATION_COLORS[notification.type] || colors.primary;
  const iconName = NOTIFICATION_ICONS[notification.type] || "bell.fill";

  return (
    <Pressable
      onPress={() => store.markNotificationRead(notification.id)}
      style={({ pressed }) => ({
        flexDirection: "row", alignItems: "center",
        paddingVertical: 14, paddingHorizontal: 16,
        backgroundColor: notification.isRead ? colors.background : colors.surface,
        borderBottomWidth: 0.5, borderBottomColor: colors.border,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View style={{
        width: 42, height: 42, borderRadius: 21,
        backgroundColor: iconColor + "20",
        alignItems: "center", justifyContent: "center", marginRight: 12,
      }}>
        <IconSymbol name={iconName as any} size={22} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: notification.isRead ? "400" : "600", color: colors.foreground, fontSize: 14 }}>
          {notification.title}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>
          {new Date(notification.createdAt).toLocaleDateString()}
        </Text>
      </View>
      {!notification.isRead && (
        <View style={{
          width: 10, height: 10, borderRadius: 5,
          backgroundColor: colors.primary,
        }} />
      )}
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, clearNotifications, markNotificationRead } = useStore();
  const colors = useColors();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    notifications.filter((n) => !n.isRead).forEach((n) => markNotificationRead(n.id));
  };

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]}>
      {/* Header */}
      <View style={{
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 16, paddingVertical: 10,
        borderBottomWidth: 0.5, borderBottomColor: colors.border,
      }}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
          <IconSymbol name="chevron.left" size={24} color={colors.primary} />
        </Pressable>
        <Text style={{ fontWeight: "600", fontSize: 16, color: colors.foreground }}>
          Notifications{unreadCount > 0 ? ` (${unreadCount})` : ""}
        </Text>
        <Pressable
          onPress={clearNotifications}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Text style={{ color: colors.primary, fontSize: 14, fontWeight: "500" }}>Clear</Text>
        </Pressable>
      </View>

      {unreadCount > 0 && (
        <Pressable
          onPress={markAllAsRead}
          style={{
            paddingHorizontal: 16, paddingVertical: 8,
            backgroundColor: colors.primary + "10",
            flexDirection: "row", alignItems: "center", justifyContent: "center",
          }}
        >
          <Text style={{ color: colors.primary, fontSize: 13, fontWeight: "500" }}>
            Mark all as read
          </Text>
        </Pressable>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 60 }}>
            <IconSymbol name="bell.fill" size={48} color={colors.muted} />
            <Text style={{ color: colors.muted, fontSize: 16, marginTop: 12 }}>No notifications</Text>
            <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>You&apos;re all caught up!</Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}
