import { useState } from "react";
import { View, Text, FlatList, Pressable, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { type ChatConversation } from "@/lib/types";

function ConversationItem({ conversation }: { conversation: ChatConversation }) {
  const colors = useColors();
  const router = useRouter();

  const otherParticipant = conversation.isGroup
    ? null
    : conversation.participants.find((p) => true);

  const name = conversation.isGroup
    ? conversation.groupName || "Group Chat"
    : conversation.participants.map((p) => p.name).join(", ");

  const timeAgo = (date: string) => {
    const then = new Date(date);
    const now = new Date();
    const diff = now.getTime() - then.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Now";
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  return (
    <Pressable
      onPress={() => router.push(`/chat/${conversation.id}` as any)}
      style={({ pressed }) => ({
        flexDirection: "row", alignItems: "center",
        paddingVertical: 12, paddingHorizontal: 16,
        backgroundColor: colors.surface,
        borderBottomWidth: 0.5, borderBottomColor: colors.border,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      {/* Avatar */}
      <View style={{
        width: 48, height: 48, borderRadius: 24,
        backgroundColor: conversation.isGroup ? colors.accent : colors.primary,
        alignItems: "center", justifyContent: "center", marginRight: 12,
      }}>
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          {conversation.isGroup ? "👥" : (otherParticipant?.name?.charAt(0) || "?")}
        </Text>
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontWeight: "600", fontSize: 15, color: colors.foreground }} numberOfLines={1}>
            {name}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 11 }}>
            {timeAgo(conversation.updatedAt)}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
          <Text style={{ color: colors.muted, fontSize: 13 }} numberOfLines={1}>
            {conversation.lastMessage?.content || "No messages yet"}
          </Text>
          {conversation.unreadCount > 0 && (
            <View style={{
              backgroundColor: colors.primary, borderRadius: 10,
              minWidth: 20, height: 20, alignItems: "center", justifyContent: "center",
              paddingHorizontal: 4,
            }}>
              <Text style={{ color: "#fff", fontSize: 11, fontWeight: "600" }}>{conversation.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default function ChatScreen() {
  const { conversations, users, currentUser } = useStore();
  const colors = useColors();
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) => {
    const name = c.isGroup
      ? c.groupName || ""
      : c.participants.map((p) => p.name).join(" ");
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 16, paddingVertical: 8,
        borderBottomWidth: 0.5, borderBottomColor: colors.border,
      }}>
        <Text style={{ fontWeight: "bold", fontSize: 20, color: colors.foreground }}>Chat</Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <View style={{
          flexDirection: "row", alignItems: "center",
          backgroundColor: colors.surface, borderRadius: 12,
          paddingHorizontal: 12, paddingVertical: 8,
          borderWidth: 1, borderColor: colors.border,
        }}>
          <IconSymbol name="magnifyingglass" size={18} color={colors.muted} />
          <TextInput
            placeholder="Search conversations..."
            placeholderTextColor={colors.muted}
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, marginLeft: 8, color: colors.foreground, fontSize: 14 }}
          />
        </View>
      </View>

      {/* Conversations */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ConversationItem conversation={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text style={{ color: colors.muted, fontSize: 16 }}>No conversations</Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}
