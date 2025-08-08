import { getMessaging, getToken } from "firebase/messaging";
import { app } from "./firebase"; // Only import app
import { store } from "../src/redux";
import { setFcmToken } from "../src/redux/slice/userSlice";
export const requestFirebaseNotificationPermission = async (): Promise<
  string | null
> => {
  try {
    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);

    if (permission !== "granted") {
      console.warn("Notification permission not granted.");
      return null;
    }

    // Always initialize messaging HERE, never globally
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey:
        "BHjFY5wEZ5BXY3zZm7jAi9cgfnUi4_qOHk0y4AHvxOW7SPeiIbsysMsIrMUrs-LptWw7qZ7itoPWYNCIpwpYla8",
    });

    console.log("FCM token:", token);
    store.dispatch(setFcmToken(token));
    return token;
  } catch (error) {
    console.error("An error occurred while retrieving token.", error);
    return null;
  }
};
