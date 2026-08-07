import { useState } from "react";
import { View, Text, ScrollView, Pressable, Switch, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

type SettingItem = {
  icon: string;
  label: string;
  value?: string;
  type: "link" | "toggle" | "action";
  onPress?: () => void;
  danger?: boolean;
};

export default function SettingsScreen() {
  const router = useRouter();
  const { currentUser, logout } = useStore();
  const colors = useColors();

  const settingsGroups: { title: string; items: SettingItem[] }[] = [
    {
      title: "Account",
      items: [
        { icon: "person.fill", label: "Edit Profile", type: "link", onPress: () => {} },
        { icon: "envelope.fill", label: "Email", value: currentUser?.email, type: "link", onPress: () => {} },
        { icon: "building.2.fill", label: "College Domain", value: currentUser?.collegeDomain, type: "link", onPress: () => {} },
        { icon: "globe", label: "Department", value: currentUser?.department, type: "link", onPress: () => {} },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: "bell.fill", label: "Notifications", type: "link", onPress: () => {} },
        { icon: "eye.fill", label: "Dark Mode", type: "toggle", onPress: () => {} },
        { icon: "lock.fill", label: "Privacy", type: "link", onPress: () => {} },
        { icon: "shield.fill", label: "Security", type: "link", onPress: () => {} },
      ],
    },
    {
      title: "Tech & Learning",
      items: [
        { icon: "chevron.left.forwardslash.chevron.right", label: "My Tech Stack", type: "link", onPress: () => {} },
        { icon: "book.fill", label: "Learning Resources", type: "link", onPress: () => {} },
        { icon: "rosette", label: "Achievements", type: "link", onPress: () => {} },
        { icon: "doc.fill", label: "My Certificates", type: "link", onPress: () => {} },
      ],
    },
    {
      title: "About",
      items: [
        { icon: "info.circle.fill", label: "About CIE Connect", type: "link", onPress: () => {} },
        { icon: "doc.text.fill", label: "Terms & Conditions", type: "link", onPress: () => {} },
        { icon: "shield.fill", label: "Privacy Policy", type: "link", onPress: () => {} },
        { icon: "questionmark.circle.fill", label: "Help & Support", type: "link", onPress: () => {} },
      ],
    },
  ];

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]}>
      {/* Header */}
      <View style={{
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 16, paddingVertical: 10,
        borderBottomWidth: 0.5, borderBottomColor: colors.border,
      }}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
          <IconSymbol name="chevron.left" size={24} color={colors.primary} />
        </Pressable>
        <Text style={{ fontWeight: "600", fontSize: 16, color: colors.foreground }}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {settingsGroups.map((group) => (
          <View key={group.title} style={{ marginTop: 24, paddingHorizontal: 16 }}>
            <Text style={{ color: colors.muted, fontSize: 13, fontWeight: "600", textTransform: "uppercase", marginBottom: 8 }}>
              {group.title}
            </Text>
            <View style={{
              backgroundColor: colors.surface, borderRadius: 12,
              overflow: "hidden", borderWidth: 1, borderColor: colors.border,
            }}>
              {group.items.map((item, index) => (
                <Pressable
                  key={item.label}
                  onPress={item.onPress}
                  style={({ pressed }) => ({
                    flexDirection: "row", alignItems: "center",
                    paddingVertical: 14, paddingHorizontal: 14,
                    borderBottomWidth: index < group.items.length - 1 ? 0.5 : 0,
                    borderBottomColor: colors.border,
                    opacity: pressed ? 0.8 : 1,
                    backgroundColor: item.danger ? colors.error + "10" : "transparent",
                  })}
                >
                  <View style={{
                    width: 32, height: 32, borderRadius: 8,
                    backgroundColor: item.danger ? colors.error + "20" : colors.primary + "15",
                    alignItems: "center", justifyContent: "center", marginRight: 12,
                  }}>
                    <IconSymbol
                      name={item.icon as any}
                      size={18}
                      color={item.danger ? colors.error : colors.primary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: item.danger ? colors.error : colors.foreground, fontSize: 15 }}>
                      {item.label}
                    </Text>
                    {item.value && (
                      <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{item.value}</Text>
                    )}
                  </View>
                  {item.type === "link" && (
                    <IconSymbol name="chevron.right" size={16} color={colors.muted} />
                  )}
                  {item.type === "toggle" && (
                    <Switch value={false} onValueChange={() => {}} trackColor={{ false: colors.border, true: colors.primary }} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <View style={{ marginTop: 30, paddingHorizontal: 16 }}>
          <Pressable
            onPress={logout}
            style={({ pressed }) => ({
              paddingVertical: 14, borderRadius: 12,
              backgroundColor: colors.error + "15",
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text style={{ color: colors.error, fontWeight: "600", fontSize: 16 }}>Log Out</Text>
          </Pressable>
        </View>

        {/* Version */}
        <Text style={{ color: colors.muted, fontSize: 12, textAlign: "center", marginTop: 20 }}>
          CIE Connect v1.0.0
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}
