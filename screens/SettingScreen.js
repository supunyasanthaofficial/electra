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
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function SettingsScreen() {
  const navigation = useNavigation(); // Fixed typo from useNavigaton
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

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

    return () => {
      pulseAnim.stopAnimation();
      floatAnim.stopAnimation();
    };
  }, [floatAnim, pulseAnim]);

  const noteTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  const openPrivacyPolicy = () => {
    navigation.navigate("PrivacyPolicy");
  };

  const openTermsAndConditions = () => {
    navigation.navigate("TermsAndConditions");
  };

  const contactSupport = () => {
    navigation.navigate("ContactSupport");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <StatusBar style="light" />
      <View style={styles.glowLarge} />
      <View style={styles.glowSmall} />

      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Settings</Text>
        <Animated.Text
          style={[styles.note, { transform: [{ translateY: noteTranslate }] }]}
        >
          ♪
        </Animated.Text>
      </View>

      <Text style={styles.sectionTitle}>About</Text>
      <View style={styles.card}>
        <View style={styles.settingRow}>
          <Ionicons name="information-circle" size={22} color="#6C5CE7" />
          <Text style={styles.settingLabel}>App Version</Text>
          <Text style={styles.versionText}>1.2.0</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Legal</Text>
      <View style={styles.card}>
        <Pressable style={styles.settingRow} onPress={openPrivacyPolicy}>
          <Ionicons name="document-text" size={22} color="#6C5CE7" />
          <Text style={styles.settingLabel}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color="#6C5CE7" />
        </Pressable>

        <Pressable
          style={[styles.settingRow, { marginTop: 18 }]}
          onPress={openTermsAndConditions}
        >
          <Ionicons name="document-text" size={22} color="#6C5CE7" />
          <Text style={styles.settingLabel}>Terms & Conditions</Text>
          <Ionicons name="chevron-forward" size={20} color="#6C5CE7" />
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Support</Text>
      <View style={styles.card}>
        <Pressable style={styles.settingRow} onPress={contactSupport}>
          <Ionicons name="mail" size={22} color="#6C5CE7" />
          <Text style={styles.settingLabel}>Contact Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#6C5CE7" />
        </Pressable>
      </View>

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
  versionText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "600",
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
