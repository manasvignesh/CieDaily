import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useStore();
  const colors = useColors();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (e: string) => {
    if (!e.includes("@") || !e.includes(".")) return "Please enter a valid email address";
    const domain = e.split("@")[1];
    if (domain && domain !== "gmail.com" && domain !== "mlrit.ac.in") return "Please use a valid @gmail.com or @mlrit.ac.in email address";
    return null;
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    const emailError = validateEmail(email);
    if (emailError) {
      Alert.alert("Invalid Email", emailError);
      return;
    }
    if (password.length < 8) {
      Alert.alert("Weak Password", "Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const success = await register(name, email, password);
      if (success) {
        const domain = email.split("@")[1];
        const dest = domain === "mlrit.ac.in" ? "/admin" : "/(tabs)";
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => router.replace(dest as any) },
        ]);
      } else {
        Alert.alert("Error", "Registration failed. Please try again.");
      }
    } catch {
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
      <ScreenContainer edges={["top", "left", "right"]} className="justify-center">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} keyboardShouldPersistTaps="handled">
          <View className="px-6 pb-6">
            {/* Title */}
            <View className="items-center mb-8">
              <Text className="text-3xl font-bold text-foreground">Create Account</Text>
              <Text className="text-base text-muted mt-2 text-center">
                Join the technology community at your college
              </Text>
            </View>

            {/* Name Input */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-foreground mb-2">Full Name</Text>
              <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 py-3">
                <IconSymbol name="person.fill" size={20} color={colors.muted} />
                <TextInput
                  className="flex-1 ml-3 text-foreground text-base"
                  placeholder="Your full name"
                  placeholderTextColor={colors.muted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-foreground mb-2">College Email</Text>
              <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 py-3">
                <IconSymbol name="envelope.fill" size={20} color={colors.muted} />
                <TextInput
                  className="flex-1 ml-3 text-foreground text-base"
                  placeholder="your@gmail.com or @mlrit.ac.in"
                  placeholderTextColor={colors.muted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              <Text className="text-xs text-muted mt-1 ml-1">Enter @gmail.com for User or @mlrit.ac.in for Admin</Text>
            </View>

            {/* Password Input */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-foreground mb-2">Password</Text>
              <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 py-3">
                <IconSymbol name="lock.fill" size={20} color={colors.muted} />
                <TextInput
                  className="flex-1 ml-3 text-foreground text-base"
                  placeholder="Min. 8 characters"
                  placeholderTextColor={colors.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <IconSymbol
                    name={showPassword ? "eye.slash.fill" : "eye.fill"}
                    size={20}
                    color={colors.muted}
                  />
                </Pressable>
              </View>
            </View>

            {/* Confirm Password */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-foreground mb-2">Confirm Password</Text>
              <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 py-3">
                <IconSymbol name="lock.fill" size={20} color={colors.muted} />
                <TextInput
                  className="flex-1 ml-3 text-foreground text-base"
                  placeholder="Re-enter password"
                  placeholderTextColor={colors.muted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Register Button */}
            <Pressable
              onPress={handleRegister}
              disabled={loading}
              style={({ pressed }) => ({
                backgroundColor: colors.primary,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              <Text className="text-white font-semibold text-base">
                {loading ? "Creating Account..." : "Create Account"}
              </Text>
            </Pressable>

            {/* Login Link */}
            <View className="items-center mt-6">
              <Text className="text-muted text-sm">
                Already have an account?{" "}
                <Text className="text-primary font-semibold">Log In</Text>
              </Text>
              <Pressable onPress={() => router.back()} className="mt-1">
                <Text className="text-primary font-semibold text-sm">Back to Login</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
