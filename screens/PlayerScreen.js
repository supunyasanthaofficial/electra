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
  Modal,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import { supabase } from "../utils/supabaseClient";
import { updateNotification } from "../service/notifictionService.js";

export default function PlayerScreen({ route, navigation }) {
  const {
    currentSong,
    songs,
    currentIndex,
    isPlaying: initialPlaying,
    onTogglePlay,
    onPlaySong,
    onNext,
    onPrevious,
  } = route.params;
  const [showLyrics, setShowLyrics] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [soundObj, setSoundObj] = useState(null);
  const [currentPlaying, setCurrentPlaying] = useState(initialPlaying);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(currentIndex);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [equalizerSettings, setEqualizerSettings] = useState({
    bass: 0,
    mid: 0,
    treble: 0,
  });
  const [selectedPreset, setSelectedPreset] = useState("default");
  const progressInterval = useRef(null);

  // Equalizer presets
  const equalizerPresets = {
    default: { bass: 0, mid: 0, treble: 0, label: "Default" },
    bassBoost: { bass: 8, mid: 2, treble: 1, label: "Bass Boost" },
    trebleBoost: { bass: 1, mid: 3, treble: 8, label: "Treble Boost" },
    vocal: { bass: 2, mid: 7, treble: 4, label: "Vocal Enhancer" },
    flat: { bass: 0, mid: 0, treble: 0, label: "Flat" },
    rock: { bass: 6, mid: 5, treble: 4, label: "Rock" },
    jazz: { bass: 4, mid: 5, treble: 3, label: "Jazz" },
    classical: { bass: 3, mid: 4, treble: 6, label: "Classical" },
  };

  const currentSongData = songs[currentTrackIndex];
  const coverSource = currentSongData.cover
    ? { uri: currentSongData.cover }
    : require("../assets/images/Lisa-solo levelling.jpg");

  useEffect(() => {
    setupAudio();
    return () => {
      if (soundObj) {
        soundObj.unloadAsync().catch(() => {});
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    applyEqualizerSettings();
  }, [equalizerSettings, soundObj]);

  const setupAudio = async () => {
    try {
      if (soundObj) {
        await soundObj.unloadAsync();
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

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

      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis);
      }

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
            playNext();
          }
        }
      });
    } catch (e) {
      console.warn("Audio setup error", e);
    }
  };

  const applyEqualizerSettings = async () => {
    if (!soundObj) return;

    try {
      // Note: Expo-AV doesn't have built-in equalizer support
      // This is a placeholder for where you would implement equalizer functionality
      // You might need to use a different library or native module for full equalizer support

      console.log("Applying equalizer settings:", equalizerSettings);
      // In a real implementation, you would apply these settings to your audio
      // For example, using something like:
      // await soundObj.setRate(1.0, true, equalizerSettings.bass / 10);
    } catch (error) {
      console.error("Error applying equalizer settings:", error);
    }
  };

  const handleTogglePlay = async () => {
    if (!soundObj) return;

    try {
      if (currentPlaying) {
        await soundObj.pauseAsync();
        await updateNotification(false, currentSongData);
      } else {
        await soundObj.playAsync();
        await updateNotification(true, currentSongData);
      }

      setCurrentPlaying(!currentPlaying);
      if (onTogglePlay) {
        onTogglePlay();
      }
    } catch (error) {
      console.error("Error toggling play/pause:", error);
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

  const playPrevious = async () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
      setCurrentPlaying(true);
      setPosition(0);

      await updateNotification(true, songs[currentTrackIndex - 1]);
    }
  };

  const playNext = async () => {
    if (currentTrackIndex < songs.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setCurrentPlaying(true);
      setPosition(0);

      await updateNotification(true, songs[currentTrackIndex + 1]);
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

  const applyPreset = (presetName) => {
    const preset = equalizerPresets[presetName];
    if (preset) {
      setEqualizerSettings({
        bass: preset.bass,
        mid: preset.mid,
        treble: preset.treble,
      });
      setSelectedPreset(presetName);
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

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Image source={coverSource} style={styles.cover} />

        <Text style={styles.title}>{currentSongData.title}</Text>
        <Text style={styles.artist}>{currentSongData.artist}</Text>

        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>

          <Slider
            style={styles.progressBar}
            minimumValue={0}
            maximumValue={duration || 1}
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
              color={
                currentTrackIndex === songs.length - 1 ? "#666" : "#FFD369"
              }
            />
          </Pressable>
        </View>

        <Text style={styles.trackInfo}>
          {currentTrackIndex + 1} of {songs.length}
        </Text>

        <View style={styles.actionButtons}>
          <Pressable
            onPress={() => setShowLyrics(!showLyrics)}
            style={styles.actionBtn}
          >
            <Ionicons name="musical-notes" size={20} color="#FFD369" />
            <Text style={styles.actionBtnText}>
              {showLyrics ? "Hide Lyrics" : "Show Lyrics"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setShowEqualizer(true)}
            style={styles.actionBtn}
          >
            <Ionicons name="options" size={20} color="#FFD369" />
            <Text style={styles.actionBtnText}>Equalizer</Text>
          </Pressable>
        </View>

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

        {/* Equalizer Modal */}
        <Modal
          visible={showEqualizer}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowEqualizer(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.equalizerContainer}>
              <View style={styles.equalizerHeader}>
                <Text style={styles.equalizerTitle}>Equalizer Presets</Text>
                <Pressable onPress={() => setShowEqualizer(false)}>
                  <Ionicons name="close" size={24} color="#FFF" />
                </Pressable>
              </View>

              <ScrollView style={styles.presetsContainer}>
                {Object.keys(equalizerPresets).map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.presetItem,
                      selectedPreset === key && styles.selectedPreset,
                    ]}
                    onPress={() => applyPreset(key)}
                  >
                    <Text style={styles.presetText}>
                      {equalizerPresets[key].label}
                    </Text>
                    {selectedPreset === key && (
                      <Ionicons name="checkmark" size={20} color="#FFD369" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.equalizerSliders}>
                <Text style={styles.sliderLabel}>
                  Bass: {equalizerSettings.bass}
                </Text>
                <Slider
                  minimumValue={-10}
                  maximumValue={10}
                  value={equalizerSettings.bass}
                  onValueChange={(value) =>
                    setEqualizerSettings({ ...equalizerSettings, bass: value })
                  }
                  minimumTrackTintColor="#FFD369"
                  maximumTrackTintColor="rgba(255,255,255,0.3)"
                  thumbTintColor="#FFD369"
                />

                <Text style={styles.sliderLabel}>
                  Mid: {equalizerSettings.mid}
                </Text>
                <Slider
                  minimumValue={-10}
                  maximumValue={10}
                  value={equalizerSettings.mid}
                  onValueChange={(value) =>
                    setEqualizerSettings({ ...equalizerSettings, mid: value })
                  }
                  minimumTrackTintColor="#FFD369"
                  maximumTrackTintColor="rgba(255,255,255,0.3)"
                  thumbTintColor="#FFD369"
                />

                <Text style={styles.sliderLabel}>
                  Treble: {equalizerSettings.treble}
                </Text>
                <Slider
                  minimumValue={-10}
                  maximumValue={10}
                  value={equalizerSettings.treble}
                  onValueChange={(value) =>
                    setEqualizerSettings({
                      ...equalizerSettings,
                      treble: value,
                    })
                  }
                  minimumTrackTintColor="#FFD369"
                  maximumTrackTintColor="rgba(255,255,255,0.3)"
                  thumbTintColor="#FFD369"
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#0A0D1A",
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 20,
  },
  container: {
    width: "100%",
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
  },
  actionBtnText: {
    color: "#FFD369",
    marginLeft: 6,
    fontSize: 14,
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
  // Equalizer styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  equalizerContainer: {
    backgroundColor: "#1A1F36",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  equalizerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  equalizerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  presetsContainer: {
    maxHeight: 150,
    marginBottom: 20,
  },
  presetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  selectedPreset: {
    backgroundColor: "rgba(255,211,105,0.2)",
  },
  presetText: {
    color: "#FFF",
    fontSize: 16,
  },
  equalizerSliders: {
    marginTop: 10,
  },
  sliderLabel: {
    color: "#FFF",
    marginBottom: 5,
  },
});
