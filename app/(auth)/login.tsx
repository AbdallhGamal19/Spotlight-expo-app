import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/theme";
import { styles } from "../../styles/auth.styles";

export default function Login() {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const handleGoogleLogin = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });
      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.log("login error", error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.brandSection}>
        <View style={styles.loginSection}>
          <Ionicons name="leaf" size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.appName}>Spotlight</Text>
        <Text style={styles.tagline}>don&lsquo;t miss anything</Text>
      </View>
      <View style={styles.illustrationContainer}>
        <Image
          source={require("@/assets/images/Online wishes-bro.png")}
          style={styles.illustration}
          resizeMode="cover"
        />
      </View>

      <View style={styles.loginSection}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          activeOpacity={0.9}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name="logo-google" size={20} color={COLORS.surface} />
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          By Continuing, you agree to our terms and privacy policy
        </Text>
      </View>
    </View>
  );
}
