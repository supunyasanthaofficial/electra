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

export default function TermsAndConditionsScreen() {
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
        <Text style={styles.title}>Terms & Conditions</Text>
        <Animated.Text
          style={[styles.note, { transform: [{ translateY: noteTranslate }] }]}
        >
          ♪
        </Animated.Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.lastUpdated}>Last updated: December 12, 2023</Text>

        <Text style={styles.intro}>
          Welcome to Electra! These Terms and Conditions govern your use of our
          mobile application and services. Please read them carefully before
          using our app.
        </Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing or using the Electra application, you agree to be bound
          by these Terms and Conditions and our Privacy Policy. If you do not
          agree to these terms, please do not use our application.
        </Text>

        <Text style={styles.sectionTitle}>2. User Accounts</Text>
        <Text style={styles.paragraph}>
          To access certain features of our app, you may be required to create
          an account. You are responsible for:
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
              Maintaining the confidentiality of your account credentials
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
              All activities that occur under your account
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
              Providing accurate and complete information
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>3. User Conduct</Text>
        <Text style={styles.paragraph}>
          You agree not to engage in any of the following prohibited activities:
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
              Violating any applicable laws or regulations
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
              Infringing upon intellectual property rights
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
              Harassing, abusing, or harming others
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
              Interfering with or disrupting the app's functionality
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
              Attempting to gain unauthorized access to our systems
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>4. Intellectual Property</Text>
        <Text style={styles.paragraph}>
          The Electra application, including its design, features, and content,
          is protected by copyright, trademark, and other laws. You may not
          copy, modify, distribute, sell, or lease any part of our services or
          included software.
        </Text>

        <Text style={styles.sectionTitle}>5. Content</Text>
        <Text style={styles.paragraph}>
          You retain all rights to any content you create, upload, or post
          through our services. By doing so, you grant us a worldwide,
          non-exclusive, royalty-free license to use, host, store, reproduce,
          modify, and display such content.
        </Text>

        <Text style={styles.sectionTitle}>6. Termination</Text>
        <Text style={styles.paragraph}>
          We may terminate or suspend your account and access to our services at
          our sole discretion, without notice, for conduct that we believe
          violates these Terms or is harmful to other users, us, or third
          parties.
        </Text>

        <Text style={styles.sectionTitle}>7. Disclaimer of Warranties</Text>
        <Text style={styles.paragraph}>
          Our services are provided "as is" without any warranties, express or
          implied. We do not guarantee that the services will be uninterrupted,
          timely, secure, or error-free.
        </Text>

        <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          To the fullest extent permitted by law, Electra shall not be liable
          for any indirect, incidental, special, consequential, or punitive
          damages resulting from your use or inability to use our services.
        </Text>

        <Text style={styles.sectionTitle}>9. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these Terms at any time. We will
          provide notice of significant changes through our application or via
          email. Continued use of our services after changes constitutes
          acceptance of the modified Terms.
        </Text>

        <Text style={styles.sectionTitle}>10. Governing Law</Text>
        <Text style={styles.paragraph}>
          These Terms shall be governed by and construed in accordance with the
          laws of the State of California, without regard to its conflict of law
          provisions.
        </Text>

        <Text style={styles.sectionTitle}>11. Contact Information</Text>
        <Text style={styles.paragraph}>
          If you have any questions about these Terms and Conditions, please
          contact us at:
        </Text>
        <View style={styles.contactInfo}>
          <Text style={styles.contactText}>Email: legal@electra.com</Text>
          <Text style={styles.contactText}>
            Address: 123 Music Street, Sound City, SC 12345
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>🎵 Thank you for using Electra</Text>
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
  intro: {
    color: "#E2E8F0",
    fontSize: 15,
    lineHeight: 22,
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
