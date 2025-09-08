import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Pressable,
  Switch,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [playbackQuality, setPlaybackQuality] = useState("Medium");

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const bars = useMemo(
    () => new Array(3).fill(0).map(() => new Animated.Value(0)),
    []
  );

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    const makeBarAnim = (av, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(av, {
            toValue: 1,
            duration: 500,
            delay,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: false,
          }),
          Animated.timing(av, {
            toValue: 0,
            duration: 500,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: false,
          }),
        ])
      );

    bars.forEach((av, i) => makeBarAnim(av, i * 100).start());

    return () => {
      pulseAnim.stopAnimation();
      floatAnim.stopAnimation();
      bars.forEach((b) => b.stopAnimation());
    };
  }, [bars, floatAnim, pulseAnim]);

  const noteTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <StatusBar style="light" />
      <View style={styles.glowLarge} />
      <View style={styles.glowSmall} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Settings</Text>
        <Animated.Text
          style={[styles.note, { transform: [{ translateY: noteTranslate }] }]}
        >
          ♪
        </Animated.Text>
      </View>

      {/* GENERAL */}
      <Text style={styles.sectionTitle}>General</Text>
      <View style={styles.card}>
        <View style={styles.settingRow}>
          <Ionicons name="moon" size={22} color="#6C5CE7" />
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: "#555", true: "#6C5CE7" }}
            thumbColor={isDarkMode ? "#fff" : "#ccc"}
          />
        </View>
      </View>

      {/* PLAYBACK */}
      <Text style={styles.sectionTitle}>Playback</Text>
      <View style={styles.card}>
        <View style={styles.settingRow}>
          <Ionicons name="volume-high" size={22} color="#6C5CE7" />
          <Text style={styles.settingLabel}>Volume Level</Text>
          <View style={styles.volRow}>
            {bars.map((av, i) => {
              const h = av.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 28 + (i % 2) * 6],
              });
              return (
                <Animated.View key={i} style={[styles.volBar, { height: h }]} />
              );
            })}
          </View>
        </View>

        <View style={[styles.settingRow, { marginTop: 18 }]}>
          <Ionicons name="speedometer" size={22} color="#6C5CE7" />
          <Text style={styles.settingLabel}>Playback Quality</Text>
          <View style={styles.qualityOptions}>
            {["Low", "Medium", "High"].map((quality) => (
              <Pressable
                key={quality}
                style={[
                  styles.qualityButton,
                  playbackQuality === quality && styles.qualityButtonActive,
                ]}
                onPress={() => setPlaybackQuality(quality)}
              >
                <Text
                  style={[
                    styles.qualityText,
                    playbackQuality === quality && styles.qualityTextActive,
                  ]}
                >
                  {quality}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🎵 Customize your Electra experience
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0D1A",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  glowLarge: {
    position: "absolute",
    top: -120,
    left: -120,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#6C5CE7",
    opacity: 0.18,
  },
  glowSmall: {
    position: "absolute",
    bottom: -80,
    right: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#00D1FF",
    opacity: 0.12,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 1,
  },
  note: {
    position: "absolute",
    right: 10,
    fontSize: 26,
    color: "#B8C1FF",
  },
  sectionTitle: {
    color: "#B8C1FF",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#15192D",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginLeft: 12,
  },
  volRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    height: 40,
  },
  volBar: {
    width: 10,
    backgroundColor: "#6C5CE7",
    borderRadius: 6,
  },
  qualityOptions: {
    flexDirection: "row",
    gap: 8,
  },
  qualityButton: {
    backgroundColor: "#1C2240",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  qualityButtonActive: {
    backgroundColor: "#6C5CE7",
  },
  qualityText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "600",
  },
  qualityTextActive: {
    color: "#fff",
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
  },
});
