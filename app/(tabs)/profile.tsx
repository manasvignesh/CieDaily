import { useState } from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, posts, logout, updateProfile } = useStore();
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "achievements">("posts");

  const myPosts = posts.filter((p) => p.authorId === currentUser.id && !p.isDeleted);
  const savedPosts = posts.filter((p) => p.isSaved && !p.isDeleted);

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Cover Image */}
        <View style={{ height: 140, backgroundColor: colors.primary, position: "relative" }}>
          <View style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
            opacity: 0.9,
          }} />
        </View>

        {/* Profile Info */}
        <View style={{ paddingHorizontal: 20, marginTop: -40 }}>
          {/* Avatar */}
          <View style={{
            width: 80, height: 80, borderRadius: 40,
            backgroundColor: colors.foreground,
            alignItems: "center", justifyContent: "center",
            borderWidth: 3, borderColor: colors.background,
          }}>
            <Text style={{ color: colors.primary, fontWeight: "bold", fontSize: 32 }}>
              {currentUser.name.charAt(0)}
            </Text>
          </View>

          {/* Name and Bio */}
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", color: colors.foreground }}>{currentUser.name}</Text>
            <Text style={{ color: colors.muted, fontSize: 14, marginTop: 2 }}>@{currentUser.username}</Text>
            {currentUser.bio ? (
              <Text style={{ color: colors.foreground, fontSize: 14, marginTop: 8, lineHeight: 20 }}>{currentUser.bio}</Text>
            ) : (
              <Text style={{ color: colors.muted, fontSize: 14, marginTop: 8, fontStyle: "italic" }}>
                No bio yet. Tell the community about yourself!
              </Text>
            )}
          </View>

          {/* Stats */}
          <View style={{ flexDirection: "row", marginTop: 16, gap: 24 }}>
            <View>
              <Text style={{ fontWeight: "bold", fontSize: 18, color: colors.foreground }}>{myPosts.length}</Text>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Posts</Text>
            </View>
            <View>
              <Text style={{ fontWeight: "bold", fontSize: 18, color: colors.foreground }}>{currentUser.learningStreak}</Text>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Streak 🔥</Text>
            </View>
            <View>
              <Text style={{ fontWeight: "bold", fontSize: 18, color: colors.foreground }}>{currentUser.achievements.length}</Text>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Awards</Text>
            </View>
          </View>

          {/* Edit Profile Button */}
          <Pressable
            onPress={() => router.push("/settings" as any)}
            style={({ pressed }) => ({
              marginTop: 16, paddingVertical: 10, borderRadius: 10,
              backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text style={{ color: colors.primary, fontWeight: "600", fontSize: 14 }}>Edit Profile</Text>
          </Pressable>

          {/* Tech Stack & Skills */}
          {currentUser.techStack.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15, marginBottom: 8 }}>Tech Stack</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {currentUser.techStack.map((tech) => (
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

          {currentUser.interests.length > 0 && (
            <View style={{ marginTop: 12 }}>
              <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15, marginBottom: 8 }}>Interests</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {currentUser.interests.map((interest) => (
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

          {/* Social Links */}
          {(currentUser.githubUrl || currentUser.linkedinUrl) && (
            <View style={{ marginTop: 16, flexDirection: "row", gap: 12 }}>
              {currentUser.githubUrl && (
                <View style={{
                  paddingHorizontal: 12, paddingVertical: 6,
                  borderRadius: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
                }}>
                  <Text style={{ color: colors.foreground, fontSize: 12 }}>GitHub</Text>
                </View>
              )}
              {currentUser.linkedinUrl && (
                <View style={{
                  paddingHorizontal: 12, paddingVertical: 6,
                  borderRadius: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
                }}>
                  <Text style={{ color: colors.foreground, fontSize: 12 }}>LinkedIn</Text>
                </View>
              )}
            </View>
          )}

          {/* Tabs */}
          <View style={{ flexDirection: "row", marginTop: 20, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            {(["posts", "saved", "achievements"] as const).map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={({ pressed }) => ({
                  flex: 1, paddingVertical: 10, alignItems: "center",
                  borderBottomWidth: 2,
                  borderBottomColor: activeTab === tab ? colors.primary : "transparent",
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <Text style={{
                  color: activeTab === tab ? colors.primary : colors.muted,
                  fontWeight: "600", fontSize: 13, textTransform: "capitalize",
                }}>{tab}</Text>
              </Pressable>
            ))}
          </View>

          {/* Tab Content */}
          <View style={{ marginTop: 12 }}>
            {activeTab === "posts" && (
              myPosts.length > 0 ? myPosts.map((post) => (
                <View key={post.id} style={{
                  backgroundColor: colors.surface, borderRadius: 12, padding: 12, marginBottom: 8,
                  borderWidth: 1, borderColor: colors.border,
                }}>
                  <Text style={{ color: colors.foreground, fontSize: 14, lineHeight: 18 }} numberOfLines={3}>
                    {post.caption}
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 8, gap: 12 }}>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>{post.likes.length} likes</Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>{post.comments.length} comments</Text>
                  </View>
                </View>
              )) : (
                <Text style={{ color: colors.muted, fontSize: 14, textAlign: "center", paddingVertical: 20 }}>
                  No posts yet. Share your tech journey!
                </Text>
              )
            )}

            {activeTab === "saved" && (
              savedPosts.length > 0 ? savedPosts.map((post) => (
                <View key={post.id} style={{
                  backgroundColor: colors.surface, borderRadius: 12, padding: 12, marginBottom: 8,
                  borderWidth: 1, borderColor: colors.border,
                }}>
                  <Text style={{ color: colors.foreground, fontSize: 14, lineHeight: 18 }} numberOfLines={2}>
                    {post.caption}
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>by {post.author.name}</Text>
                </View>
              )) : (
                <Text style={{ color: colors.muted, fontSize: 14, textAlign: "center", paddingVertical: 20 }}>
                  No saved posts yet
                </Text>
              )
            )}

            {activeTab === "achievements" && (
              currentUser.achievements.length > 0 ? currentUser.achievements.map((achievement) => (
                <View key={achievement.id} style={{
                  backgroundColor: colors.surface, borderRadius: 12, padding: 14, marginBottom: 8,
                  borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center",
                }}>
                  <View style={{
                    width: 44, height: 44, borderRadius: 22,
                    backgroundColor: colors.primary + "20",
                    alignItems: "center", justifyContent: "center", marginRight: 12,
                  }}>
                    <IconSymbol name="rosette" size={24} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 14 }}>{achievement.title}</Text>
                    <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{achievement.description}</Text>
                  </View>
                </View>
              )) : (
                <View style={{ alignItems: "center", paddingVertical: 20 }}>
                  <IconSymbol name="trophy.fill" size={48} color={colors.muted} />
                  <Text style={{ color: colors.muted, fontSize: 14, textAlign: "center", marginTop: 8 }}>
                    No achievements yet. Participate in hackathons and events to earn badges!
                  </Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* Quick Links */}
        <View style={{ marginTop: 24, flexDirection: "row", gap: 10, paddingHorizontal: 0 }}>
          <Pressable
            onPress={() => router.push("/friends" as any)}
            style={({ pressed }) => ({
              flex: 1, paddingVertical: 10, borderRadius: 10,
              backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <IconSymbol name="person.2.fill" size={20} color={colors.primary} />
            <Text style={{ color: colors.primary, fontWeight: "600", fontSize: 12, marginTop: 4 }}>Friends</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/projects" as any)}
            style={({ pressed }) => ({
              flex: 1, paddingVertical: 10, borderRadius: 10,
              backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <IconSymbol name="square.grid.2x2.fill" size={20} color={colors.accent} />
            <Text style={{ color: colors.accent, fontWeight: "600", fontSize: 12, marginTop: 4 }}>Projects</Text>
          </Pressable>
        </View>

        {/* Logout */}
        <View style={{ marginTop: 20, paddingHorizontal: 20, paddingBottom: 40 }}>
          <Pressable
            onPress={logout}
            style={({ pressed }) => ({
              paddingVertical: 12, borderRadius: 10,
              backgroundColor: colors.error + "15",
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text style={{ color: colors.error, fontWeight: "600", fontSize: 15 }}>Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
