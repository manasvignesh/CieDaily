import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function LandingScreen() {
  const router = useRouter();
  const colors = useColors();

  return (
    <ScreenContainer edges={["top", "left", "right"]} className="justify-center px-6">
      <View className="flex-1 justify-center items-center">
        {/* Logo */}
        <View className="w-24 h-24 rounded-3xl bg-primary items-center justify-center mb-8 shadow-xl">
          <Text className="text-4xl font-bold text-white">CIE</Text>
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-foreground mb-4 text-center">
          CIE Connect
        </Text>

        {/* Description */}
        <Text className="text-lg text-muted mb-10 text-center leading-relaxed max-w-xs">
          Discover technology. Learn together. Grow your skills.
        </Text>

        {/* Login Button */}
        <Pressable
          onPress={() => router.push("/login" as any)}
          className="w-full mb-4"
          style={({ pressed }) => ({
            backgroundColor: colors.primary,
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: "center",
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <Text className="text-white font-semibold text-lg">Log In</Text>
        </Pressable>

        {/* Sign Up Button */}
        <Pressable
          onPress={() => router.push("/signup" as any)}
          className="w-full mb-8"
          style={({ pressed }) => ({
            backgroundColor: colors.surface,
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.border,
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <Text className="text-foreground font-semibold text-lg">Create Account</Text>
        </Pressable>

        {/* Demo Hint */}
        <View className="p-4 bg-surface rounded-xl border border-border max-w-xs">
          <Text className="text-sm text-muted text-center">
            Demo: Use any email to test the app
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
