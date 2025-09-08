import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();

  // Floating music note
  const noteAnim = useRef(new Animated.Value(0)).current;

  // Button pulse
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Floating note animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(noteAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(noteAnim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Button pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [noteAnim, pulseAnim]);

  const noteTranslate = noteAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Floating music note */}
      <Animated.Text
        style={[styles.note, { transform: [{ translateY: noteTranslate }] }]}
      >
        ♪
      </Animated.Text>

      {/* Title */}
      <Text style={styles.appName}>Electra</Text>
      <Text style={styles.tagline}>Login to start the beat</Text>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="rgba(255,255,255,0.6)"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="rgba(255,255,255,0.6)"
          secureTextEntry
          style={styles.input}
        />
      </View>

      {/* CTA */}
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.ctaText}>Login</Text>
        </Pressable>
      </Animated.View>

      {/* Footer */}
      <Text style={styles.footerText}>
        Don’t have an account? <Text style={{ color: "#6C5CE7" }}>Sign up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0D1A",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  note: {
    position: "absolute",
    top: 80,
    fontSize: 30,
    color: "#B8C1FF",
  },
  appName: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 4,
  },
  tagline: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginBottom: 40,
  },
  form: {
    width: "100%",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  cta: {
    backgroundColor: "#6C5CE7",
    paddingHorizontal: 80,
    paddingVertical: 16,
    borderRadius: 999,
    shadowColor: "#6C5CE7",
    shadowOpacity: 0.6,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  footerText: {
    marginTop: 30,
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
  },
});
