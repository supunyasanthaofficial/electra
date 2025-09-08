import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MiniPlayer({
  current,
  isPlaying,
  onToggle,
  onOpen,
  onClose, // ✅ new prop
}) {
  if (!current) return null;
  const coverSource = current.cover ? current.cover : { uri: current.coverUri };

  return (
    <Pressable style={styles.container} onPress={onOpen}>
      <Image source={coverSource} style={styles.cover} />

      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>
          {current.title}
        </Text>
        <Text numberOfLines={1} style={styles.artist}>
          {current.artist}
        </Text>
      </View>

      {/* Play / Pause */}
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        style={styles.iconBtn}
      >
        <Ionicons name={isPlaying ? "pause" : "play"} size={26} color="#fff" />
      </Pressable>

      {/* Close Button */}
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          onClose && onClose();
        }}
        style={styles.iconBtn}
      >
        <Ionicons name="close" size={24} color="#fff" />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 16,
    backgroundColor: "rgba(15,16,24,0.9)",
    borderRadius: 14,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  cover: { width: 48, height: 48, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12 },
  title: { color: "#fff", fontWeight: "700" },
  artist: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
  iconBtn: {
    marginLeft: 10,
    padding: 6,
  },
});
