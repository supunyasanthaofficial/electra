import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Animated,
  Pressable,
  Image,
} from "react-native";
import { songs } from "../data/songs";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import MiniPlayer from "../components/MiniPlayer";

export default function HomeScreen({ navigation }) {
  const [soundObj, setSoundObj] = useState(null);
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => {
      if (soundObj) {
        soundObj.unloadAsync().catch(() => {});
      }
    };
  }, [soundObj]);

  async function playSong(song) {
    try {
      if (soundObj) {
        await soundObj.stopAsync();
        await soundObj.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(song.uri, {
        shouldPlay: true,
      });

      setSoundObj(sound);
      setCurrent(song);
      setIsPlaying(true);

      // Animate current song cover
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.08,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (e) {
      console.warn("play error", e);
    }
  }

  function togglePlayPause() {
    if (!soundObj) return;
    if (isPlaying) {
      soundObj.pauseAsync();
      setIsPlaying(false);
    } else {
      soundObj.playAsync();
      setIsPlaying(true);
    }
  }

  function openPlayer() {
    if (current) {
      navigation.navigate("Player", { currentSong: current });
    }
  }

  const renderItem = ({ item }) => {
    const coverSource = item.cover ? item.cover : { uri: item.coverUri };
    const isCurrent = current?.id === item.id;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          isCurrent && styles.activeCard,
          pressed && { transform: [{ scale: 0.97 }] },
        ]}
        onPress={() => playSong(item)}
      >
        <Animated.Image
          source={coverSource}
          style={[
            styles.cover,
            isCurrent && { transform: [{ scale: scaleAnim }] },
          ]}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text numberOfLines={1} style={styles.title}>
            {item.title}
          </Text>
          <Text numberOfLines={1} style={styles.artist}>
            {item.artist}
          </Text>
        </View>
        <Ionicons
          name={isCurrent && isPlaying ? "pause-circle" : "play-circle"}
          size={36}
          color={isCurrent ? "#FFD369" : "#6C5CE7"}
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎶 Explore Songs</Text>
      <FlatList
        data={songs}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: current ? 140 : 40 }}
      />

      <MiniPlayer
        current={current}
        isPlaying={isPlaying}
        onToggle={togglePlayPause}
        onOpen={openPlayer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0D1A",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  activeCard: {
    borderWidth: 1.5,
    borderColor: "#FFD369",
    backgroundColor: "rgba(255,211,105,0.08)",
  },
  cover: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  title: { color: "#fff", fontSize: 16, fontWeight: "600" },
  artist: { color: "rgba(255,255,255,0.7)", fontSize: 13 },
});
