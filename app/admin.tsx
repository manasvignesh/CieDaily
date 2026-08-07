import { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

type AdminTab = "reports" | "users" | "events" | "spaces" | "analytics";

export default function AdminScreen() {
  const router = useRouter();
  const { users, posts, events, spaces } = useStore();
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<AdminTab>("reports");

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: "reports", label: "Reports", icon: "flag.fill" },
    { id: "users", label: "Users", icon: "person.2.fill" },
    { id: "events", label: "Events", icon: "calendar" },
    { id: "spaces", label: "Spaces", icon: "person.2.fill" },
    { id: "analytics", label: "Analytics", icon: "chart.bar.fill" },
  ];

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
        <Text style={{ fontWeight: "600", fontSize: 16, color: colors.foreground }}>Admin Panel</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: "row", paddingHorizontal: 12 }}>
          {tabs.map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={({ pressed }) => ({
                flexDirection: "row", alignItems: "center", gap: 6,
                paddingHorizontal: 14, paddingVertical: 10,
                borderBottomWidth: 2,
                borderBottomColor: activeTab === tab.id ? colors.primary : "transparent",
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <IconSymbol name={tab.icon as any} size={16} color={activeTab === tab.id ? colors.primary : colors.muted} />
              <Text style={{
                fontSize: 13, fontWeight: "600",
                color: activeTab === tab.id ? colors.primary : colors.muted,
              }}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Tab Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {activeTab === "reports" && (
          <View>
            <Text style={{ color: colors.muted, fontSize: 14, marginBottom: 16 }}>
              No reports pending. All content is clean!
            </Text>
            <View style={{
              backgroundColor: colors.surface, borderRadius: 12, padding: 20,
              borderWidth: 1, borderColor: colors.border, alignItems: "center",
            }}>
              <IconSymbol name="checkmark.circle.fill" size={48} color={colors.success} />
              <Text style={{ color: colors.foreground, fontWeight: "600", fontSize: 16, marginTop: 12 }}>All Clear</Text>
              <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>No reported content at this time</Text>
            </View>
          </View>
        )}

        {activeTab === "users" && (
          <View>
            <Text style={{ color: colors.muted, fontSize: 14, marginBottom: 12 }}>
              {users.length} registered users
            </Text>
            {users.map((user) => (
              <View key={user.id} style={{
                backgroundColor: colors.surface, borderRadius: 12, padding: 14,
                borderWidth: 1, borderColor: colors.border, marginBottom: 8,
                flexDirection: "row", alignItems: "center", justifyContent: "space-between",
              }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{
                    width: 36, height: 36, borderRadius: 18,
                    backgroundColor: colors.primary,
                    alignItems: "center", justifyContent: "center", marginRight: 10,
                  }}>
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>{user.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 14 }}>{user.name}</Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>{user.email}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <View style={{
                    width: 8, height: 8, borderRadius: 4,
                    backgroundColor: user.isOnline ? colors.success : colors.muted,
                  }} />
                  <Text style={{ color: colors.muted, fontSize: 12 }}>{user.isOnline ? "Online" : "Offline"}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "events" && (
          <View>
            <Text style={{ color: colors.muted, fontSize: 14, marginBottom: 12 }}>
              {events.length} upcoming events
            </Text>
            {events.map((event) => (
              <View key={event.id} style={{
                backgroundColor: colors.surface, borderRadius: 12, padding: 14,
                borderWidth: 1, borderColor: colors.border, marginBottom: 8,
              }}>
                <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 14 }}>{event.title}</Text>
                <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>{event.date} · {event.venue}</Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>
                  {event.registeredCount} / {event.availableSeats + event.registeredCount} registered
                </Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "spaces" && (
          <View>
            <Text style={{ color: colors.muted, fontSize: 14, marginBottom: 12 }}>
              {spaces.length} active spaces
            </Text>
            {spaces.map((space) => (
              <View key={space.id} style={{
                backgroundColor: colors.surface, borderRadius: 12, padding: 14,
                borderWidth: 1, borderColor: colors.border, marginBottom: 8,
                flexDirection: "row", alignItems: "center",
              }}>
                <Text style={{ fontSize: 24, marginRight: 12 }}>{space.logo}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 14 }}>{space.name}</Text>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>{space.memberCount} members · {space.category}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "analytics" && (
          <View>
            <Text style={{ color: colors.muted, fontSize: 14, marginBottom: 16 }}>Platform Overview</Text>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
              <View style={{
                flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 16,
                borderWidth: 1, borderColor: colors.border, alignItems: "center",
              }}>
                <Text style={{ fontWeight: "bold", fontSize: 24, color: colors.primary }}>{users.length}</Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>Users</Text>
              </View>
              <View style={{
                flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 16,
                borderWidth: 1, borderColor: colors.border, alignItems: "center",
              }}>
                <Text style={{ fontWeight: "bold", fontSize: 24, color: colors.primary }}>{posts.length}</Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>Posts</Text>
              </View>
              <View style={{
                flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 16,
                borderWidth: 1, borderColor: colors.border, alignItems: "center",
              }}>
                <Text style={{ fontWeight: "bold", fontSize: 24, color: colors.primary }}>{events.length}</Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>Events</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
              <View style={{
                flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 16,
                borderWidth: 1, borderColor: colors.border, alignItems: "center",
              }}>
                <Text style={{ fontWeight: "bold", fontSize: 24, color: colors.primary }}>{spaces.length}</Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>Spaces</Text>
              </View>
              <View style={{
                flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 16,
                borderWidth: 1, borderColor: colors.border, alignItems: "center",
              }}>
                <Text style={{ fontWeight: "bold", fontSize: 24, color: colors.primary }}>0</Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>Reports</Text>
              </View>
              <View style={{
                flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 16,
                borderWidth: 1, borderColor: colors.border, alignItems: "center",
              }}>
                <Text style={{ fontWeight: "bold", fontSize: 24, color: colors.primary }}>{users.filter((u) => u.isOnline).length}</Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>Online</Text>
              </View>
            </View>

            {/* Top Categories */}
            <Text style={{ color: colors.muted, fontSize: 14, marginBottom: 8 }}>Top Categories</Text>
            <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border }}>
              {[
                { name: "Web Dev", count: 2 },
                { name: "AI/ML", count: 1 },
                { name: "IoT", count: 1 },
                { name: "Flutter", count: 1 },
                { name: "Cyber Security", count: 1 },
                { name: "Hackathons", count: 1 },
              ].map((cat) => (
                <View key={cat.name} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 }}>
                  <Text style={{ color: colors.foreground, fontSize: 14 }}>{cat.name}</Text>
                  <Text style={{ color: colors.muted, fontSize: 14 }}>{cat.count} posts</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
