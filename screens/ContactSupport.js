import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

export default function ContactSupportScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = () => {
    if (!name || !email || !subject || !message) {
      Alert.alert("Missing Information", "Please fill in all fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        "Message Sent",
        "Thank you for contacting us. We'll get back to you within 24 hours.",
        [
          {
            text: "OK",
            onPress: () => {
              setName("");
              setEmail("");
              setSubject("");
              setMessage("");
            },
          },
        ]
      );
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar style="light" />
        <View style={styles.glowLarge} />
        <View style={styles.glowSmall} />

        <View style={styles.header}>
          <Text style={styles.title}>Contact Support</Text>
          <Animated.Text
            style={[
              styles.note,
              { transform: [{ translateY: noteTranslate }] },
            ]}
          >
            ♪
          </Animated.Text>
        </View>

        <Text style={styles.sectionTitle}>Get in Touch</Text>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person"
                size={20}
                color="#6C5CE7"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Your Name"
                placeholderTextColor="#B8C1FF"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail"
                size={20}
                color="#6C5CE7"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Your Email"
                placeholderTextColor="#B8C1FF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Ionicons
                name="document"
                size={20}
                color="#6C5CE7"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Subject"
                placeholderTextColor="#B8C1FF"
                value={subject}
                onChangeText={setSubject}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <Ionicons
                name="chatbubble"
                size={20}
                color="#6C5CE7"
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Your Message"
                placeholderTextColor="#B8C1FF"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                value={message}
                onChangeText={setMessage}
              />
            </View>
          </View>

          <Pressable
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Text style={styles.submitButtonText}>Sending...</Text>
            ) : (
              <>
                <Text style={styles.submitButtonText}>Send Message</Text>
                <Ionicons
                  name="send"
                  size={20}
                  color="#fff"
                  style={styles.sendIcon}
                />
              </>
            )}
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Other Options</Text>
        <View style={styles.card}>
          <View style={styles.contactOption}>
            <Ionicons name="mail" size={24} color="#6C5CE7" />
            <View style={styles.contactText}>
              <Text style={styles.contactTitle}>Email Us</Text>
              <Text style={styles.contactDetail}>support@electra.com</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.contactOption}>
            <Ionicons name="time" size={24} color="#6C5CE7" />
            <View style={styles.contactText}>
              <Text style={styles.contactTitle}>Response Time</Text>
              <Text style={styles.contactDetail}>Within 24 hours</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.contactOption}>
            <Ionicons name="help-circle" size={24} color="#6C5CE7" />
            <View style={styles.contactText}>
              <Text style={styles.contactTitle}>FAQ</Text>
              <Text style={styles.contactDetail}>
                Check our FAQ for quick answers
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🎵 We're here to help with your Electra experience
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0D1A",
  },
  scrollView: {
    flex: 1,
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
  inputGroup: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2F4D",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#1C2240",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    paddingVertical: 14,
  },
  textAreaContainer: {
    alignItems: "flex-start",
    paddingTop: 16,
  },
  textArea: {
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: "#6C5CE7",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: "#4A3FB2",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  sendIcon: {
    marginLeft: 8,
  },
  contactOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  contactText: {
    marginLeft: 16,
    flex: 1,
  },
  contactTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  contactDetail: {
    color: "#B8C1FF",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#2A2F4D",
    marginVertical: 8,
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
