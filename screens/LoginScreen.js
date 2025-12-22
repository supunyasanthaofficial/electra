// import React, { useRef, useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   Pressable,
//   Animated,
//   Easing,
//   Alert,
// } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import { useNavigation } from "@react-navigation/native";
// import { supabase } from "../utils/supabaseClient";

// export default function LoginScreen() {
//   const navigation = useNavigation();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const noteAnim = useRef(new Animated.Value(0)).current;

//   const pulseAnim = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(noteAnim, {
//           toValue: 1,
//           duration: 1600,
//           easing: Easing.inOut(Easing.quad),
//           useNativeDriver: true,
//         }),
//         Animated.timing(noteAnim, {
//           toValue: 0,
//           duration: 1600,
//           easing: Easing.inOut(Easing.quad),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.06,
//           duration: 900,
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1.0,
//           duration: 900,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, [noteAnim, pulseAnim]);

//   const noteTranslate = noteAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -12],
//   });

//   const handleLogin = async () => {
//     setLoading(true);
//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     setLoading(false);

//     if (error) {
//       Alert.alert("Error", error.message);
//     } else {
//       navigation.navigate("Home");
//     }
//   };

//   const handleSignup = async () => {
//     setLoading(true);
//     const { error } = await supabase.auth.signUp({
//       email,
//       password,
//     });

//     setLoading(false);

//     if (error) {
//       Alert.alert("Error", error.message);
//     } else {
//       Alert.alert(
//         "Success",
//         "Account created! Please check your email to verify."
//       );
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar style="light" />

//       <Animated.Text
//         style={[styles.note, { transform: [{ translateY: noteTranslate }] }]}
//       >
//         ♪
//       </Animated.Text>

//       <Text style={styles.appName}>Electra</Text>
//       <Text style={styles.tagline}>Login to start the beat</Text>

//       <View style={styles.form}>
//         <TextInput
//           placeholder="Email"
//           placeholderTextColor="rgba(255,255,255,0.6)"
//           style={styles.input}
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//         <TextInput
//           placeholder="Password"
//           placeholderTextColor="rgba(255,255,255,0.6)"
//           secureTextEntry
//           style={styles.input}
//           value={password}
//           onChangeText={setPassword}
//           autoCapitalize="none"
//         />
//       </View>

//       <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
//         <Pressable
//           style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
//           onPress={handleLogin}
//           disabled={loading}
//         >
//           <Text style={styles.ctaText}>{loading ? "Loading..." : "Login"}</Text>
//         </Pressable>
//       </Animated.View>

//       <Pressable onPress={handleSignup} disabled={loading}>
//         {/* <Text style={styles.footerText}>
//           Don’t have an account?{" "}
//           <Text style={{ color: "#6C5CE7" }}>Sign up</Text>
//         </Text> */}
//       </Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#0A0D1A",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 24,
//   },
//   note: {
//     position: "absolute",
//     top: 80,
//     fontSize: 30,
//     color: "#B8C1FF",
//   },
//   appName: {
//     color: "#fff",
//     fontSize: 42,
//     fontWeight: "800",
//     letterSpacing: 2,
//     marginBottom: 4,
//   },
//   tagline: {
//     color: "rgba(255,255,255,0.7)",
//     fontSize: 14,
//     marginBottom: 40,
//   },
//   form: {
//     width: "100%",
//     marginBottom: 30,
//   },
//   input: {
//     width: "100%",
//     backgroundColor: "rgba(255,255,255,0.08)",
//     color: "#fff",
//     padding: 14,
//     borderRadius: 12,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.15)",
//   },
//   cta: {
//     backgroundColor: "#6C5CE7",
//     paddingHorizontal: 80,
//     paddingVertical: 16,
//     borderRadius: 999,
//     shadowColor: "#6C5CE7",
//     shadowOpacity: 0.6,
//     shadowRadius: 16,
//     shadowOffset: { width: 0, height: 8 },
//   },
//   ctaText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "700",
//     letterSpacing: 0.6,
//   },
//   footerText: {
//     marginTop: 30,
//     color: "rgba(255,255,255,0.6)",
//     fontSize: 14,
//   },
// });
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Animated,
  Easing,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../utils/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const noteAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Login Failed", error.message);
    } else {
      // Store user info
      await storeUserInfo(data.user);
      navigation.navigate("Home");
    }
  };

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Signup Failed", error.message);
    } else {
      if (data.user) {
        await storeUserInfo(data.user);
      }
      Alert.alert(
        "Success",
        "Account created! Please check your email to verify."
      );
    }
  };

  const storeUserInfo = async (user) => {
    try {
      await AsyncStorage.setItem("user_email", user.email);
      await AsyncStorage.setItem("user_id", user.id);
    } catch (error) {
      console.error("Error storing user info:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Animated.Text
        style={[styles.note, { transform: [{ translateY: noteTranslate }] }]}
      >
        ♪
      </Animated.Text>

      <Text style={styles.appName}>Electra</Text>
      <Text style={styles.tagline}>Login to start the beat</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="rgba(255,255,255,0.6)"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="rgba(255,255,255,0.6)"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoComplete="password"
        />
      </View>

      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.ctaText}>{loading ? "Loading..." : "Login"}</Text>
        </Pressable>
      </Animated.View>

      <Pressable
        onPress={handleSignup}
        disabled={loading}
        style={{ marginTop: 16 }}
      >
        <Text style={styles.footerText}>
          Don't have an account?{" "}
          <Text style={{ color: "#6C5CE7", fontWeight: "600" }}>Sign up</Text>
        </Text>
      </Pressable>
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
    fontSize: 16,
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
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
  },
});
