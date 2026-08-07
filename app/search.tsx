import { useState, useCallback } from "react";
import { View, Text, TextInput, FlatList, Pressable, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

type SearchResult = {
  type: "user" | "space" | "event" | "post" | "project";
  id: string;
  title: string;
  subtitle: string;
  icon: string;
};

export default function SearchScreen() {
  const router = useRouter();
  const { users, spaces, events, posts, projects } = useStore();
  const colors = useColors();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    Keyboard.dismiss();

    if (text.length < 2) {
      setResults([]);
      return;
    }

    const lower = text.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search users
    users.forEach((u) => {
      if (u.name.toLowerCase().includes(lower) || u.username.toLowerCase().includes(lower) ||
          u.department.toLowerCase().includes(lower) || u.skills.some((s) => s.toLowerCase().includes(lower))) {
        searchResults.push({ type: "user", id: u.id, title: u.name, subtitle: `@${u.username} · ${u.department}`, icon: "person.fill" });
      }
    });

    // Search spaces
    spaces.forEach((s) => {
      if (s.name.toLowerCase().includes(lower) || s.description.toLowerCase().includes(lower) || s.category.toLowerCase().includes(lower)) {
        searchResults.push({ type: "space", id: s.id, title: `${s.logo} ${s.name}`, subtitle: `${s.memberCount} members`, icon: "person.2.fill" });
      }
    });

    // Search events
    events.forEach((e) => {
      if (e.title.toLowerCase().includes(lower) || e.description.toLowerCase().includes(lower)) {
        searchResults.push({ type: "event", id: e.id, title: e.title, subtitle: `${e.date} · ${e.type}`, icon: "calendar" });
      }
    });

    // Search posts
    posts.forEach((p) => {
      if (p.caption.toLowerCase().includes(lower) || p.category.toLowerCase().includes(lower)) {
        searchResults.push({ type: "post", id: p.id, title: p.caption.substring(0, 50), subtitle: `by ${p.author.name} · ${p.category}`, icon: "doc.fill" });
      }
    });

    // Search projects
    projects.forEach((proj) => {
      if (proj.title.toLowerCase().includes(lower) || proj.description.toLowerCase().includes(lower)) {
        searchResults.push({ type: "project", id: proj.id, title: proj.title, subtitle: `${proj.techStack.slice(0, 2).join(", ")}`, icon: "square.grid.2x2.fill" });
      }
    });

    setResults(searchResults);
  }, [users, spaces, events, posts, projects]);

  const navigateToResult = (result: SearchResult) => {
    switch (result.type) {
      case "user": router.push(`/profile/${result.id}` as any); break;
      case "space": router.push(`/space/${result.id}` as any); break;
      case "event": router.push(`/event/${result.id}` as any); break;
      case "post": router.push("/" as any); break;
      case "project": router.push(`/project/${result.id}` as any); break;
    }
  };

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]}>
      {/* Header */}
      <View style={{
        flexDirection: "row", alignItems: "center",
        paddingHorizontal: 16, paddingVertical: 10, gap: 10,
        borderBottomWidth: 0.5, borderBottomColor: colors.border,
      }}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
          <IconSymbol name="chevron.left" size={24} color={colors.primary} />
        </Pressable>
        <View style={{
          flex: 1, flexDirection: "row", alignItems: "center",
          backgroundColor: colors.surface, borderRadius: 12,
          paddingHorizontal: 12, paddingVertical: 10,
          borderWidth: 1, borderColor: colors.border,
        }}>
          <IconSymbol name="magnifyingglass" size={18} color={colors.muted} />
          <TextInput
            placeholder="Search people, spaces, events..."
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={handleSearch}
            autoFocus
            style={{ flex: 1, marginLeft: 8, color: colors.foreground, fontSize: 15 }}
          />
          {query.length > 0 && (
            <Pressable onPress={() => handleSearch("")}>
              <IconSymbol name="xmark.circle.fill" size={18} color={colors.muted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Results */}
      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigateToResult(item)}
              style={({ pressed }) => ({
                flexDirection: "row", alignItems: "center",
                paddingVertical: 12, paddingHorizontal: 16,
                borderBottomWidth: 0.5, borderBottomColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <View style={{
                width: 40, height: 40, borderRadius: 20,
                backgroundColor: colors.primary + "15",
                alignItems: "center", justifyContent: "center", marginRight: 12,
              }}>
                <IconSymbol name={item.icon as any} size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "500", color: colors.foreground, fontSize: 15 }} numberOfLines={1}>{item.title}</Text>
                <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }} numberOfLines={1}>{item.subtitle}</Text>
              </View>
            </Pressable>
          )}
          ListHeaderComponent={
            <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
              <Text style={{ color: colors.muted, fontSize: 13, fontWeight: "500" }}>
                {results.length} result{results.length !== 1 ? "s" : ""}
              </Text>
            </View>
          }
        />
      ) : query.length >= 2 ? (
        <View style={{ alignItems: "center", paddingVertical: 60 }}>
          <IconSymbol name="magnifyingglass" size={48} color={colors.muted} />
          <Text style={{ color: colors.muted, fontSize: 16, marginTop: 12 }}>No results found</Text>
          <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>Try different keywords</Text>
        </View>
      ) : (
        <View style={{ padding: 16 }}>
          <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 16, marginBottom: 12 }}>Trending Topics</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {["AI/ML", "Flutter", "React", "Hackathons", "Robotics", "Cyber Security", "IoT", "Web Dev"].map((topic) => (
              <Pressable
                key={topic}
                onPress={() => handleSearch(topic)}
                style={({ pressed }) => ({
                  paddingHorizontal: 14, paddingVertical: 8,
                  borderRadius: 16, backgroundColor: colors.surface,
                  borderWidth: 1, borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "500" }}>{topic}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 16, marginTop: 24, marginBottom: 12 }}>Suggested People</Text>
          {users.slice(0, 4).map((user) => (
            <Pressable
              key={user.id}
              onPress={() => router.push(`/profile/${user.id}` as any)}
              style={({ pressed }) => ({
                flexDirection: "row", alignItems: "center",
                paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <View style={{
                width: 40, height: 40, borderRadius: 20,
                backgroundColor: colors.primary,
                alignItems: "center", justifyContent: "center", marginRight: 12,
              }}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>{user.name.charAt(0)}</Text>
              </View>
              <View>
                <Text style={{ fontWeight: "500", color: colors.foreground, fontSize: 15 }}>{user.name}</Text>
                <Text style={{ color: colors.muted, fontSize: 13 }}>{user.department} · Year {user.year}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}
