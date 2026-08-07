import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useStore();
  const colors = useColors();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        // After successful login, replace with home to prevent going back
        router.replace("/(tabs)" as any);
      } else {
        Alert.alert("Login Failed", "Invalid credentials or email not verified. Please register or check your email.");
      }
    } catch {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Simulate Google sign-in with a demo account
    setLoading(true);
    const success = await login("rahul@college.edu", "password");
    if (success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Error", "Google sign-in temporarily unavailable");
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenContainer edges={["top", "left", "right"]} className="justify-center">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }} keyboardShouldPersistTaps="handled">
          <View className="pb-6">
            {/* Back Button */}
            <Animated.View entering={FadeInDown.delay(100).springify()}>
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.6 : 1,
                  marginBottom: 20,
                })}
              >
                <View className="flex-row items-center">
                  <IconSymbol name="chevron.left" size={24} color={colors.primary} />
                  <Text className="text-primary font-semibold ml-1">Back</Text>
                </View>
              </Pressable>
            </Animated.View>

            {/* Logo and Title */}
            <Animated.View 
              entering={FadeInDown.delay(200).springify()}
              className="items-center mb-10"
            >
              <LinearGradient
                colors={[colors.primary, "#6366f1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoContainer}
              >
                <Text className="text-3xl font-bold text-white">CIE</Text>
              </LinearGradient>
              <Text className="text-3xl font-bold text-foreground mt-6">Welcome Back</Text>
              <Text className="text-base text-muted-foreground mt-2 text-center">
                Log in to continue your learning journey
              </Text>
            </Animated.View>

            {/* Email Input */}
            <Animated.View entering={FadeInUp.delay(300).springify()} className="mb-4">
              <Text className="text-sm font-medium text-foreground mb-2">Email</Text>
              <View 
                className="flex-row items-center rounded-xl px-4 py-4"
                style={{ 
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <IconSymbol name="envelope.fill" size={20} color={colors.muted} />
                <TextInput
                  className="flex-1 ml-3 text-foreground text-base"
                  placeholder="your@college.edu"
                  placeholderTextColor={colors.muted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </Animated.View>

            {/* Password Input */}
            <Animated.View entering={FadeInUp.delay(350).springify()} className="mb-4">
              <Text className="text-sm font-medium text-foreground mb-2">Password</Text>
              <View 
                className="flex-row items-center rounded-xl px-4 py-4"
                style={{ 
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <IconSymbol name="lock.fill" size={20} color={colors.muted} />
                <TextInput
                  className="flex-1 ml-3 text-foreground text-base"
                  placeholder="Enter your password"
                  placeholderTextColor={colors.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <IconSymbol
                    name={showPassword ? "eye.slash.fill" : "eye.fill"}
                    size={20}
                    color={colors.muted}
                  />
                </Pressable>
              </View>
            </Animated.View>

            {/* Forgot Password */}
            <Animated.View 
              entering={FadeInUp.delay(400).springify()}
              className="items-end mb-6"
            >
              <Pressable onPress={() => router.push({ pathname: "/(auth)/forgot-password" } as any)}>
                <Text className="text-sm text-primary font-medium">Forgot Password?</Text>
              </Pressable>
            </Animated.View>

            {/* Login Button */}
            <Animated.View entering={FadeInUp.delay(450).springify()}>
              <Pressable
                onPress={handleLogin}
                disabled={loading}
                style={({ pressed }) => [
                  styles.loginButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed || loading ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <Text className="text-white font-bold text-lg">
                  {loading ? "Logging in..." : "Log In"}
                </Text>
              </Pressable>
            </Animated.View>

            {/* Divider */}
            <Animated.View 
              entering={FadeInUp.delay(500).springify()}
              className="flex-row items-center my-6"
            >
              <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
              <Text className="mx-4 text-sm text-muted-foreground">or</Text>
              <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
            </Animated.View>

            {/* Google Sign In */}
            <Animated.View entering={FadeInUp.delay(550).springify()}>
              <Pressable
                onPress={handleGoogleSignIn}
                disabled={loading}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.surface,
                  paddingVertical: 16,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: colors.border,
                  opacity: pressed || loading ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
              >
                <Text className="text-lg mr-3">🔍</Text>
                <Text className="text-foreground font-semibold">Continue with Google</Text>
              </Pressable>
            </Animated.View>

            {/* Register Link */}
            <Animated.View 
              entering={FadeInUp.delay(600).springify()}
              className="items-center mt-6"
            >
              <Text className="text-muted-foreground text-sm mb-2">
                Don't have an account?
              </Text>
              <Pressable
                onPress={() => router.push("/signup" as any)}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                <Text className="text-primary font-bold text-base">Create Account</Text>
              </Pressable>
            </Animated.View>

            {/* Demo hint */}
            <Animated.View 
              entering={FadeInUp.delay(700).springify()}
              className="mt-8 p-4 rounded-2xl"
              style={{ 
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View className="flex-row items-center mb-2">
                <View 
                  className="w-2 h-2 rounded-full mr-3"
                  style={{ backgroundColor: colors.primary }}
                />
                <Text className="text-sm font-semibold text-foreground">Demo Mode</Text>
              </View>
              <Text className="text-xs text-muted-foreground">
                Use any @gmail.com for User Dashboard or @mlrit.ac.in for Admin Dashboard
              </Text>
            </Animated.View>
          </View>
        </ScrollView>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  loginButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});
