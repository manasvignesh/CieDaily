import { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { type Project } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  open: "#3B82F6",
  in_progress: "#F59E0B",
  completed: "#10B981",
};

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  completed: "Completed",
};

function ProjectCard({ project }: { project: Project }) {
  const colors = useColors();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/project/${project.id}` as any)}
      style={({ pressed }) => ({
        backgroundColor: colors.surface, borderRadius: 16, padding: 16,
        marginBottom: 10, borderWidth: 1, borderColor: colors.border,
        opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "600", fontSize: 16, color: colors.foreground }}>{project.title}</Text>
          <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4, lineHeight: 18 }} numberOfLines={2}>
            {project.description}
          </Text>
        </View>
        <View style={{
          paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12,
          backgroundColor: STATUS_COLORS[project.status] + "20", marginLeft: 8,
        }}>
          <Text style={{ color: STATUS_COLORS[project.status], fontSize: 11, fontWeight: "600" }}>
            {STATUS_LABELS[project.status]}
          </Text>
        </View>
      </View>

      {/* Tech Stack */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 10 }}>
        {project.techStack.slice(0, 4).map((tech) => (
          <View key={tech} style={{
            paddingHorizontal: 8, paddingVertical: 3,
            borderRadius: 10, backgroundColor: colors.primary + "15",
          }}>
            <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "500" }}>{tech}</Text>
          </View>
        ))}
        {project.techStack.length > 4 && (
          <View style={{ paddingHorizontal: 8, paddingVertical: 3 }}>
            <Text style={{ color: colors.muted, fontSize: 11 }}>+{project.techStack.length - 4}</Text>
          </View>
        )}
      </View>

      {/* Members */}
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
        <View style={{ flexDirection: "row", marginRight: 8 }}>
          {project.members.slice(0, 3).map((member, i) => (
            <View key={member.userId} style={{
              width: 28, height: 28, borderRadius: 14,
              backgroundColor: colors.primary,
              alignItems: "center", justifyContent: "center",
              marginLeft: i > 0 ? -8 : 0,
              borderWidth: 2, borderColor: colors.surface,
            }}>
              <Text style={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}>
                {member.user.name.charAt(0)}
              </Text>
            </View>
          ))}
        </View>
        <Text style={{ color: colors.muted, fontSize: 12 }}>
          {project.members.length} member{project.members.length !== 1 ? "s" : ""}
        </Text>
        {project.githubUrl && (
          <View style={{ marginLeft: "auto", flexDirection: "row", alignItems: "center" }}>
            <IconSymbol name="link" size={14} color={colors.muted} />
            <Text style={{ color: colors.muted, fontSize: 12, marginLeft: 2 }}>GitHub</Text>
          </View>
        )}
      </View>

      {project.deadline && (
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
          <IconSymbol name="calendar" size={12} color={colors.muted} />
          <Text style={{ color: colors.muted, fontSize: 12, marginLeft: 4 }}>Deadline: {project.deadline}</Text>
        </View>
      )}
    </Pressable>
  );
}

export default function ProjectsScreen() {
  const router = useRouter();
  const { projects } = useStore();
  const colors = useColors();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = projects.filter((p) => {
    const matchesFilter = filter === "all" || p.status === filter;
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
        <Text style={{ fontWeight: "600", fontSize: 16, color: colors.foreground }}>Projects</Text>
        <Pressable onPress={() => {}} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
          <Text style={{ color: colors.primary, fontSize: 14, fontWeight: "500" }}>New</Text>
        </Pressable>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <View style={{
          flexDirection: "row", alignItems: "center",
          backgroundColor: colors.surface, borderRadius: 12,
          paddingHorizontal: 12, paddingVertical: 10,
          borderWidth: 1, borderColor: colors.border,
        }}>
          <IconSymbol name="magnifyingglass" size={18} color={colors.muted} />
          <TextInput
            placeholder="Search projects..."
            placeholderTextColor={colors.muted}
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, marginLeft: 8, color: colors.foreground, fontSize: 14 }}
          />
        </View>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16, paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {["all", "open", "in_progress", "completed"].map((status) => (
            <Pressable
              key={status}
              onPress={() => setFilter(status)}
              style={({ pressed }) => ({
                paddingHorizontal: 14, paddingVertical: 6,
                borderRadius: 14,
                backgroundColor: filter === status ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: filter === status ? colors.primary : colors.border,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{
                fontSize: 12, fontWeight: "600", textTransform: "capitalize",
                color: filter === status ? "#fff" : colors.foreground,
              }}>{status === "all" ? "All" : STATUS_LABELS[status]}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Projects List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {filtered.length > 0 ? (
          filtered.map((project) => <ProjectCard key={project.id} project={project} />)
        ) : (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <IconSymbol name={"folder" as any} size={48} color={colors.muted} />
            <Text style={{ color: colors.muted, fontSize: 16, marginTop: 12 }}>No projects found</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
