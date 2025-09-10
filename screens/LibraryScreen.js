import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  Alert,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function LibraryScreen() {
  const navigation = useNavigation();
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef(new Audio.Sound());
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    (async () => {
      if (permissionResponse?.status !== "granted") {
        const { status } = await requestPermission();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Please allow access to your music library.",
            [{ text: "OK", onPress: () => navigation.goBack() }]
          );
          return;
        }
      }
      await loadSongs();
    })();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      soundRef.current.unloadAsync();
      pulseAnim.stopAnimation();
    };
  }, [permissionResponse]);

  const loadSongs = async () => {
    try {
      const { assets } = await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
        first: 100,
      });
      setSongs(assets);
      setFilteredSongs(assets);
    } catch (error) {
      console.error("Error loading songs:", error);
      Alert.alert("Error", "Failed to load songs.");
    }
  };

  const playSong = async (song) => {
    try {
      if (currentSong?.id === song.id && isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
        return;
      }

      if (currentSong?.id !== song.id) {
        await soundRef.current.unloadAsync();
        const { sound } = await Audio.Sound.createAsync(
          { uri: song.uri },
          { shouldPlay: true }
        );
        soundRef.current = sound;
        setCurrentSong(song);
        setIsPlaying(true);

        soundRef.current.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
            setCurrentSong(null);
          } else {
            setIsPlaying(status.isPlaying);
          }
        });
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing song:", error);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredSongs(songs);
    } else {
      const filtered = songs.filter((s) =>
        (s.filename || "").toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSongs(filtered);
    }
  };

  const renderSong = ({ item }) => (
    <TouchableOpacity
      style={styles.songItem}
      onPress={() => playSong(item)}
      activeOpacity={0.7}
    >
      <Ionicons name="musical-note" size={20} color="#6C5CE7" />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {item.filename || "Unknown Title"}
        </Text>
        <Text style={styles.songMeta}>
          {item.duration
            ? `${Math.floor(item.duration / 60)}:${Math.floor(
                item.duration % 60
              )
                .toString()
                .padStart(2, "0")}`
            : "--:--"}
        </Text>
      </View>
      {currentSong?.id === item.id && (
        <Ionicons
          name={isPlaying ? "pause-circle" : "play-circle"}
          size={28}
          color="#6C5CE7"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.glowLarge} />
      <View style={styles.glowSmall} />

      {/* 🔍 Search Bar */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={20} color="rgba(255,255,255,0.5)" />
        <TextInput
          style={styles.searchBar}
          placeholder="Search songs..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {filteredSongs.length === 0 ? (
        <Text style={styles.noSongsText}>No songs found 🎵</Text>
      ) : (
        <FlatList
          data={filteredSongs}
          renderItem={renderSong}
          keyExtractor={(item) => item.id}
          style={styles.songList}
          contentContainerStyle={{ paddingBottom: 160 }}
        />
      )}

      {/* 🎶 Mini Player */}
      {currentSong && (
        <View style={styles.player}>
          <Text style={styles.playerTitle} numberOfLines={1}>
            {currentSong.filename}
          </Text>
          <View style={styles.controls}>
            <TouchableOpacity>
              <Ionicons name="play-skip-back" size={26} color="#fff" />
            </TouchableOpacity>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => playSong(currentSong)}
              >
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={22}
                  color="#fff"
                />
              </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity>
              <Ionicons name="play-skip-forward" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 🔙 Back Button */}
      {/* <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </Animated.View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0D1A",
    alignItems: "center",
    paddingTop: 60,
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
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.9,
    backgroundColor: "#1C2240",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    marginLeft: 8,
    color: "#fff",
    fontSize: 16,
  },
  songList: {
    width: width * 0.9,
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C2240",
    padding: 14,
    borderRadius: 12,
    marginVertical: 6,
  },
  songTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  songMeta: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 2,
  },
  player: {
    position: "absolute",
    bottom: 90,
    width: width * 0.9,
    backgroundColor: "#111423",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  playerTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 12,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  playButton: {
    backgroundColor: "#6C5CE7",
    padding: 12,
    borderRadius: 50,
  },
  backButton: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6C5CE7",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    gap: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  noSongsText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    marginTop: 40,
  },
});
