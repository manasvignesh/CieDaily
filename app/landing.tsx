import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-store";
import { LinearGradient } from "expo-linear-gradient";

export default function LandingScreen() {
  const router = useRouter();
  const colors = useColors();
  const { currentUser } = useAuth();

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (currentUser) {
      router.replace("/(tabs)" as any);
    }
  }, [currentUser, router]);

  return (
    <ScreenContainer edges={["top", "left", "right"]} className="justify-center">
      <View className="flex-1 justify-center items-center px-6">
        {/* Animated Logo with Gradient */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <LinearGradient
            colors={[colors.primary, "#6366f1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoContainer}
          >
            <Text className="text-5xl font-bold text-white">CIE</Text>
          </LinearGradient>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Text className="text-4xl font-bold text-foreground mb-3 text-center mt-8">
            CIE Connect
          </Text>
        </Animated.View>

        {/* Description */}
        <Animated.View 
          entering={FadeInDown.delay(300).springify()}
          className="mb-12"
        >
          <Text className="text-base text-muted text-center leading-relaxed max-w-sm px-4">
            Connect with innovators, share knowledge, and build the future of technology together
          </Text>
        </Animated.View>

        {/* Buttons Container */}
        <View className="w-full max-w-sm px-4">
          {/* Login Button */}
          <Animated.View entering={FadeInUp.delay(400).springify()}>
            <Pressable
              onPress={() => router.push("/(auth)/login" as any)}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <Text className="text-white font-bold text-lg">Log In</Text>
            </Pressable>
          </Animated.View>

          {/* Sign Up Button */}
          <Animated.View entering={FadeInUp.delay(500).springify()}>
            <Pressable
              onPress={() => router.push("/signup" as any)}
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  backgroundColor: "transparent",
                  borderWidth: 2,
                  borderColor: colors.primary,
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <Text 
                className="font-bold text-lg" 
                style={{ color: colors.primary }}
              >
                Create Account
              </Text>
            </Pressable>
          </Animated.View>
        </View>

        {/* Demo Hint with Icon */}
        <Animated.View 
          entering={FadeInUp.delay(600).springify()}
          className="mt-12"
        >
          <View 
            className="px-6 py-4 rounded-2xl"
            style={{ 
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View className="flex-row items-center">
              <View 
                className="w-2 h-2 rounded-full mr-3"
                style={{ backgroundColor: colors.primary }}
              />
              <Text className="text-sm text-muted-foreground">
                <Text className="font-semibold">Demo Mode:</Text> Use any email to explore
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Feature Pills */}
        <Animated.View 
          entering={FadeInUp.delay(700).springify()}
          className="flex-row gap-2 mt-8 flex-wrap justify-center px-4"
        >
          {["Events", "Projects", "Community", "Chat"].map((feature, index) => (
            <View
              key={feature}
              className="px-4 py-2 rounded-full"
              style={{ 
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text className="text-xs font-medium text-muted-foreground">
                {feature}
              </Text>
            </View>
          ))}
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  primaryButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
});
