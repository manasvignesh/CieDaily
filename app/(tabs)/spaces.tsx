import { useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, TextInput, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { type Space } from "@/lib/types";

function SpaceCard({ space }: { space: Space }) {
  const colors = useColors();
  const store = useStore();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/space/${space.id}` as any)}
      style={({ pressed }) => ({
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.border,
        opacity: pressed ? 0.8 : 1,
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{
          width: 50, height: 50, borderRadius: 25,
          backgroundColor: colors.primary + "20",
          alignItems: "center", justifyContent: "center", marginRight: 12,
        }}>
          <Text style={{ fontSize: 24 }}>{space.logo}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "600", fontSize: 16, color: colors.foreground }}>{space.name}</Text>
          <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>{space.memberCount} members</Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4, lineHeight: 16 }} numberOfLines={2}>
            {space.description}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 12 }}>
        {space.isMember ? (
          <View style={{
            flexDirection: "row", alignItems: "center", gap: 4,
            paddingHorizontal: 12, paddingVertical: 6,
            borderRadius: 16, backgroundColor: colors.success + "20",
          }}>
            <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
            <Text style={{ color: colors.success, fontSize: 13, fontWeight: "600" }}>Joined</Text>
          </View>
        ) : space.isPending ? (
          <View style={{
            paddingHorizontal: 12, paddingVertical: 6,
            borderRadius: 16, backgroundColor: colors.warning + "20",
          }}>
            <Text style={{ color: colors.warning, fontSize: 13, fontWeight: "600" }}>Pending</Text>
          </View>
        ) : (
          <Pressable
            onPress={() => store.joinSpace(space.id)}
            style={({ pressed }) => ({
              paddingHorizontal: 16, paddingVertical: 6,
              borderRadius: 16, backgroundColor: colors.primary,
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>Join</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

export default function SpacesScreen() {
  const { spaces } = useStore();
  const colors = useColors();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const filteredSpaces = spaces.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

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
        <Text style={{ fontWeight: "bold", fontSize: 20, color: colors.foreground }}>Spaces</Text>
        <Text style={{ color: colors.muted, fontSize: 14 }}>{spaces.length} communities</Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
        <View style={{
          flexDirection: "row", alignItems: "center",
          backgroundColor: colors.surface, borderRadius: 12,
          paddingHorizontal: 12, paddingVertical: 10,
          borderWidth: 1, borderColor: colors.border,
        }}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
          <TextInput
            placeholder="Search spaces..."
            placeholderTextColor={colors.muted}
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, marginLeft: 8, color: colors.foreground, fontSize: 15 }}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <IconSymbol name="xmark" size={18} color={colors.muted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Spaces List */}
      <FlatList
        data={filteredSpaces}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SpaceCard space={item} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text style={{ color: colors.muted, fontSize: 16 }}>No spaces found</Text>
            <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>Try a different search term</Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}
