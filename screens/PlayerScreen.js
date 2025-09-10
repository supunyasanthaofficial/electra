import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PlayerScreen({ route }) {
  const { currentSong } = route.params;
  const [showLyrics, setShowLyrics] = useState(false);

  const handleDownload = async () => {
    try {
      if (currentSong.downloadUri) {
        Linking.openURL(currentSong.downloadUri);
      } else {
        Alert.alert(
          "Download not available",
          "No file URL found for this song."
        );
      }
    } catch (e) {
      Alert.alert("Error", "Something went wrong while downloading.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={currentSong.cover} style={styles.cover} />

      <Text style={styles.title}>{currentSong.title}</Text>
      <Text style={styles.artist}>{currentSong.artist}</Text>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable style={styles.controlBtn}>
          <Ionicons name="play-skip-back" size={32} color="#FFD369" />
        </Pressable>
        <Pressable style={[styles.controlBtn, styles.playBtn]}>
          <Ionicons name="pause" size={40} color="#0A0D1A" />
        </Pressable>
        <Pressable style={styles.controlBtn}>
          <Ionicons name="play-skip-forward" size={32} color="#FFD369" />
        </Pressable>
      </View>

      {/* Lyrics toggle */}
      <Pressable
        onPress={() => setShowLyrics(!showLyrics)}
        style={styles.lyricsBtn}
      >
        <Ionicons name="musical-notes" size={20} color="#FFD369" />
        <Text style={styles.lyricsBtnText}>
          {showLyrics ? "Hide Lyrics" : "Show Lyrics"}
        </Text>
      </Pressable>

      {showLyrics && (
        <ScrollView style={styles.lyricsBox}>
          <Text style={styles.lyricsText}>{currentSong.lyrics}</Text>
        </ScrollView>
      )}

      {/* Download button */}
      <Pressable onPress={handleDownload} style={styles.downloadBtn}>
        <Ionicons name="cloud-download" size={20} color="#0A0D1A" />
        <Text style={styles.downloadText}>Download</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0D1A",
    padding: 20,
    alignItems: "center",
  },
  cover: {
    width: 260,
    height: 260,
    borderRadius: 16,
    marginTop: 40,
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#fff", marginTop: 8 },
  artist: { fontSize: 16, color: "rgba(255,255,255,0.6)", marginBottom: 24 },
  controls: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  controlBtn: { marginHorizontal: 24 },
  playBtn: {
    backgroundColor: "#FFD369",
    borderRadius: 50,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  lyricsBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  lyricsBtnText: { color: "#FFD369", marginLeft: 6, fontSize: 16 },
  lyricsBox: {
    maxHeight: 200,
    marginVertical: 12,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    width: "100%",
  },
  lyricsText: { color: "#fff", fontSize: 14, lineHeight: 22 },
  downloadBtn: {
    flexDirection: "row",
    backgroundColor: "#FFD369",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 12,
  },
  downloadText: { color: "#0A0D1A", fontWeight: "600", marginLeft: 6 },
});
