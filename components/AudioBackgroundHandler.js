import { useEffect } from "react";
import { AppState } from "react-native";
import { Audio } from "expo-av";

export default function AudioBackgroundHandler({ soundObj, isPlaying }) {
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [soundObj, isPlaying]);

  const handleAppStateChange = async (nextAppState) => {
    if (nextAppState === "background" && soundObj && isPlaying) {
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.error("Error setting audio mode for background:", error);
      }
    }
  };

  return null;
}
