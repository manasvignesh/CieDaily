import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

const STATUS_COLORS: Record<string, string> = {
  open: "#3B82F6",
  in_progress: "#F59E0B",
  completed: "#10B981",
};

const STATUS_LABELS: Record<string, string> = {
  open: "Open for Collaboration",
  in_progress: "In Progress",
  completed: "Completed",
};

export default function ProjectDetailScreen() {
  const router = useRouter();
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { projects, currentUser } = useStore();
  const colors = useColors();

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <ScreenContainer edges={["top", "left", "right", "bottom"]}>
        <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
          <Text style={{ color: colors.muted, fontSize: 16 }}>Project not found</Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ color: colors.primary, fontSize: 14 }}>Go Back</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const isCreator = currentUser?.id === project.creatorId;

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
        <Text style={{ fontWeight: "600", fontSize: 16, color: colors.foreground }}>Project</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ padding: 20 }}>
          {/* Status */}
          <View style={{
            paddingHorizontal: 10, paddingVertical: 4,
            borderRadius: 12, backgroundColor: STATUS_COLORS[project.status] + "20",
            alignSelf: "flex-start",
          }}>
            <Text style={{ color: STATUS_COLORS[project.status], fontSize: 12, fontWeight: "600" }}>
              {STATUS_LABELS[project.status]}
            </Text>
          </View>

          {/* Title */}
          <Text style={{ fontWeight: "bold", fontSize: 22, color: colors.foreground, marginTop: 12, lineHeight: 28 }}>
            {project.title}
          </Text>

          {/* Description */}
          <Text style={{ color: colors.foreground, fontSize: 15, lineHeight: 22, marginTop: 12 }}>
            {project.description}
          </Text>

          {/* Tech Stack */}
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15, marginBottom: 8 }}>Tech Stack</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {project.techStack.map((tech) => (
                <View key={tech} style={{
                  paddingHorizontal: 10, paddingVertical: 4,
                  borderRadius: 12, backgroundColor: colors.primary + "15",
                }}>
                  <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "500" }}>{tech}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Required Skills */}
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15, marginBottom: 8 }}>Required Skills</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {project.requiredSkills.map((skill) => (
                <View key={skill} style={{
                  paddingHorizontal: 10, paddingVertical: 4,
                  borderRadius: 12, backgroundColor: colors.accent + "15",
                }}>
                  <Text style={{ color: colors.accent, fontSize: 12, fontWeight: "500" }}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Members */}
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15, marginBottom: 8 }}>
              Team Members ({project.members.length})
            </Text>
            {project.members.map((member) => (
              <Pressable
                key={member.userId}
                onPress={() => router.push(`/profile/${member.userId}` as any)}
                style={({ pressed }) => ({
                  flexDirection: "row", alignItems: "center",
                  backgroundColor: colors.surface, borderRadius: 12, padding: 12,
                  marginBottom: 6, borderWidth: 1, borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <View style={{
                  width: 36, height: 36, borderRadius: 18,
                  backgroundColor: colors.primary,
                  alignItems: "center", justifyContent: "center", marginRight: 10,
                }}>
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>{member.user.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "500", color: colors.foreground, fontSize: 14 }}>{member.user.name}</Text>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>{member.role} · Joined {new Date(member.joinedAt).toLocaleDateString()}</Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color={colors.muted} />
              </Pressable>
            ))}
          </View>

          {/* Updates */}
          {project.updates.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15, marginBottom: 8 }}>Updates</Text>
              {project.updates.map((update) => (
                <View key={update.id} style={{
                  backgroundColor: colors.surface, borderRadius: 12, padding: 14,
                  marginBottom: 8, borderWidth: 1, borderColor: colors.border,
                  borderLeftWidth: 3, borderLeftColor: colors.primary,
                }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                    <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 13 }}>{update.author.name}</Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>{new Date(update.createdAt).toLocaleDateString()}</Text>
                  </View>
                  <Text style={{ color: colors.foreground, fontSize: 14, lineHeight: 20 }}>{update.content}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Deadline */}
          {project.deadline && (
            <View style={{
              marginTop: 16, flexDirection: "row", alignItems: "center",
              backgroundColor: colors.warning + "10", borderRadius: 12, padding: 12,
            }}>
              <IconSymbol name="calendar" size={20} color={colors.warning} />
              <Text style={{ color: colors.warning, fontSize: 14, fontWeight: "500", marginLeft: 8 }}>
                Deadline: {project.deadline}
              </Text>
            </View>
          )}

          {/* GitHub Link */}
          {project.githubUrl && (
            <Pressable
              style={({ pressed }) => ({
                marginTop: 12, flexDirection: "row", alignItems: "center",
                backgroundColor: colors.foreground + "10", borderRadius: 12, padding: 12,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <IconSymbol name="link" size={20} color={colors.primary} />
              <Text style={{ color: colors.primary, fontSize: 14, fontWeight: "500", marginLeft: 8 }}>
                View on GitHub
              </Text>
            </Pressable>
          )}

          {/* Join Button */}
          {!isCreator && project.status === "open" && (
            <Pressable
              onPress={() => Alert.alert("Join Project", "Your request to join has been sent!", [{ text: "OK" }])}
              style={({ pressed }) => ({
                marginTop: 20, paddingVertical: 14, borderRadius: 12,
                backgroundColor: colors.primary, alignItems: "center",
                opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>Request to Join</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
