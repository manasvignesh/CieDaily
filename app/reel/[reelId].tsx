import { useState } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ReelDetailScreen() {
  const router = useRouter();
  const { reelId } = useLocalSearchParams<{ reelId: string }>();
  const { reels, currentUser, likeReel, saveReel } = useStore();
  const colors = useColors();
  const [isPlaying, setIsPlaying] = useState(true);

  const reel = reels.find((r) => r.id === reelId);

  if (!reel) {
    return (
      <ScreenContainer edges={["top", "left", "right", "bottom"]}>
        <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
          <Text style={{ color: colors.muted, fontSize: 16 }}>Reel not found</Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ color: colors.primary, fontSize: 14 }}>Go Back</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const timeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]} containerClassName="bg-black">
      <View style={{ flex: 1, backgroundColor: "#1a1a2e", position: "relative" }}>
        {/* Video placeholder */}
        <View style={{ flex: 1, backgroundColor: "#1a1a2e", alignItems: "center", justifyContent: "center" }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#ffffff20", alignItems: "center", justifyContent: "center" }}>
            <IconSymbol name={isPlaying ? "pause.fill" : "play.fill"} size={40} color="#fff" />
          </View>
          <Text style={{ color: "#ffffff80", fontSize: 12, marginTop: 12 }}>{reel.duration}s</Text>
        </View>

        {/* Tap to play/pause */}
        <Pressable
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          onPress={() => setIsPlaying(!isPlaying)}
        />

        {/* Bottom gradient overlay */}
        <View style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 250,
          backgroundColor: "rgba(0,0,0,0.7)",
          padding: 16,
        }}>
          {/* Caption */}
          <Text style={{ color: "#fff", fontSize: 15, lineHeight: 22, marginBottom: 8 }}>{reel.caption}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{
              paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12,
              backgroundColor: colors.primary + "40",
            }}>
              <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "600" }}>{reel.category}</Text>
            </View>
            <Text style={{ color: "#ffffff80", fontSize: 12, marginLeft: 8 }}>{timeAgo(reel.createdAt)}</Text>
          </View>
        </View>

        {/* Creator info - left side */}
        <View style={{ position: "absolute", bottom: 80, left: 16, flexDirection: "row", alignItems: "center" }}>
          <Pressable onPress={() => router.push(`/profile/${reel.creatorId}` as any)}>
            <View style={{
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: colors.accent, alignItems: "center", justifyContent: "center", marginRight: 8,
            }}>
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>{reel.creator.name.charAt(0)}</Text>
            </View>
          </Pressable>
          <View>
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>{reel.creator.name}</Text>
            <Text style={{ color: "#ffffff80", fontSize: 12 }}>{reel.creator.username}</Text>
          </View>
        </View>

        {/* Action buttons - right side */}
        <View style={{
          position: "absolute", right: 12, bottom: 100,
          alignItems: "center", gap: 20,
        }}>
          <Pressable
            onPress={() => likeReel(reel.id)}
            style={({ pressed }) => ({ alignItems: "center", opacity: pressed ? 0.6 : 1 })}
          >
            <IconSymbol
              name={reel.isLiked ? "heart.fill" : "heart"}
              size={30}
              color={reel.isLiked ? "#EF4444" : "#fff"}
            />
            <Text style={{ color: "#fff", fontSize: 12, marginTop: 2 }}>{reel.likes.length}</Text>
          </Pressable>

          <View style={{ alignItems: "center" }}>
            <IconSymbol name="text.bubble.fill" size={30} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 12, marginTop: 2 }}>{reel.comments.length}</Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <IconSymbol name="square.and.arrow.up" size={30} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 12, marginTop: 2 }}>{reel.shares}</Text>
          </View>

          <Pressable
            onPress={() => saveReel(reel.id)}
            style={({ pressed }) => ({ alignItems: "center", opacity: pressed ? 0.6 : 1 })}
          >
            <IconSymbol
              name={reel.isSaved ? "bookmark.fill" : "bookmark"}
              size={30}
              color={reel.isSaved ? colors.accent : "#fff"}
            />
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}
