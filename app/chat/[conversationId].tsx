import { useState, useRef } from "react";
import { View, Text, FlatList, Pressable, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { ChatMessage } from "@/lib/types";

// Mock messages for demo
const MOCK_MESSAGES: ChatMessage[] = [
  { id: "1", conversationId: "c1", senderId: "2", sender: {} as any, content: "Hey! How's your project going?", attachments: [], reactions: [], isRead: true, isDeleted: false, createdAt: "2026-08-05T10:00:00Z", updatedAt: "2026-08-05T10:00:00Z" },
  { id: "2", conversationId: "c1", senderId: "1", sender: {} as any, content: "Great progress! Just finished the backend API.", attachments: [], reactions: [], isRead: true, isDeleted: false, createdAt: "2026-08-05T10:05:00Z", updatedAt: "2026-08-05T10:05:00Z" },
  { id: "3", conversationId: "c1", senderId: "2", sender: {} as any, content: "Nice! Can you share the repo link?", attachments: [], reactions: [], isRead: true, isDeleted: false, createdAt: "2026-08-05T10:06:00Z", updatedAt: "2026-08-05T10:06:00Z" },
  { id: "4", conversationId: "c1", senderId: "1", sender: {} as any, content: "Sure! Here: github.com/rahul/project. Let me know if you want to contribute!", attachments: [], reactions: [], isRead: true, isDeleted: false, createdAt: "2026-08-05T10:10:00Z", updatedAt: "2026-08-05T10:10:00Z" },
  { id: "5", conversationId: "c1", senderId: "2", sender: {} as any, content: "Great project! Can I contribute?", attachments: [], reactions: [], isRead: false, isDeleted: false, createdAt: "2026-08-05T14:30:00Z", updatedAt: "2026-08-05T14:30:00Z" },
];

function MessageBubble({ message, isMine }: { message: ChatMessage; isMine: boolean }) {
  const colors = useColors();
  return (
    <View style={{
      flexDirection: "row",
      justifyContent: isMine ? "flex-end" : "flex-start",
      marginBottom: 8,
      paddingHorizontal: 16,
    }}>
      <View style={{
        maxWidth: "75%",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 16,
        borderBottomRightRadius: isMine ? 4 : 16,
        borderBottomLeftRadius: isMine ? 16 : 4,
        backgroundColor: isMine ? colors.primary : colors.surface,
      }}>
        <Text style={{
          color: isMine ? "#fff" : colors.foreground,
          fontSize: 14,
          lineHeight: 20,
        }}>
          {message.content}
        </Text>
        <Text style={{
          color: isMine ? "#ffffff80" : colors.muted,
          fontSize: 10,
          marginTop: 4,
          textAlign: isMine ? "right" : "left",
        }}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    </View>
  );
}

export default function ChatDetailScreen() {
  const router = useRouter();
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const { conversations, currentUser } = useStore();
  const colors = useColors();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const flatListRef = useRef<FlatList>(null);

  const conversation = conversations.find((c) => c.id === conversationId);
  const otherParticipant = conversation?.participants.find((p) => true);
  const chatName = conversation?.isGroup
    ? conversation.groupName || "Group"
    : otherParticipant?.name || "Chat";

  const handleSend = () => {
    if (!inputText.trim() || !currentUser) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      conversationId: conversationId || "",
      senderId: currentUser.id,
      sender: currentUser,
      content: inputText.trim(),
      attachments: [],
      reactions: [],
      isRead: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMessages([...messages, newMsg]);
    setInputText("");
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        <View style={{
          flexDirection: "row", alignItems: "center",
          paddingHorizontal: 12, paddingVertical: 10, gap: 10,
          borderBottomWidth: 0.5, borderBottomColor: colors.border,
          backgroundColor: colors.background,
        }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
            <IconSymbol name="chevron.left" size={24} color={colors.primary} />
          </Pressable>
          <View style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: conversation?.isGroup ? colors.accent : colors.primary,
            alignItems: "center", justifyContent: "center",
          }}>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
              {conversation?.isGroup ? "👥" : otherParticipant?.name?.charAt(0) || "?"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "600", fontSize: 15, color: colors.foreground }}>{chatName}</Text>
            <Text style={{ color: colors.muted, fontSize: 12 }}>
              {conversation?.isGroup ? `${conversation.participants.length} members` : "Online"}
            </Text>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble message={item} isMine={item.senderId === currentUser?.id} />
          )}
          contentContainerStyle={{ paddingVertical: 12 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Input */}
        <View style={{
          flexDirection: "row", alignItems: "center", gap: 8,
          paddingHorizontal: 12, paddingVertical: 10,
          borderTopWidth: 0.5, borderTopColor: colors.border,
          backgroundColor: colors.background,
        }}>
          <TextInput
            placeholder="Type a message..."
            placeholderTextColor={colors.muted}
            value={inputText}
            onChangeText={setInputText}
            style={{
              flex: 1, backgroundColor: colors.surface,
              borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10,
              fontSize: 15, color: colors.foreground,
              borderWidth: 1, borderColor: colors.border,
            }}
          />
          <Pressable
            onPress={handleSend}
            style={({ pressed }) => ({
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: inputText.trim() ? colors.primary : colors.surface,
              alignItems: "center", justifyContent: "center",
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <IconSymbol name="arrow.up" size={20} color={inputText.trim() ? "#fff" : colors.muted} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
