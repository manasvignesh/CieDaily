import { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { type FriendRequest } from "@/lib/types";

export default function FriendsScreen() {
  const router = useRouter();
  const { users, currentUser, friendRequests, acceptFriendRequest, rejectFriendRequest } = useStore();
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<"requests" | "all">("requests");

  const pendingRequests = friendRequests.filter((fr) => fr.status === "pending" && fr.toUser.id === currentUser?.id);

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
        <Text style={{ fontWeight: "600", fontSize: 16, color: colors.foreground }}>Friends</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
        <Pressable
          onPress={() => setActiveTab("requests")}
          style={({ pressed }) => ({
            flex: 1, paddingVertical: 10, alignItems: "center",
            borderBottomWidth: 2,
            borderBottomColor: activeTab === "requests" ? colors.primary : "transparent",
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Text style={{
            fontSize: 13, fontWeight: "600",
            color: activeTab === "requests" ? colors.primary : colors.muted,
          }}>Requests ({pendingRequests.length})</Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("all")}
          style={({ pressed }) => ({
            flex: 1, paddingVertical: 10, alignItems: "center",
            borderBottomWidth: 2,
            borderBottomColor: activeTab === "all" ? colors.primary : "transparent",
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Text style={{
            fontSize: 13, fontWeight: "600",
            color: activeTab === "all" ? colors.primary : colors.muted,
          }}>All Friends</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {activeTab === "requests" && (
          <>
            {pendingRequests.length > 0 ? (
              pendingRequests.map((request) => (
                <View key={request.id} style={{
                  backgroundColor: colors.surface, borderRadius: 14, padding: 14,
                  marginBottom: 10, borderWidth: 1, borderColor: colors.border,
                }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Pressable
                      onPress={() => router.push(`/profile/${request.fromUser.id}` as any)}
                      style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", flex: 1, opacity: pressed ? 0.6 : 1 })}
                    >
                      <View style={{
                        width: 44, height: 44, borderRadius: 22,
                        backgroundColor: colors.primary,
                        alignItems: "center", justifyContent: "center", marginRight: 10,
                      }}>
                        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>{request.fromUser.name.charAt(0)}</Text>
                      </View>
                      <View>
                        <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15 }}>{request.fromUser.name}</Text>
                        <Text style={{ color: colors.muted, fontSize: 13 }}>{request.fromUser.department}</Text>
                        <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>
                          {request.fromUser.techStack.slice(0, 3).join(" · ")}
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                  <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                    <Pressable
                      onPress={() => acceptFriendRequest(request.id)}
                      style={({ pressed }) => ({
                        flex: 1, paddingVertical: 8, borderRadius: 10,
                        backgroundColor: colors.primary, alignItems: "center",
                        opacity: pressed ? 0.8 : 1,
                      })}
                    >
                      <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>Accept</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => rejectFriendRequest(request.id)}
                      style={({ pressed }) => ({
                        flex: 1, paddingVertical: 8, borderRadius: 10,
                        backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
                        alignItems: "center",
                        opacity: pressed ? 0.8 : 1,
                      })}
                    >
                      <Text style={{ color: colors.error, fontWeight: "600", fontSize: 13 }}>Decline</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            ) : (
              <View style={{ alignItems: "center", paddingVertical: 40 }}>
                <IconSymbol name="person.2.fill" size={48} color={colors.muted} />
                <Text style={{ color: colors.muted, fontSize: 16, marginTop: 12 }}>No pending requests</Text>
              </View>
            )}
          </>
        )}

        {activeTab === "all" && (
          <>
            {users
              .filter((u) => u.id !== currentUser?.id)
              .map((user) => (
                <Pressable
                  key={user.id}
                  onPress={() => router.push(`/profile/${user.id}` as any)}
                  style={({ pressed }) => ({
                    backgroundColor: colors.surface, borderRadius: 14, padding: 14,
                    marginBottom: 8, borderWidth: 1, borderColor: colors.border,
                    flexDirection: "row", alignItems: "center",
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <View style={{
                    width: 44, height: 44, borderRadius: 22,
                    backgroundColor: colors.primary,
                    alignItems: "center", justifyContent: "center", marginRight: 10,
                  }}>
                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>{user.name.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15 }}>{user.name}</Text>
                    <Text style={{ color: colors.muted, fontSize: 13 }}>{user.department} · Year {user.year}</Text>
                    <View style={{ flexDirection: "row", gap: 4, marginTop: 4 }}>
                      {user.techStack.slice(0, 3).map((tech) => (
                        <View key={tech} style={{
                          paddingHorizontal: 6, paddingVertical: 2,
                          borderRadius: 8, backgroundColor: colors.primary + "15",
                        }}>
                          <Text style={{ color: colors.primary, fontSize: 10, fontWeight: "500" }}>{tech}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{
                      width: 8, height: 8, borderRadius: 4,
                      backgroundColor: user.isOnline ? colors.success : colors.muted,
                    }} />
                    <Text style={{ color: colors.muted, fontSize: 11, marginLeft: 4 }}>
                      {user.isOnline ? "Online" : "Offline"}
                    </Text>
                  </View>
                </Pressable>
              ))}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
