// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   Pressable,
//   ScrollView,
//   Alert,
//   Linking,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { supabase } from "../utils/supabaseClient"; // Import supabase client

// export default function PlayerScreen({ route }) {
//   const { currentSong } = route.params;
//   const [showLyrics, setShowLyrics] = useState(false);
//   const [downloading, setDownloading] = useState(false);

//   const coverSource = currentSong.cover
//     ? { uri: currentSong.cover }
//     : require("../assets/images/Lisa-solo levelling.jpg");

//   const handleDownload = async () => {
//     try {
//       setDownloading(true);

//       if (currentSong.audio_path) {
//         // For Supabase Storage files
//         console.log("Generating signed URL for:", currentSong.audio_path);

//         const { data, error } = await supabase.storage
//           .from("songs") // Make sure this matches your bucket name
//           .createSignedUrl(currentSong.audio_path, 3600); // 1 hour expiry

//         if (error) {
//           console.error("Supabase storage error:", error);
//           Alert.alert("Download Error", "Failed to generate download link");
//           return;
//         }

//         if (data?.signedUrl) {
//           console.log("Opening download URL:", data.signedUrl);
//           await Linking.openURL(data.signedUrl);
//           Alert.alert("Download Started", "The download should begin shortly.");
//         }
//       } else if (currentSong.uri) {
//         // For direct URLs
//         console.log("Downloading direct URL:", currentSong.uri);
//         await Linking.openURL(currentSong.uri);
//         Alert.alert("Download Started", "The download should begin shortly.");
//       } else {
//         Alert.alert(
//           "Download not available",
//           "No download URL found for this song."
//         );
//       }
//     } catch (e) {
//       console.error("Download error:", e);
//       Alert.alert(
//         "Download Error",
//         "Cannot download this file. Please check the file URL or try again later."
//       );
//     } finally {
//       setDownloading(false);
//     }
//   };

//   // Check if download is available
//   const isDownloadAvailable = () => {
//     return currentSong.audio_path || currentSong.uri;
//   };

//   return (
//     <View style={styles.container}>
//       <Image source={coverSource} style={styles.cover} />

//       <Text style={styles.title}>{currentSong.title}</Text>
//       <Text style={styles.artist}>{currentSong.artist}</Text>

//       <View style={styles.controls}>
//         <Pressable style={styles.controlBtn}>
//           <Ionicons name="play-skip-back" size={32} color="#FFD369" />
//         </Pressable>
//         <Pressable style={[styles.controlBtn, styles.playBtn]}>
//           <Ionicons name="pause" size={40} color="#0A0D1A" />
//         </Pressable>
//         <Pressable style={styles.controlBtn}>
//           <Ionicons name="play-skip-forward" size={32} color="#FFD369" />
//         </Pressable>
//       </View>

//       <Pressable
//         onPress={() => setShowLyrics(!showLyrics)}
//         style={styles.lyricsBtn}
//       >
//         <Ionicons name="musical-notes" size={20} color="#FFD369" />
//         <Text style={styles.lyricsBtnText}>
//           {showLyrics ? "Hide Lyrics" : "Show Lyrics"}
//         </Text>
//       </Pressable>

//       {showLyrics && (
//         <ScrollView style={styles.lyricsBox}>
//           <Text style={styles.lyricsText}>
//             {currentSong.lyrics || "No lyrics available."}
//           </Text>
//         </ScrollView>
//       )}

//       {isDownloadAvailable() ? (
//         <Pressable
//           onPress={handleDownload}
//           style={styles.downloadBtn}
//           disabled={downloading}
//         >
//           {downloading ? (
//             <ActivityIndicator size="small" color="#0A0D1A" />
//           ) : (
//             <>
//               <Ionicons name="cloud-download" size={20} color="#0A0D1A" />
//               <Text style={styles.downloadText}>Download</Text>
//             </>
//           )}
//         </Pressable>
//       ) : (
//         <View style={styles.downloadDisabled}>
//           <Ionicons name="cloud-download-off" size={20} color="#666" />
//           <Text style={styles.downloadDisabledText}>
//             Download not available
//           </Text>
//         </View>
//       )}

//       {/* Debug info - remove in production */}
//       <View style={styles.debugInfo}>
//         <Text style={styles.debugText}>
//           audio_path: {currentSong.audio_path || "null"}
//         </Text>
//         <Text style={styles.debugText}>
//           uri:{" "}
//           {currentSong.uri ? currentSong.uri.substring(0, 30) + "..." : "null"}
//         </Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#0A0D1A",
//     padding: 20,
//     alignItems: "center",
//   },
//   cover: {
//     width: 260,
//     height: 260,
//     borderRadius: 16,
//     marginTop: 40,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#fff",
//     marginTop: 8,
//     textAlign: "center",
//   },
//   artist: {
//     fontSize: 16,
//     color: "rgba(255,255,255,0.6)",
//     marginBottom: 24,
//     textAlign: "center",
//   },
//   controls: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   controlBtn: {
//     marginHorizontal: 24,
//   },
//   playBtn: {
//     backgroundColor: "#FFD369",
//     borderRadius: 50,
//     padding: 16,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   lyricsBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 12,
//   },
//   lyricsBtnText: {
//     color: "#FFD369",
//     marginLeft: 6,
//     fontSize: 16,
//   },
//   lyricsBox: {
//     maxHeight: 200,
//     marginVertical: 12,
//     padding: 12,
//     backgroundColor: "rgba(255,255,255,0.06)",
//     borderRadius: 12,
//     width: "100%",
//   },
//   lyricsText: {
//     color: "#fff",
//     fontSize: 14,
//     lineHeight: 22,
//   },
//   downloadBtn: {
//     flexDirection: "row",
//     backgroundColor: "#FFD369",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 30,
//     alignItems: "center",
//     marginTop: 12,
//     minWidth: 120,
//     justifyContent: "center",
//   },
//   downloadText: {
//     color: "#0A0D1A",
//     fontWeight: "600",
//     marginLeft: 6,
//   },
//   downloadDisabled: {
//     flexDirection: "row",
//     backgroundColor: "rgba(255,255,255,0.1)",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 30,
//     alignItems: "center",
//     marginTop: 12,
//   },
//   downloadDisabledText: {
//     color: "#666",
//     fontWeight: "600",
//     marginLeft: 6,
//   },
//   debugInfo: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: "rgba(255,255,255,0.05)",
//     borderRadius: 8,
//     width: "100%",
//   },
//   debugText: {
//     color: "#888",
//     fontSize: 12,
//     fontFamily: "monospace",
//   },
// });
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import { supabase } from "../utils/supabaseClient";

export default function PlayerScreen({ route, navigation }) {
  const {
    currentSong,
    songs,
    currentIndex,
    isPlaying: initialPlaying,
    onTogglePlay,
    onPlaySong,
  } = route.params;
  const [showLyrics, setShowLyrics] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [soundObj, setSoundObj] = useState(null);
  const [currentPlaying, setCurrentPlaying] = useState(initialPlaying);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(currentIndex);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const progressInterval = useRef(null);

  const coverSource = currentSong.cover
    ? { uri: currentSong.cover }
    : require("../assets/images/Lisa-solo levelling.jpg");

  useEffect(() => {
    // Set up audio when component mounts
    setupAudio();

    return () => {
      // Clean up audio when component unmounts
      if (soundObj) {
        soundObj.unloadAsync().catch(() => {});
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentTrackIndex]);

  const setupAudio = async () => {
    try {
      if (soundObj) {
        await soundObj.unloadAsync();
      }

      const currentSong = songs[currentTrackIndex];
      if (!currentSong.uri) {
        console.warn("No audio URL for this song");
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: currentSong.uri },
        { shouldPlay: currentPlaying }
      );

      setSoundObj(sound);

      // Get duration
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis);
      }

      // Set up progress tracking
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }

      progressInterval.current = setInterval(async () => {
        if (sound && !isSeeking) {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            setPosition(status.positionMillis);
          }
        }
      }, 500);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            // Auto-play next song when current finishes
            playNext();
          }
        }
      });
    } catch (e) {
      console.warn("Audio setup error", e);
    }
  };

  const handleTogglePlay = async () => {
    if (!soundObj) return;

    if (currentPlaying) {
      await soundObj.pauseAsync();
    } else {
      await soundObj.playAsync();
    }

    setCurrentPlaying(!currentPlaying);
    if (onTogglePlay) {
      onTogglePlay();
    }
  };

  const handleSeek = async (value) => {
    if (!soundObj) return;

    setIsSeeking(true);
    setPosition(value);

    try {
      await soundObj.setPositionAsync(value);
    } catch (error) {
      console.error("Seek error:", error);
    } finally {
      setIsSeeking(false);
    }
  };

  const playPrevious = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
      setCurrentPlaying(true);
      setPosition(0);
    }
  };

  const playNext = () => {
    if (currentTrackIndex < songs.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setCurrentPlaying(true);
      setPosition(0);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const currentSong = songs[currentTrackIndex];

      if (currentSong.audio_path) {
        const { data, error } = await supabase.storage
          .from("songs")
          .createSignedUrl(currentSong.audio_path, 3600);

        if (error) {
          console.error("Supabase storage error:", error);
          Alert.alert("Download Error", "Failed to generate download link");
          return;
        }

        if (data?.signedUrl) {
          await Linking.openURL(data.signedUrl);
          Alert.alert("Download Started", "The download should begin shortly.");
        }
      } else if (currentSong.uri) {
        await Linking.openURL(currentSong.uri);
        Alert.alert("Download Started", "The download should begin shortly.");
      } else {
        Alert.alert(
          "Download not available",
          "No download URL found for this song."
        );
      }
    } catch (e) {
      console.error("Download error:", e);
      Alert.alert(
        "Download Error",
        "Cannot download this file. Please check the file URL or try again later."
      );
    } finally {
      setDownloading(false);
    }
  };

  const formatTime = (milliseconds) => {
    if (!milliseconds || isNaN(milliseconds)) return "0:00";

    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const isDownloadAvailable = () => {
    const currentSong = songs[currentTrackIndex];
    return currentSong.audio_path || currentSong.uri;
  };

  const currentSongData = songs[currentTrackIndex];

  return (
    <View style={styles.container}>
      <Image source={coverSource} style={styles.cover} />

      <Text style={styles.title}>{currentSongData.title}</Text>
      <Text style={styles.artist}>{currentSongData.artist}</Text>

      {/* Duration Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>

        <Slider
          style={styles.progressBar}
          minimumValue={0}
          maximumValue={duration || 1} // Avoid 0 value which can cause issues
          value={position}
          onValueChange={handleSeek}
          minimumTrackTintColor="#FFD369"
          maximumTrackTintColor="rgba(255,255,255,0.3)"
          thumbTintColor="#FFD369"
        />

        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      <View style={styles.controls}>
        <Pressable
          style={styles.controlBtn}
          onPress={playPrevious}
          disabled={currentTrackIndex === 0}
        >
          <Ionicons
            name="play-skip-back"
            size={32}
            color={currentTrackIndex === 0 ? "#666" : "#FFD369"}
          />
        </Pressable>

        <Pressable
          style={[styles.controlBtn, styles.playBtn]}
          onPress={handleTogglePlay}
        >
          <Ionicons
            name={currentPlaying ? "pause" : "play"}
            size={40}
            color="#0A0D1A"
          />
        </Pressable>

        <Pressable
          style={styles.controlBtn}
          onPress={playNext}
          disabled={currentTrackIndex === songs.length - 1}
        >
          <Ionicons
            name="play-skip-forward"
            size={32}
            color={currentTrackIndex === songs.length - 1 ? "#666" : "#FFD369"}
          />
        </Pressable>
      </View>

      <Text style={styles.trackInfo}>
        {currentTrackIndex + 1} of {songs.length}
      </Text>

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
          <Text style={styles.lyricsText}>
            {currentSongData.lyrics || "No lyrics available."}
          </Text>
        </ScrollView>
      )}

      {isDownloadAvailable() ? (
        <Pressable
          onPress={handleDownload}
          style={styles.downloadBtn}
          disabled={downloading}
        >
          {downloading ? (
            <ActivityIndicator size="small" color="#0A0D1A" />
          ) : (
            <>
              <Ionicons name="cloud-download" size={20} color="#0A0D1A" />
              <Text style={styles.downloadText}>Download</Text>
            </>
          )}
        </Pressable>
      ) : (
        <View style={styles.downloadDisabled}>
          <Ionicons name="cloud-download-off" size={20} color="#666" />
          <Text style={styles.downloadDisabledText}>
            Download not available
          </Text>
        </View>
      )}
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
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginTop: 8,
    textAlign: "center",
  },
  artist: {
    fontSize: 16,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 24,
    textAlign: "center",
  },
  // Progress Bar Styles
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  progressBar: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  timeText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    minWidth: 40,
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  controlBtn: {
    marginHorizontal: 24,
  },
  playBtn: {
    backgroundColor: "#FFD369",
    borderRadius: 50,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  trackInfo: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    marginBottom: 20,
  },
  lyricsBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  lyricsBtnText: {
    color: "#FFD369",
    marginLeft: 6,
    fontSize: 16,
  },
  lyricsBox: {
    maxHeight: 200,
    marginVertical: 12,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    width: "100%",
  },
  lyricsText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 22,
  },
  downloadBtn: {
    flexDirection: "row",
    backgroundColor: "#FFD369",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 12,
    minWidth: 120,
    justifyContent: "center",
  },
  downloadText: {
    color: "#0A0D1A",
    fontWeight: "600",
    marginLeft: 6,
  },
  downloadDisabled: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 12,
  },
  downloadDisabledText: {
    color: "#666",
    fontWeight: "600",
    marginLeft: 6,
  },
});
