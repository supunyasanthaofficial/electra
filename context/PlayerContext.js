import React, { createContext, useState, useEffect } from "react";
import { Audio } from "expo-av";

export const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [soundObj, setSoundObj] = useState(null);
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) setIsPlaying(false);
      });
    } catch (e) {
      console.log("play error", e);
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

  return (
    <PlayerContext.Provider
      value={{ current, isPlaying, playSong, togglePlayPause }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
