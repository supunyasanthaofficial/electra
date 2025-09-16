import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Animated,
  Pressable,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import MiniPlayer from "../components/MiniPlayer";
import { fetchSongs } from "../data/fetchSongs";
import AudioBackgroundHandler from "../components/AudioBackgroundHandler";
import {
  registerForPushNotificationsAsync,
  updateNotification,
} from "../service/notifictionService.js";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {
  const [soundObj, setSoundObj] = useState(null);
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadSongs();
    loadPlaylists();
    registerForPushNotificationsAsync();

    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // Filter songs based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSongs(songs);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = songs.filter(
        (song) =>
          (song.title && song.title.toLowerCase().includes(query)) ||
          (song.artist && song.artist.toLowerCase().includes(query)) ||
          (song.album && song.album.toLowerCase().includes(query))
      );
      setFilteredSongs(filtered);
    }
  }, [songs, searchQuery]);

  const handleNotificationResponse = (response) => {
    const { actionIdentifier } = response;

    if (actionIdentifier === "play-pause") {
      togglePlayPause();
    } else if (actionIdentifier === "next") {
      playNextSong();
    } else if (actionIdentifier === "previous") {
      playPreviousSong();
    }
  };

  const loadSongs = async () => {
    try {
      setLoading(true);
      const fetchedSongs = await fetchSongs();
      setSongs(fetchedSongs);
      setFilteredSongs(fetchedSongs);
    } catch (error) {
      console.error("Error loading songs:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlaylists = async () => {
    try {
      const storedPlaylists = await AsyncStorage.getItem("userPlaylists");
      if (storedPlaylists) {
        setPlaylists(JSON.parse(storedPlaylists));
      }
    } catch (error) {
      console.error("Error loading playlists:", error);
    }
  };

  const savePlaylists = async (updatedPlaylists) => {
    try {
      await AsyncStorage.setItem(
        "userPlaylists",
        JSON.stringify(updatedPlaylists)
      );
      setPlaylists(updatedPlaylists);
    } catch (error) {
      console.error("Error saving playlists:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSongs();
    setRefreshing(false);
  };

  useEffect(() => {
    return () => {
      if (soundObj) {
        soundObj.unloadAsync().catch(() => {});
      }
    };
  }, [soundObj]);

  const handleClosePlayer = async () => {
    if (soundObj) {
      try {
        await soundObj.stopAsync();
        await soundObj.unloadAsync();
      } catch (error) {
        console.error("Error closing player:", error);
      }
    }
    setSoundObj(null);
    setCurrent(null);
    setIsPlaying(false);

    try {
      await Notifications.dismissAllNotificationsAsync();
    } catch (error) {
      console.error("Error dismissing notification:", error);
    }
  };

  async function playSong(song) {
    try {
      if (soundObj) {
        await soundObj.stopAsync();
        await soundObj.unloadAsync();
      }

      if (!song.uri) {
        console.warn("No audio URL for this song");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: song.uri },
        { shouldPlay: true }
      );

      setSoundObj(sound);
      setCurrent(song);
      setIsPlaying(true);

      await updateNotification(true, song);

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
          updateNotification(false, song);
          playNextSong();
        }
      });
    } catch (e) {
      console.warn("play error", e);
    }
  }

  const togglePlayPause = async () => {
    if (!soundObj) return;

    try {
      if (isPlaying) {
        await soundObj.pauseAsync();
        setIsPlaying(false);
        await updateNotification(false, current);
      } else {
        await soundObj.playAsync();
        setIsPlaying(true);
        await updateNotification(true, current);
      }
    } catch (error) {
      console.error("Error toggling play/pause:", error);
    }
  };

  const playNextSong = async () => {
    if (!current || songs.length === 0) return;

    const currentIndex = songs.findIndex((song) => song.id === current.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    await playSong(songs[nextIndex]);
  };

  const playPreviousSong = async () => {
    if (!current || songs.length === 0) return;

    const currentIndex = songs.findIndex((song) => song.id === current.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    await playSong(songs[prevIndex]);
  };

  const toggleSongSelection = (songId) => {
    if (selectedSongs.includes(songId)) {
      setSelectedSongs(selectedSongs.filter((id) => id !== songId));
    } else {
      setSelectedSongs([...selectedSongs, songId]);
    }
  };

  const startPlaylistCreation = () => {
    if (songs.length === 0) {
      Alert.alert(
        "No Songs",
        "There are no songs available to create a playlist."
      );
      return;
    }
    setSelectionMode(true);
    setSelectedSongs([]);
  };

  const cancelPlaylistCreation = () => {
    setSelectionMode(false);
    setSelectedSongs([]);
  };

  const finishPlaylistSelection = () => {
    if (selectedSongs.length === 0) {
      Alert.alert(
        "No Songs Selected",
        "Please select at least one song for your playlist."
      );
      return;
    }
    setShowPlaylistModal(true);
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) {
      Alert.alert(
        "Playlist Name Required",
        "Please enter a name for your playlist."
      );
      return;
    }

    const selectedSongObjects = songs.filter((song) =>
      selectedSongs.includes(song.id)
    );

    const newPlaylist = {
      id: Date.now().toString(),
      name: newPlaylistName.trim(),
      songs: selectedSongObjects,
      createdAt: new Date().toISOString(),
    };

    const updatedPlaylists = [...playlists, newPlaylist];
    await savePlaylists(updatedPlaylists);

    setNewPlaylistName("");
    setShowPlaylistModal(false);
    setSelectionMode(false);
    setSelectedSongs([]);

    Alert.alert(
      "Success",
      `Playlist "${newPlaylistName}" created successfully!`
    );
  };

  const deletePlaylist = async (playlistId) => {
    Alert.alert(
      "Delete Playlist",
      "Are you sure you want to delete this playlist?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updatedPlaylists = playlists.filter(
              (p) => p.id !== playlistId
            );
            await savePlaylists(updatedPlaylists);
          },
        },
      ]
    );
  };

  function openPlayer() {
    if (current) {
      navigation.navigate("Player", {
        currentSong: current,
        songs: songs,
        currentIndex: songs.findIndex((song) => song.id === current.id),
        isPlaying: isPlaying,
        onTogglePlay: togglePlayPause,
        onPlaySong: playSong,
        onNext: playNextSong,
        onPrevious: playPreviousSong,
      });
    }
  }

  function openPlaylist(playlist) {
    navigation.navigate("Playlist", {
      playlist,
      playlists,
      onPlaylistUpdate: savePlaylists,
    });
  }

  const clearSearch = () => {
    setSearchQuery("");
  };

  const renderItem = ({ item }) => {
    const coverSource = item.cover
      ? { uri: item.cover }
      : require("../assets/images/Lisa-solo levelling.jpg");

    const isCurrent = current?.id === item.id;
    const isSelected = selectedSongs.includes(item.id);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          isCurrent && styles.activeCard,
          isSelected && styles.selectedCard,
          pressed && { transform: [{ scale: 0.97 }] },
        ]}
        onPress={() =>
          selectionMode ? toggleSongSelection(item.id) : playSong(item)
        }
        onLongPress={() => {
          if (!selectionMode) {
            startPlaylistCreation();
            toggleSongSelection(item.id);
          }
        }}
      >
        {selectionMode && (
          <View style={styles.selectionIndicator}>
            <Ionicons
              name={isSelected ? "checkbox" : "square-outline"}
              size={24}
              color={isSelected ? "#FFD369" : "#fff"}
            />
          </View>
        )}
        <Animated.Image
          source={coverSource}
          style={[
            styles.cover,
            isCurrent && { transform: [{ scale: scaleAnim }] },
          ]}
          defaultSource={require("../assets/images/Lisa-solo levelling.jpg")}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text numberOfLines={1} style={styles.title}>
            {item.title || "Unknown Title"}
          </Text>
          <Text numberOfLines={1} style={styles.artist}>
            {item.artist || "Unknown Artist"}
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

  const renderPlaylistItem = ({ item }) => (
    <Pressable style={styles.playlistCard} onPress={() => openPlaylist(item)}>
      <View style={styles.playlistIcon}>
        <Ionicons name="musical-notes" size={24} color="#FFD369" />
        <Text style={styles.playlistCount}>{item.songs.length}</Text>
      </View>
      <View style={styles.playlistInfo}>
        <Text numberOfLines={1} style={styles.playlistName}>
          {item.name}
        </Text>
        <Text style={styles.playlistSongs}>
          {item.songs.length} song{item.songs.length !== 1 ? "s" : ""}
        </Text>
      </View>
      <Pressable
        onPress={() => deletePlaylist(item.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
      </Pressable>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#6C5CE7" />
        <Text style={styles.loadingText}>Loading your music...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AudioBackgroundHandler soundObj={soundObj} isPlaying={isPlaying} />

      <View style={styles.headerRow}>
        <Text style={styles.header}>🎶 Explore Songs</Text>
        {!selectionMode && (
          <Pressable
            onPress={startPlaylistCreation}
            style={styles.createButton}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.createButtonText}>Create Playlist</Text>
          </Pressable>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={isSearchFocused ? "#FFD369" : "rgba(255,255,255,0.5)"}
          style={styles.searchIcon}
        />
        <TextInput
          style={[
            styles.searchInput,
            isSearchFocused && styles.searchInputFocused,
          ]}
          placeholder="Search songs, artists, albums..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={clearSearch} style={styles.clearButton}>
            <Ionicons
              name="close-circle"
              size={20}
              color="rgba(255,255,255,0.7)"
            />
          </Pressable>
        )}
      </View>

      {selectionMode && (
        <View style={styles.selectionModeHeader}>
          <Text style={styles.selectionModeText}>
            Select songs for your playlist ({selectedSongs.length} selected)
          </Text>
          <View style={styles.selectionActions}>
            <Pressable
              onPress={cancelPlaylistCreation}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={finishPlaylistSelection}
              style={styles.doneButton}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      )}

      {playlists.length > 0 && !selectionMode && (
        <View style={styles.playlistsSection}>
          <Text style={styles.sectionHeader}>Your Playlists</Text>
          <FlatList
            data={playlists}
            keyExtractor={(item) => item.id}
            renderItem={renderPlaylistItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.playlistsList}
          />
        </View>
      )}

      {filteredSongs.length === 0 ? (
        <View style={styles.center}>
          {searchQuery ? (
            <>
              <Ionicons name="search" size={50} color="#666" />
              <Text style={styles.emptyText}>
                No songs found for "{searchQuery}"
              </Text>
              <Pressable onPress={clearSearch} style={styles.retryButton}>
                <Text style={styles.retryText}>Clear Search</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Ionicons name="musical-notes" size={50} color="#666" />
              <Text style={styles.emptyText}>No songs found</Text>
              <Pressable onPress={loadSongs} style={styles.retryButton}>
                <Text style={styles.retryText}>Refresh</Text>
              </Pressable>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredSongs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ paddingBottom: current ? 140 : 40 }}
        />
      )}

      <Modal
        visible={showPlaylistModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPlaylistModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Playlist</Text>
            <TextInput
              style={styles.input}
              placeholder="Playlist Name"
              placeholderTextColor="#888"
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              autoFocus={true}
            />
            <Text style={styles.selectedSongsText}>
              {selectedSongs.length} song{selectedSongs.length !== 1 ? "s" : ""}{" "}
              selected
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setShowPlaylistModal(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.createModalButton]}
                onPress={createPlaylist}
              >
                <Text style={styles.createModalButtonText}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <MiniPlayer
        current={current}
        isPlaying={isPlaying}
        onToggle={togglePlayPause}
        onOpen={openPlayer}
        onClose={handleClosePlayer}
        onNext={playNextSong}
        onPrevious={playPreviousSong}
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  header: { fontSize: 26, fontWeight: "700", color: "#fff" },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6C5CE7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 4,
  },
  // Search Bar Styles
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 8,
  },
  searchInputFocused: {
    // Additional styles when focused if needed
  },
  clearButton: {
    padding: 4,
  },
  selectionModeHeader: {
    backgroundColor: "rgba(108, 92, 231, 0.2)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectionModeText: {
    color: "#fff",
    fontWeight: "600",
    marginBottom: 8,
  },
  selectionActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#ff6b6b",
    fontWeight: "600",
  },
  doneButton: {
    backgroundColor: "#FFD369",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  doneButtonText: {
    color: "#0A0D1A",
    fontWeight: "600",
  },
  playlistsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  playlistsList: {
    paddingBottom: 8,
  },
  playlistCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 12,
    marginRight: 12,
    width: 220,
  },
  playlistIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "rgba(108, 92, 231, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  playlistCount: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#6C5CE7",
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: "center",
    lineHeight: 20,
  },
  playlistInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playlistName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  playlistSongs: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 2,
  },
  deleteButton: {
    padding: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  activeCard: {
    borderWidth: 1.5,
    borderColor: "#FFD369",
    backgroundColor: "rgba(255,211,105,0.08)",
  },
  selectedCard: {
    backgroundColor: "rgba(108, 92, 231, 0.2)",
    borderWidth: 1,
    borderColor: "#6C5CE7",
  },
  selectionIndicator: {
    marginRight: 10,
  },
  cover: { width: 64, height: 64, borderRadius: 10 },
  title: { color: "#fff", fontSize: 16, fontWeight: "600" },
  artist: { color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 2 },
  loadingText: { color: "#fff", marginTop: 16, fontSize: 16 },
  emptyText: { color: "#fff", marginTop: 16, fontSize: 18, fontWeight: "600" },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#6C5CE7",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    backgroundColor: "#1A1E2E",
    borderRadius: 16,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    marginBottom: 12,
  },
  selectedSongsText: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelModalButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  createModalButton: {
    backgroundColor: "#FFD369",
  },
  cancelModalButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  createModalButtonText: {
    color: "#0A0D1A",
    fontWeight: "600",
  },
});
