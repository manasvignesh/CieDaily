import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { TECH_CATEGORIES, type TechCategory } from "@/lib/types";

export default function CreatePostScreen() {
  const router = useRouter();
  const { currentUser, createPost, spaces } = useStore();
  const colors = useColors();
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState<TechCategory | "">("");
  const [spaceId, setSpaceId] = useState<string | null>(null);

  const handlePost = () => {
    if (!caption.trim()) {
      Alert.alert("Error", "Please write something");
      return;
    }
    if (!category) {
      Alert.alert("Error", "Please select a category");
      return;
    }
    if (!currentUser) return;

    const selectedSpace = spaceId ? spaces.find((s) => s.id === spaceId) : null;

    createPost({
      authorId: currentUser.id,
      author: currentUser,
      caption: caption.trim(),
      media: [],
      category: category as TechCategory,
      spaceId: selectedSpace?.id,
      spaceName: selectedSpace?.name,
    });

    Alert.alert("Success", "Post published!", [{ text: "OK", onPress: () => router.back() }]);
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
          <Text style={{ color: colors.muted, fontSize: 16 }}>Cancel</Text>
        </Pressable>
        <Text style={{ fontWeight: "600", fontSize: 16, color: colors.foreground }}>New Post</Text>
        <Pressable
          onPress={handlePost}
          style={({ pressed }) => ({
            paddingHorizontal: 16, paddingVertical: 6,
            borderRadius: 16, backgroundColor: colors.primary,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>Post</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Author */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
          <View style={{
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: colors.primary,
            alignItems: "center", justifyContent: "center", marginRight: 10,
          }}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>{currentUser?.name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={{ fontWeight: "600", color: colors.foreground }}>{currentUser?.name}</Text>
            <Text style={{ color: colors.muted, fontSize: 12 }}>Posting publicly</Text>
          </View>
        </View>

        {/* Caption */}
        <TextInput
          placeholder="Share your tech knowledge, project, or idea..."
          placeholderTextColor={colors.muted}
          value={caption}
          onChangeText={setCaption}
          multiline
          style={{
            minHeight: 120, fontSize: 16, color: colors.foreground,
            textAlignVertical: "top", lineHeight: 22,
          }}
        />

        {/* Category Selection */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15, marginBottom: 10 }}>Category</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {TECH_CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setCategory(category === cat ? "" : cat)}
                style={({ pressed }) => ({
                  paddingHorizontal: 12, paddingVertical: 6,
                  borderRadius: 14,
                  backgroundColor: category === cat ? colors.primary : colors.surface,
                  borderWidth: 1,
                  borderColor: category === cat ? colors.primary : colors.border,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{
                  fontSize: 12, fontWeight: "500",
                  color: category === cat ? "#fff" : colors.foreground,
                }}>{cat}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Space Selection */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15, marginBottom: 10 }}>Post in Space (Optional)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {spaces.map((space) => (
                <Pressable
                  key={space.id}
                  onPress={() => setSpaceId(spaceId === space.id ? null : space.id)}
                  style={({ pressed }) => ({
                    flexDirection: "row", alignItems: "center",
                    paddingHorizontal: 12, paddingVertical: 8,
                    borderRadius: 14,
                    backgroundColor: spaceId === space.id ? colors.primary + "20" : colors.surface,
                    borderWidth: 1,
                    borderColor: spaceId === space.id ? colors.primary : colors.border,
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <Text style={{ fontSize: 16, marginRight: 6 }}>{space.logo}</Text>
                  <Text style={{
                    fontSize: 12, fontWeight: "500",
                    color: spaceId === space.id ? colors.primary : colors.foreground,
                  }}>{space.name}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
