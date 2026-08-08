import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-store";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { LinearGradient } from "expo-linear-gradient";

export default function SignupScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const colors = useColors();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const success = await register(name, email, password);
      if (success) {
        // After successful signup, go to home
        router.replace("/(tabs)" as any);
      } else {
        Alert.alert("Signup Failed", "Could not create account. Email may already be in use.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenContainer edges={["top", "left", "right"]}>
        <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1">
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

            {/* Header with Logo */}
            <Animated.View 
              entering={FadeInDown.delay(200).springify()}
              className="items-center mb-8"
            >
              <LinearGradient
                colors={[colors.primary, "#6366f1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoContainer}
              >
                <Text className="text-3xl font-bold text-white">CIE</Text>
              </LinearGradient>
              <Text className="text-3xl font-bold text-foreground mt-6">Create Account</Text>
              <Text className="text-muted mt-2 text-center">
                Join the learning community
              </Text>
            </Animated.View>

            {/* Name Input */}
            <Animated.View entering={FadeInUp.delay(300).springify()} className="mb-4">
              <Text className="text-sm font-medium text-foreground mb-2">Full Name</Text>
              <View 
                className="flex-row items-center rounded-xl px-4 py-4"
                style={{ 
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <IconSymbol name="person.fill" size={20} color={colors.muted} />
                <TextInput
                  className="flex-1 ml-3 text-foreground text-base"
                  placeholder="John Doe"
                  placeholderTextColor={colors.muted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoComplete="name"
                />
              </View>
            </Animated.View>

            {/* Email Input */}
            <Animated.View entering={FadeInUp.delay(350).springify()} className="mb-4">
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
            <Animated.View entering={FadeInUp.delay(400).springify()} className="mb-4">
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
                  placeholder="Create a password (min 6 chars)"
                  placeholderTextColor={colors.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                />
              </View>
            </Animated.View>

            {/* Confirm Password Input */}
            <Animated.View entering={FadeInUp.delay(450).springify()} className="mb-6">
              <Text className="text-sm font-medium text-foreground mb-2">Confirm Password</Text>
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
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.muted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoComplete="password"
                />
              </View>
            </Animated.View>

            {/* Signup Button */}
            <Animated.View entering={FadeInUp.delay(500).springify()}>
              <Pressable
                onPress={handleSignup}
                disabled={loading}
                style={({ pressed }) => [
                  styles.signupButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed || loading ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <Text className="text-white font-bold text-lg">
                  {loading ? "Creating Account..." : "Create Account"}
                </Text>
              </Pressable>
            </Animated.View>

            {/* Login Link */}
            <Animated.View 
              entering={FadeInUp.delay(600).springify()}
              className="items-center mt-6"
            >
              <Text className="text-muted-foreground text-sm mb-2">
                Already have an account?
              </Text>
              <Pressable
                onPress={() => router.push("/(auth)/login" as any)}
                style={({ pressed }) => ({ 
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <Text className="text-primary font-bold text-base">Log In</Text>
              </Pressable>
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
  signupButton: {
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
