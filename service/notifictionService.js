import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const createNotificationChannel = async () => {
  if (Platform.OS === "android") {
    try {
      await Notifications.setNotificationChannelAsync("audio-playback", {
        name: "Audio Playback",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#6C5CE7",
      });
    } catch (error) {
      console.error("Error creating notification channel:", error);
    }
  }
};

export const updateNotification = async (isPlaying, song = null) => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (song) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: song.title || "Unknown Title",
          body: song.artist || "Unknown Artist",
          subtitle: isPlaying ? "Now Playing" : "Paused",
        },
        trigger: null,
      });
    }
  } catch (error) {
    console.error("Error updating notification:", error);
  }
};

export const registerForPushNotificationsAsync = async () => {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Notification permission not granted");
      return;
    }

    await createNotificationChannel();
  } catch (error) {
    console.error("Error registering for notifications:", error);
  }
};
