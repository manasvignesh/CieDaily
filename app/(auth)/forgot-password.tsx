import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const colors = useColors();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSendReset = () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }
    setSent(true);
    Alert.alert("Reset Link Sent", "Check your email for the password reset link.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]} className="justify-center">
      <View className="px-6">
        <View className="items-center mb-8">
          <IconSymbol name="lock.fill" size={48} color={colors.primary} />
          <Text className="text-2xl font-bold text-foreground mt-4">Forgot Password?</Text>
          <Text className="text-base text-muted mt-2 text-center">
            Enter your college email and we&apos;ll send you a reset link
          </Text>
        </View>

        {sent ? (
          <View className="items-center">
            <IconSymbol name="checkmark.circle.fill" size={64} color={colors.success} />
            <Text className="text-lg font-semibold text-foreground mt-4">Email Sent!</Text>
            <Text className="text-muted mt-2 text-center">
              Check your inbox for the password reset link.
            </Text>
          </View>
        ) : (
          <>
            <View className="mb-6">
              <Text className="text-sm font-medium text-foreground mb-2">Email</Text>
              <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 py-3">
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
            </View>

            <Pressable
              onPress={handleSendReset}
              style={({ pressed }) => ({
                backgroundColor: colors.primary,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              <Text className="text-white font-semibold text-base">Send Reset Link</Text>
            </Pressable>
          </>
        )}

        <View className="items-center mt-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-primary font-semibold">Back to Login</Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}
