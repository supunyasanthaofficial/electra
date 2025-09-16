// import React from "react";
// import { View, Text, StyleSheet, Pressable, Image } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// export default function MiniPlayer({
//   current,
//   isPlaying,
//   onToggle,
//   onOpen,
//   onClose,
// }) {
//   if (!current) return null;

//   const coverSource = current.cover
//     ? { uri: current.cover }
//     : require("../assets/images/Lisa-solo levelling.jpg");

//   const handleClose = (e) => {
//     e.stopPropagation();
//     if (onClose) {
//       onClose();
//     }
//   };

//   return (
//     <Pressable style={styles.container} onPress={onOpen}>
//       <Image source={coverSource} style={styles.cover} />
//       <View style={styles.info}>
//         <Text numberOfLines={1} style={styles.title}>
//           {current.title}
//         </Text>
//         <Text numberOfLines={1} style={styles.artist}>
//           {current.artist}
//         </Text>
//       </View>

//       <Pressable
//         onPress={(e) => {
//           e.stopPropagation();
//           onToggle();
//         }}
//         style={styles.iconBtn}
//       >
//         <Ionicons name={isPlaying ? "pause" : "play"} size={26} color="#fff" />
//       </Pressable>

//       <Pressable onPress={handleClose} style={styles.iconBtn}>
//         <Ionicons name="close" size={24} color="#fff" />
//       </Pressable>
//     </Pressable>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//     left: 12,
//     right: 12,
//     bottom: 16,
//     backgroundColor: "rgba(15,16,24,0.9)",
//     borderRadius: 14,
//     padding: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     elevation: 6,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   cover: { width: 48, height: 48, borderRadius: 8 },
//   info: { flex: 1, marginLeft: 12 },
//   title: { color: "#fff", fontWeight: "700", fontSize: 14 },
//   artist: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 },
//   iconBtn: {
//     marginLeft: 10,
//     padding: 6,
//     borderRadius: 20,
//     backgroundColor: "rgba(255,255,255,0.1)",
//   },
// });
import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MiniPlayer({
  current,
  isPlaying,
  onToggle,
  onOpen,
  onClose,
  onNext,
  onPrevious,
}) {
  if (!current) return null;

  const coverSource = current.cover
    ? { uri: current.cover }
    : require("../assets/images/Lisa-solo levelling.jpg");

  const handleClose = (e) => {
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (onNext) {
      onNext();
    }
  };

  const handlePrevious = (e) => {
    e.stopPropagation();
    if (onPrevious) {
      onPrevious();
    }
  };

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

      <View style={styles.controls}>
        <Pressable onPress={handlePrevious} style={styles.iconBtn}>
          <Ionicons name="play-skip-back" size={20} color="#fff" />
        </Pressable>

        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          style={styles.iconBtn}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={26}
            color="#fff"
          />
        </Pressable>

        <Pressable onPress={handleNext} style={styles.iconBtn}>
          <Ionicons name="play-skip-forward" size={20} color="#fff" />
        </Pressable>

        <Pressable onPress={handleClose} style={styles.iconBtn}>
          <Ionicons name="close" size={24} color="#fff" />
        </Pressable>
      </View>
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cover: { width: 48, height: 48, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12 },
  title: { color: "#fff", fontWeight: "700", fontSize: 14 },
  artist: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    marginLeft: 10,
    padding: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
});
