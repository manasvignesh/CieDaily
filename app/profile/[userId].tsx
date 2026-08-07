import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ProfileDetailScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { users, currentUser, sendFriendRequest, posts } = useStore();
  const colors = useColors();

  const user = users.find((u) => u.id === userId);
  const userPosts = user ? posts.filter((p) => p.authorId === userId && !p.isDeleted) : [];
  const isOwnProfile = currentUser?.id === userId;

  if (!user) {
    return (
      <ScreenContainer edges={["top", "left", "right", "bottom"]}>
        <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
          <Text style={{ color: colors.muted, fontSize: 16 }}>User not found</Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ color: colors.primary, fontSize: 14 }}>Go Back</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

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
        <Text style={{ fontWeight: "600", fontSize: 16, color: colors.foreground }}>Profile</Text>
        {!isOwnProfile && (
          <Pressable onPress={() => {}} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
            <IconSymbol name={"ellipsis" as any} size={24} color={colors.foreground} />
          </Pressable>
        )}
        {isOwnProfile && <View style={{ width: 24 }} />}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Header */}
        <View style={{ alignItems: "center", paddingVertical: 24 }}>
          <View style={{
            width: 80, height: 80, borderRadius: 40,
            backgroundColor: colors.primary,
            alignItems: "center", justifyContent: "center",
          }}>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 32 }}>{user.name.charAt(0)}</Text>
          </View>
          <Text style={{ fontWeight: "bold", fontSize: 22, color: colors.foreground, marginTop: 12 }}>{user.name}</Text>
          <Text style={{ color: colors.muted, fontSize: 14, marginTop: 2 }}>@{user.username}</Text>
          {user.bio ? (
            <Text style={{ color: colors.foreground, fontSize: 14, marginTop: 10, textAlign: "center", lineHeight: 20, paddingHorizontal: 24 }}>
              {user.bio}
            </Text>
          ) : null}
        </View>

        {/* Stats */}
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 32, marginBottom: 16 }}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: colors.foreground }}>{userPosts.length}</Text>
            <Text style={{ color: colors.muted, fontSize: 12 }}>Posts</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: colors.foreground }}>{user.learningStreak}</Text>
            <Text style={{ color: colors.muted, fontSize: 12 }}>Streak</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: colors.foreground }}>{user.achievements.length}</Text>
            <Text style={{ color: colors.muted, fontSize: 12 }}>Awards</Text>
          </View>
        </View>

        {/* Action Buttons */}
        {!isOwnProfile && (
          <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 24, marginBottom: 16 }}>
            <Pressable
              onPress={() => sendFriendRequest(user.id)}
              style={({ pressed }) => ({
                flex: 1, paddingVertical: 10, borderRadius: 10,
                backgroundColor: colors.primary, alignItems: "center",
                opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>Add Friend</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                // Find or create a conversation with this user
                router.push(`/chat/c1` as any);
              }}
              style={({ pressed }) => ({
                flex: 1, paddingVertical: 10, borderRadius: 10,
                backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center",
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{ color: colors.foreground, fontWeight: "600", fontSize: 14 }}>Message</Text>
            </Pressable>
          </View>
        )}

        {/* Info Section */}
        <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
          <View style={{
            backgroundColor: colors.surface, borderRadius: 12, padding: 16,
            borderWidth: 1, borderColor: colors.border,
          }}>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <Text style={{ color: colors.muted, fontSize: 13, width: 80 }}>Department</Text>
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "500" }}>{user.department || "Not set"}</Text>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <Text style={{ color: colors.muted, fontSize: 13, width: 80 }}>Year</Text>
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "500" }}>{user.year ? `Year ${user.year}` : "Not set"}</Text>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <Text style={{ color: colors.muted, fontSize: 13, width: 80 }}>College</Text>
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "500" }}>{user.collegeDomain}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: colors.muted, fontSize: 13, width: 80 }}>Online</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{
                  width: 8, height: 8, borderRadius: 4,
                  backgroundColor: user.isOnline ? colors.success : colors.muted,
                  marginRight: 6,
                }} />
                <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "500" }}>
                  {user.isOnline ? "Online" : "Offline"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tech Stack */}
        {user.techStack.length > 0 && (
          <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
            <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15, marginBottom: 8 }}>Tech Stack</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {user.techStack.map((tech) => (
                <View key={tech} style={{
                  paddingHorizontal: 10, paddingVertical: 4,
                  borderRadius: 12, backgroundColor: colors.primary + "15",
                }}>
                  <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "500" }}>{tech}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Interests */}
        {user.interests.length > 0 && (
          <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
            <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15, marginBottom: 8 }}>Interests</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {user.interests.map((interest) => (
                <View key={interest} style={{
                  paddingHorizontal: 10, paddingVertical: 4,
                  borderRadius: 12, backgroundColor: colors.accent + "15",
                }}>
                  <Text style={{ color: colors.accent, fontSize: 12, fontWeight: "500" }}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Achievements */}
        {user.achievements.length > 0 && (
          <View style={{ paddingHorizontal: 24 }}>
            <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15, marginBottom: 8 }}>Achievements</Text>
            {user.achievements.map((achievement) => (
              <View key={achievement.id} style={{
                backgroundColor: colors.surface, borderRadius: 12, padding: 14,
                borderWidth: 1, borderColor: colors.border, marginBottom: 8,
                flexDirection: "row", alignItems: "center",
              }}>
                <View style={{
                  width: 40, height: 40, borderRadius: 20,
                  backgroundColor: colors.primary + "20",
                  alignItems: "center", justifyContent: "center", marginRight: 12,
                }}>
                  <IconSymbol name="rosette" size={22} color={colors.primary} />
                </View>
                <View>
                  <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 14 }}>{achievement.title}</Text>
                  <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{achievement.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
