import { useState, useRef } from "react";
import { View, Text, FlatList, Pressable, Dimensions } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { type Reel } from "@/lib/types";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

function ReelCard({ reel }: { reel: Reel }) {
  const colors = useColors();
  const store = useStore();
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <View style={{ height: SCREEN_HEIGHT - 120, position: "relative", backgroundColor: "#000", borderRadius: 16, overflow: "hidden", marginBottom: 8 }}>
      {/* Video placeholder */}
      <View style={{ flex: 1, backgroundColor: "#1a1a2e", alignItems: "center", justifyContent: "center" }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#ffffff20", alignItems: "center", justifyContent: "center" }}>
          <IconSymbol name={isPlaying ? "pause.fill" : "play.fill"} size={40} color="#fff" />
        </View>
        <Text style={{ color: "#ffffff80", fontSize: 12, marginTop: 12 }}>{reel.duration}s</Text>
      </View>

      {/* Gradient overlay */}
      <View style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 200,
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: 16,
      }}>
        {/* Caption */}
        <Text style={{ color: "#fff", fontSize: 14, lineHeight: 20, marginBottom: 8 }}>{reel.caption}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{
            paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12,
            backgroundColor: colors.primary + "40",
          }}>
            <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "600" }}>{reel.category}</Text>
          </View>
        </View>
      </View>

      {/* Creator info - left side */}
      <View style={{ position: "absolute", bottom: 16, left: 16, flexDirection: "row", alignItems: "center" }}>
        <View style={{
          width: 36, height: 36, borderRadius: 18,
          backgroundColor: colors.accent, alignItems: "center", justifyContent: "center", marginRight: 8,
        }}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>{reel.creator.name.charAt(0)}</Text>
        </View>
        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>{reel.creator.name}</Text>
      </View>

      {/* Action buttons - right side */}
      <View style={{
        position: "absolute", right: 12, bottom: 100,
        alignItems: "center", gap: 20,
      }}>
        <Pressable
          onPress={() => store.likeReel(reel.id)}
          style={({ pressed }) => ({ alignItems: "center", opacity: pressed ? 0.6 : 1 })}
        >
          <IconSymbol
            name={reel.isLiked ? "heart.fill" : "heart"}
            size={30}
            color={reel.isLiked ? "#EF4444" : "#fff"}
          />
          <Text style={{ color: "#fff", fontSize: 12, marginTop: 2 }}>{reel.likes.length}</Text>
        </Pressable>

        <Pressable style={({ pressed }) => ({ alignItems: "center", opacity: pressed ? 0.6 : 1 })}>
          <IconSymbol name="text.bubble.fill" size={30} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 12, marginTop: 2 }}>{reel.comments.length}</Text>
        </Pressable>

        <Pressable style={({ pressed }) => ({ alignItems: "center", opacity: pressed ? 0.6 : 1 })}>
          <IconSymbol name="square.and.arrow.up" size={30} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 12, marginTop: 2 }}>{reel.shares}</Text>
        </Pressable>

        <Pressable
          onPress={() => store.saveReel(reel.id)}
          style={({ pressed }) => ({ alignItems: "center", opacity: pressed ? 0.6 : 1 })}
        >
          <IconSymbol
            name={reel.isSaved ? "bookmark.fill" : "bookmark"}
            size={30}
            color={reel.isSaved ? colors.accent : "#fff"}
          />
        </Pressable>
      </View>

      {/* Tap to play/pause */}
      <Pressable
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        onPress={() => setIsPlaying(!isPlaying)}
      />
    </View>
  );
}

export default function ReelsScreen() {
  const { reels } = useStore();
  const colors = useColors();

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{
        flexDirection: "row", alignItems: "center", justifyContent: "center",
        paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: colors.border,
      }}>
        <Text style={{ fontWeight: "bold", fontSize: 18, color: colors.foreground }}>Reels</Text>
      </View>

      <FlatList
        data={reels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReelCard reel={item} />}
        showsVerticalScrollIndicator={false}
        pagingEnabled
        snapToInterval={SCREEN_HEIGHT - 120}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{ padding: 8 }}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 80 }}>
            <Text style={{ color: colors.muted, fontSize: 16 }}>No Reels yet</Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}
