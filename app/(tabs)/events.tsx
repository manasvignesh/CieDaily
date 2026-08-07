import { useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, RefreshControl, Image } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { type Event, EVENT_TYPES } from "@/lib/types";

const EVENT_TYPE_LABELS: Record<string, string> = {
  hackathon: "Hackathon",
  workshop: "Workshop",
  tech_talk: "Tech Talk",
  coding_competition: "Coding Competition",
  research_seminar: "Research Seminar",
  career_fair: "Career Fair",
  internship_drive: "Internship Drive",
  startup_meetup: "Startup Meetup",
};

const EVENT_TYPE_ICONS: Record<string, string> = {
  hackathon: "🏆",
  workshop: "🔧",
  tech_talk: "🎤",
  coding_competition: "💻",
  research_seminar: "📚",
  career_fair: "💼",
  internship_drive: "📋",
  startup_meetup: "🚀",
};

function EventCard({ event }: { event: Event }) {
  const colors = useColors();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/event/${event.id}` as any)}
      style={({ pressed }) => ({
        backgroundColor: colors.surface,
        borderRadius: 16,
        marginBottom: 12,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.border,
        opacity: pressed ? 0.8 : 1,
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
    >
      {event.posterUrl && (
        <Image
          source={{ uri: event.posterUrl }}
          style={{ width: "100%", height: 140 }}
          resizeMode="cover"
        />
      )}
      <View style={{ padding: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
          <Text style={{ fontSize: 18, marginRight: 6 }}>{EVENT_TYPE_ICONS[event.type] || "📅"}</Text>
          <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "600", textTransform: "uppercase" }}>
            {EVENT_TYPE_LABELS[event.type] || event.type}
          </Text>
          {event.registeredCount >= event.availableSeats + event.registeredCount && (
            <View style={{ marginLeft: "auto", backgroundColor: colors.error + "20", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
              <Text style={{ color: colors.error, fontSize: 11, fontWeight: "600" }}>Full</Text>
            </View>
          )}
        </View>
        <Text style={{ fontWeight: "600", fontSize: 16, color: colors.foreground }}>{event.title}</Text>
        <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4, lineHeight: 18 }} numberOfLines={2}>
          {event.description}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconSymbol name="calendar" size={14} color={colors.muted} />
            <Text style={{ color: colors.muted, fontSize: 12, marginLeft: 4 }}>{event.date}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: colors.muted, fontSize: 12 }}>{event.time}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconSymbol name="building.2.fill" size={14} color={colors.muted} />
            <Text style={{ color: colors.muted, fontSize: 12, marginLeft: 4 }} numberOfLines={1}>{event.venue}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <Text style={{ color: colors.muted, fontSize: 12 }}>{event.registeredCount}/{event.availableSeats + event.registeredCount} registered</Text>
          {event.isRegistered && (
            <View style={{
              flexDirection: "row", alignItems: "center", gap: 4,
              paddingHorizontal: 10, paddingVertical: 4,
              borderRadius: 12, backgroundColor: colors.success + "20",
            }}>
              <IconSymbol name="checkmark.circle.fill" size={14} color={colors.success} />
              <Text style={{ color: colors.success, fontSize: 12, fontWeight: "600" }}>Registered</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default function EventsScreen() {
  const { events } = useStore();
  const colors = useColors();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filteredEvents = selectedType
    ? events.filter((e) => e.type === selectedType)
    : events;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{
        paddingHorizontal: 16, paddingVertical: 8,
        borderBottomWidth: 0.5, borderBottomColor: colors.border,
      }}>
        <Text style={{ fontWeight: "bold", fontSize: 20, color: colors.foreground }}>Events</Text>
        <Text style={{ color: colors.muted, fontSize: 14, marginTop: 2 }}>{events.length} upcoming events</Text>
      </View>

      {/* Type Filter */}
      <View style={{ borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
          data={["All", ...EVENT_TYPES]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedType(item === "All" ? null : item)}
              style={({ pressed }) => ({
                paddingHorizontal: 12, paddingVertical: 6,
                borderRadius: 14, marginRight: 6,
                backgroundColor: (item === "All" ? selectedType === null : item === selectedType)
                  ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: (item === "All" ? selectedType === null : item === selectedType)
                  ? colors.primary : colors.border,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{
                fontSize: 12, fontWeight: "600",
                color: (item === "All" ? selectedType === null : item === selectedType)
                  ? "#fff" : colors.foreground,
              }}>{item === "All" ? "All" : EVENT_TYPE_LABELS[item] || item}</Text>
            </Pressable>
          )}
        />
      </View>

      {/* Events List */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text style={{ color: colors.muted, fontSize: 16 }}>No events found</Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}
