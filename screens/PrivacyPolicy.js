import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

export default function PrivacyPolicyScreen() {
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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="light" />
      <View style={styles.glowLarge} />
      <View style={styles.glowSmall} />

      <View style={styles.header}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Animated.Text
          style={[styles.note, { transform: [{ translateY: noteTranslate }] }]}
        >
          ♪
        </Animated.Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.lastUpdated}>Last updated: December 12, 2023</Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          We collect information that you provide directly to us, including when
          you create an account, use our services, or contact us for support.
          This may include:
        </Text>
        <View style={styles.list}>
          <View style={styles.listItem}>
            <Ionicons
              name="ellipse"
              size={8}
              color="#6C5CE7"
              style={styles.bullet}
            />
            <Text style={styles.listText}>
              Personal information (name, email address)
            </Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons
              name="ellipse"
              size={8}
              color="#6C5CE7"
              style={styles.bullet}
            />
            <Text style={styles.listText}>Account credentials</Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons
              name="ellipse"
              size={8}
              color="#6C5CE7"
              style={styles.bullet}
            />
            <Text style={styles.listText}>Usage data and analytics</Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons
              name="ellipse"
              size={8}
              color="#6C5CE7"
              style={styles.bullet}
            />
            <Text style={styles.listText}>Device information</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect to provide, maintain, and improve
          our services, including:
        </Text>
        <View style={styles.list}>
          <View style={styles.listItem}>
            <Ionicons
              name="ellipse"
              size={8}
              color="#6C5CE7"
              style={styles.bullet}
            />
            <Text style={styles.listText}>
              Providing and personalizing our services
            </Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons
              name="ellipse"
              size={8}
              color="#6C5CE7"
              style={styles.bullet}
            />
            <Text style={styles.listText}>
              Communicating with you about updates and support
            </Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons
              name="ellipse"
              size={8}
              color="#6C5CE7"
              style={styles.bullet}
            />
            <Text style={styles.listText}>
              Analyzing and improving our services
            </Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons
              name="ellipse"
              size={8}
              color="#6C5CE7"
              style={styles.bullet}
            />
            <Text style={styles.listText}>
              Ensuring the security of our services
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>3. Data Sharing and Disclosure</Text>
        <Text style={styles.paragraph}>
          We may share your information in the following circumstances:
        </Text>
        <View style={styles.list}>
          <View style={styles.listItem}>
            <Ionicons
              name="ellipse"
              size={8}
              color="#6C5CE7"
              style={styles.bullet}
            />
            <Text style={styles.listText}>With your consent</Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons
              name="ellipse"
              size={8}
              color="#6C5CE7"
              style={styles.bullet}
            />
            <Text style={styles.listText}>
              With service providers who assist in our operations
            </Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons
              name="ellipse"
              size={8}
              color="#6C5CE7"
              style={styles.bullet}
            />
            <Text style={styles.listText}>
              To comply with legal obligations
            </Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons
              name="ellipse"
              size={8}
              color="#6C5CE7"
              style={styles.bullet}
            />
            <Text style={styles.listText}>
              To protect the rights and safety of our users
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>4. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement appropriate security measures to protect your personal
          information from unauthorized access, alteration, disclosure, or
          destruction. These measures include encryption, access controls, and
          regular security assessments.
        </Text>

        <Text style={styles.sectionTitle}>5. Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to access, correct, or delete your personal
          information. You can also object to or restrict certain processing of
          your data. To exercise these rights, please contact us at
          privacy@electra.com.
        </Text>

        <Text style={styles.sectionTitle}>6. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page and
          updating the "Last updated" date.
        </Text>

        <Text style={styles.sectionTitle}>7. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us
          at:
        </Text>
        <View style={styles.contactInfo}>
          <Text style={styles.contactText}>Email: privacy@electra.com</Text>
          <Text style={styles.contactText}>
            Address: 123 Music Street, Sound City, SC 12345
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🎵 Protecting your privacy is our priority
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0D1A",
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 60,
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
  card: {
    backgroundColor: "#15192D",
    borderRadius: 14,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    marginBottom: 16,
  },
  lastUpdated: {
    color: "#B8C1FF",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 12,
  },
  paragraph: {
    color: "#E2E8F0",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  list: {
    marginBottom: 16,
    marginLeft: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bullet: {
    marginTop: 7,
    marginRight: 12,
  },
  listText: {
    color: "#E2E8F0",
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  contactInfo: {
    backgroundColor: "#1C2240",
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  contactText: {
    color: "#E2E8F0",
    fontSize: 15,
    marginBottom: 4,
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
