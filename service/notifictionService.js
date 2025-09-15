import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

const BACKGROUND_AUDIO_TASK = "BACKGROUND_AUDIO_TASK";

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

    await Notifications.setNotificationCategoryAsync("audioPlayback", [
      {
        identifier: "play-pause",
        buttonTitle: isPlaying ? "Pause" : "Play",
        options: {
          isDestructive: false,
          isAuthenticationRequired: false,
        },
      },
      {
        identifier: "next",
        buttonTitle: "Next",
        options: {
          isDestructive: false,
          isAuthenticationRequired: false,
        },
      },
      {
        identifier: "previous",
        buttonTitle: "Previous",
        options: {
          isDestructive: false,
          isAuthenticationRequired: false,
        },
      },
    ]);

    if (song) {
      const notificationConfig = {
        content: {
          title: song.title,
          body: song.artist,
          ios: {
            sound: false,
            categoryIdentifier: "audioPlayback",
          },
          android: {
            channelId: "audio-playback",
            autoCancel: false,
            sticky: true,
            color: "#6C5CE7",
          },
        },
        trigger: null,
      };

      await Notifications.scheduleNotificationAsync(notificationConfig);
    }
  } catch (error) {
    console.error("Error updating notification:", error);
  }
};

export const dismissAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.dismissAllNotificationsAsync();
  } catch (error) {
    console.error("Error dismissing notifications:", error);
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

    try {
      if (
        TaskManager.isTaskDefined &&
        TaskManager.isTaskDefined(BACKGROUND_AUDIO_TASK)
      ) {
        await Notifications.registerTaskAsync(BACKGROUND_AUDIO_TASK);
      }
    } catch (taskError) {
      console.log("Background task registration not available:", taskError);
    }
  } catch (error) {
    console.error("Error registering for notifications:", error);
  }
};

try {
  if (TaskManager.isTaskDefined) {
    TaskManager.defineTask(BACKGROUND_AUDIO_TASK, async ({ data, error }) => {
      if (error) {
        console.error("Background audio task error:", error);
        return;
      }

      if (data) {
        const { playback } = data;

        if (playback.isLoaded) {
          if (playback.isPlaying) {
            await updateNotification(true);
          } else {
            await updateNotification(false);
          }
        }
      }
    });
  }
} catch (error) {
  console.log("Task manager not available:", error);
}
