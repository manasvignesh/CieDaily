import { useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, RefreshControl, Image } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { TECH_CATEGORIES, type TechCategory, type Post } from "@/lib/types";

function PostCard({ post }: { post: Post }) {
  const colors = useColors();
  const store = useStore();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const timeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return then.toLocaleDateString();
  };

  return (
    <View style={{ backgroundColor: colors.surface, borderRadius: 16, marginBottom: 12, overflow: "hidden" }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 12 }}>
        <View style={{
          width: 40, height: 40, borderRadius: 20,
          backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", marginRight: 10,
        }}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>{post.author.name.charAt(0)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 14 }}>{post.author.name}</Text>
          <Text style={{ color: colors.muted, fontSize: 12 }}>{timeAgo(post.createdAt)}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{
            paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12,
            backgroundColor: colors.primary + "20",
          }}>
            <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "600" }}>{post.category}</Text>
          </View>
          {post.spaceName && (
            <Text style={{ color: colors.muted, fontSize: 11, marginLeft: 8 }}>in {post.spaceName}</Text>
          )}
        </View>
      </View>

      {/* Caption */}
      <View style={{ paddingHorizontal: 12 }}>
        <Text style={{ color: colors.foreground, fontSize: 14, lineHeight: 20 }}>
          {expanded || post.caption.length <= 150 ? post.caption : post.caption.substring(0, 150) + "..."}
        </Text>
        {post.caption.length > 150 && (
          <Pressable onPress={() => setExpanded(!expanded)}>
            <Text style={{ color: colors.primary, fontSize: 13, marginTop: 4 }}>
              {expanded ? "Show less" : "Read more"}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Media */}
      {post.media.length > 0 && (
        <View style={{ marginTop: 8 }}>
          {post.media.length === 1 ? (
            <Image
              source={{ uri: post.media[0].url }}
              style={{ width: "100%", height: 200, borderRadius: 12 }}
              resizeMode="cover"
            />
          ) : (
            <View style={{ flexDirection: "row", gap: 4, paddingHorizontal: 4 }}>
              {post.media.slice(0, 4).map((m, i) => (
                <Image
                  key={m.id}
                  source={{ uri: m.url }}
                  style={{
                    flex: 1, height: 150, borderRadius: 8,
                    marginRight: i < post.media.slice(0, 4).length - 1 ? 4 : 0,
                  }}
                  resizeMode="cover"
                />
              ))}
              {post.media.length > 4 && (
                <View style={{
                  position: "absolute", right: 12, bottom: 12,
                  backgroundColor: "#00000080", borderRadius: 12,
                  paddingHorizontal: 8, paddingVertical: 4,
                }}>
                  <Text style={{ color: "#fff", fontSize: 12 }}>+{post.media.length - 4}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      )}

      {/* Actions */}
      <View style={{ flexDirection: "row", paddingHorizontal: 12, paddingVertical: 10, gap: 16 }}>
        <Pressable
          onPress={() => store.likePost(post.id)}
          style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", opacity: pressed ? 0.6 : 1 })}
        >
          <IconSymbol
            name={post.isLiked ? "heart.fill" : "heart"}
            size={22}
            color={post.isLiked ? "#EF4444" : colors.muted}
          />
          <Text style={{ color: colors.muted, fontSize: 13, marginLeft: 4 }}>{post.likes.length}</Text>
        </Pressable>

        <Pressable style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", opacity: pressed ? 0.6 : 1 })}>
          <IconSymbol name="text.bubble.fill" size={22} color={colors.muted} />
          <Text style={{ color: colors.muted, fontSize: 13, marginLeft: 4 }}>{post.comments.length}</Text>
        </Pressable>

        <Pressable style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", opacity: pressed ? 0.6 : 1 })}>
          <IconSymbol name="square.and.arrow.up" size={22} color={colors.muted} />
          <Text style={{ color: colors.muted, fontSize: 13, marginLeft: 4 }}>{post.shares}</Text>
        </Pressable>

        <Pressable
          onPress={() => store.savePost(post.id)}
          style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", opacity: pressed ? 0.6 : 1, marginLeft: "auto" })}
        >
          <IconSymbol
            name={post.isSaved ? "bookmark.fill" : "bookmark"}
            size={22}
            color={post.isSaved ? colors.accent : colors.muted}
          />
        </Pressable>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { posts, currentUser } = useStore();
  const colors = useColors();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filteredPosts = selectedCategory
    ? posts.filter((p) => p.category === selectedCategory && !p.isDeleted)
    : posts.filter((p) => !p.isDeleted);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 16, paddingVertical: 8,
        borderBottomWidth: 0.5, borderBottomColor: colors.border,
      }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{
            width: 32, height: 32, borderRadius: 8,
            backgroundColor: colors.primary, alignItems: "center", justifyContent: "center",
          }}>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>CIE</Text>
          </View>
          <Text style={{ fontWeight: "bold", fontSize: 18, color: colors.foreground, marginLeft: 8 }}>
            CIE Connect
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable
            onPress={() => router.push("/search" as any)}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <IconSymbol name="magnifyingglass" size={24} color={colors.foreground} />
          </Pressable>
          <Pressable
            onPress={() => router.push("/notifications" as any)}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <IconSymbol name="bell.fill" size={24} color={colors.foreground} />
          </Pressable>
        </View>
      </View>

      {/* Category Filter */}
      <View style={{ borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8, gap: 8 }}
          data={["All", ...TECH_CATEGORIES]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedCategory(item === "All" ? null : item)}
              style={({ pressed }) => ({
                paddingHorizontal: 14, paddingVertical: 6,
                borderRadius: 16, marginRight: 6,
                backgroundColor: (item === "All" ? selectedCategory === null : item === selectedCategory)
                  ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: (item === "All" ? selectedCategory === null : item === selectedCategory)
                  ? colors.primary : colors.border,
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              })}
            >
              <Text style={{
                fontSize: 12, fontWeight: "600",
                color: (item === "All" ? selectedCategory === null : item === selectedCategory)
                  ? "#fff" : colors.foreground,
              }}>{item}</Text>
            </Pressable>
          )}
        />
      </View>

      {/* Posts Feed */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text style={{ color: colors.muted, fontSize: 16 }}>No posts yet</Text>
            <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>Be the first to share something!</Text>
          </View>
        }
      />

      {/* Floating Create Button */}
      <Pressable
        onPress={() => router.push("/create-post" as any)}
        style={{
          position: "absolute", bottom: 80, right: 20,
          width: 56, height: 56, borderRadius: 28,
          backgroundColor: colors.primary,
          alignItems: "center", justifyContent: "center",
          elevation: 4, shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3, shadowRadius: 4,
        }}
      >
        <IconSymbol name="plus" size={28} color="#fff" />
      </Pressable>
    </ScreenContainer>
  );
}
