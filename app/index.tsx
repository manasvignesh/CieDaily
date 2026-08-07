import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useStore } from "@/lib/store";

export default function Index() {
  const router = useRouter();
  const { currentUser } = useStore();

  useEffect(() => {
    // Redirect based on auth state
    if (currentUser) {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/landing");
    }
  }, [currentUser, router]);

  return null;
}
