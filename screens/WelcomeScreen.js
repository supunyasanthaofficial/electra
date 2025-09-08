import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Pressable,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native"; // 👈 add this

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const navigation = useNavigation(); // 👈 hook for navigation

  // Spin the vinyl
  const spinAnim = useRef(new Animated.Value(0)).current;

  // Floating note
  const floatAnim = useRef(new Animated.Value(0)).current;

  // CTA pulse
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Equalizer bars
  const bars = useMemo(
    () => new Array(5).fill(0).map(() => new Animated.Value(0)),
    []
  );

  useEffect(() => {
    // Vinyl spin (infinite)
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Floating note (up/down)
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

    // CTA pulse
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

    // Equalizer bars animate with slight offsets
    const makeBarAnim = (av, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(av, {
            toValue: 1,
            duration: 420,
            delay,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: false,
          }),
          Animated.timing(av, {
            toValue: 0,
            duration: 420,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: false,
          }),
        ])
      );

    const eqLoops = bars.map((av, i) => makeBarAnim(av, i * 90));
    eqLoops.forEach((loop) => loop.start());

    return () => {
      spinAnim.stopAnimation();
      floatAnim.stopAnimation();
      pulseAnim.stopAnimation();
      bars.forEach((b) => b.stopAnimation());
    };
  }, [bars, floatAnim, pulseAnim, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const noteTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Glow background */}
      <View style={styles.glowLarge} />
      <View style={styles.glowSmall} />

      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.appName}>Electra</Text>
        <Text style={styles.tagline}>Feel the beat. Play your world.</Text>
      </View>

      {/* Spinning vinyl */}
      <Animated.View
        style={[styles.vinylWrap, { transform: [{ rotate: spin }] }]}
      >
        <View style={styles.vinylOuter}>
          <View style={styles.vinylGroove} />
          <View style={styles.vinylGroove2} />
          <View style={styles.vinylLabel}>
            <View style={styles.vinylLabelHole} />
          </View>
        </View>
      </Animated.View>

      {/* Floating music note */}
      <Animated.Text
        style={[styles.note, { transform: [{ translateY: noteTranslate }] }]}
      >
        ♪
      </Animated.Text>

      {/* Equalizer */}
      <View style={styles.eqRow}>
        {bars.map((av, i) => {
          const h = av.interpolate({
            inputRange: [0, 1],
            outputRange: [12, 46 + (i % 2) * 10],
          });
          return (
            <Animated.View key={i} style={[styles.eqBar, { height: h }]} />
          );
        })}
      </View>

      {/* CTA Button */}
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
          onPress={() => navigation.navigate("Login")} // 👈 navigate to Home
        >
          <Text style={styles.ctaText}>Get Started</Text>
        </Pressable>
      </Animated.View>

      {/* Footer hint */}
      <Text style={styles.hint}>Tip: Press the button to continue</Text>
    </View>
  );
}

const DISC_SIZE = Math.min(width * 0.72, 320);

// Styles remain the same ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0D1A",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 72,
    paddingBottom: 44,
  },
  header: {
    alignItems: "center",
    gap: 8,
  },
  appName: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "800",
    letterSpacing: 2,
  },
  tagline: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  vinylWrap: {
    width: DISC_SIZE,
    height: DISC_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  vinylOuter: {
    width: "100%",
    height: "100%",
    borderRadius: DISC_SIZE / 2,
    backgroundColor: "#111423",
    borderWidth: 4,
    borderColor: "#1C2240",
    alignItems: "center",
    justifyContent: "center",
  },
  vinylGroove: {
    position: "absolute",
    width: "82%",
    height: "82%",
    borderRadius: (DISC_SIZE * 0.82) / 2,
    borderWidth: 2,
    borderColor: "#1D254A",
  },
  vinylGroove2: {
    position: "absolute",
    width: "64%",
    height: "64%",
    borderRadius: (DISC_SIZE * 0.64) / 2,
    borderWidth: 2,
    borderColor: "#1D254A",
  },
  vinylLabel: {
    width: "36%",
    height: "36%",
    borderRadius: (DISC_SIZE * 0.36) / 2,
    backgroundColor: "#6C5CE7",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6C5CE7",
    shadowOpacity: 0.45,
    shadowRadius: 12,
  },
  vinylLabelHole: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#0A0D1A",
  },
  note: {
    position: "absolute",
    top: "48%",
    right: "12%",
    fontSize: 28,
    color: "#B8C1FF",
  },
  eqRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    height: 60,
  },
  eqBar: {
    width: 10,
    backgroundColor: "#6C5CE7",
    borderRadius: 6,
  },
  cta: {
    backgroundColor: "#6C5CE7",
    paddingHorizontal: 28,
    paddingVertical: 14,
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
  hint: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
  },
  glowLarge: {
    position: "absolute",
    top: -120,
    left: -120,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#6C5CE7",
    opacity: 0.2,
    filter: "blur(40px)", // harmless on native; ignored
  },
  glowSmall: {
    position: "absolute",
    bottom: -80,
    right: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#00D1FF",
    opacity: 0.15,
    filter: "blur(30px)",
  },
});
