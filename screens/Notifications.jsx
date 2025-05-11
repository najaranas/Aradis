//
// Notifications.jsx
// This component is responsible for displaying  notifications to the user.
// It uses React Native's FlatList to render a list of notifications.
// It connects to a WebSocket to receive real-time updates for notifications.
// It also includes a loading state and handles marking notifications as read.
// It uses the useTranslation hook for internationalization and the useTheme hook for theming.
//  It also includes a custom button component for handling button presses.
//

import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DotIndicator } from "react-native-indicators";

import TopTabPage from "../components/TopTabPage";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";
import { silentNotification } from "../constants/dataImage";
import { useTranslation } from "react-i18next";
import MyButton from "../components/MyButton";

import { getStoredValue } from "../utils/storage";
import {
  connectNotificationSocket,
  markNotificationAsRead,
} from "../utils/api/notificationApi";
import { useUser } from "../hooks/useUser";

export default function Notifications() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const { userData } = useUser();

  const userId = userData?.id;

  useEffect(() => {
    const readToken = async () => {
      const token = await getStoredValue("token");
      setToken(token);
    };
    readToken();
  }, []);

  useEffect(() => {
    if (!userId || !token) return;
    setIsLoading(true);

    const socket = connectNotificationSocket(
      userId,
      token,
      (updated) => {
        setNotifications(updated);
        setIsLoading(false);
      },
      (count) => {
        setUnreadCount(count);
      }
    );

    return () => {
      if (socket) socket.disconnect();
    };
  }, [userId, token]);

  const btnPressHandler = async (notif) => {
    navigation.navigate("Scanner");

    if (notif.status === "unread") {
      try {
        const data = await markNotificationAsRead(token, notif.id);

        console.log(data);

        // ✅ Update UI immediately
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, status: "read" } : n))
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
  };

  const renderItem = ({ item }) => (
    <MyButton pressHandler={() => btnPressHandler(item)}>
      <View style={styles.notificationsCard}>
        <View style={styles.cardHeader}>
          <Text style={[styles.typeText, { color: theme.text }]}>
            {item?.title}
          </Text>
          <Text style={styles.timeText}>{item?.formattedDate}</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={[styles.description, { color: theme.text }]}>
            {item?.message}
          </Text>
          {item?.status === "unread" && <View style={styles.unreadIndicator} />}
        </View>
      </View>
    </MyButton>
  );

  const BackHandler = () => navigation.goBack();

  return (
    <View style={[styles.container, { paddingTop: SIZES.small + insets.top }]}>
      <TopTabPage
        text={t("notifications.notifications")}
        BackHandler={BackHandler}
      />

      {isLoading ? (
        <View style={styles.indicatorContainer}>
          <DotIndicator
            color={COLORS.secondary}
            count={3}
            size={SIZES.medium}
          />
        </View>
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Image source={silentNotification} style={styles.silentImg} />
          <Text style={[styles.noNotificationsTitle, { color: theme.text }]}>
            {t("notifications.no_notifications")}
          </Text>
          <Text style={styles.noNotificationsText}>
            {t("notifications.check_back")}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1.5 * SIZES.medium,
    gap: SIZES.small,
  },
  notificationsCard: {
    paddingVertical: 0.8 * SIZES.large,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  typeText: {
    fontFamily: FONTS.medium,
    fontSize: 1.1 * SIZES.medium,
  },
  timeText: {
    color: COLORS.gray,
    fontSize: SIZES.medium,
  },
  descriptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  description: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.regular,
    flexShrink: 1,
    opacity: 0.7,
  },

  unreadIndicator: {
    backgroundColor: COLORS.blue,
    width: SIZES.small,
    height: SIZES.small,
    borderRadius: SIZES.small / 2,
  },
  separator: {
    height: 0.5,
    backgroundColor: COLORS.lightGray,
  },
  silentImg: {
    width: 5 * SIZES.xLarge,
    height: 5 * SIZES.xLarge,
  },
  noDataContainer: {
    flex: 1,
    paddingTop: 1.5 * SIZES.xLarge,
    alignItems: "center",
    gap: SIZES.small,
  },
  indicatorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noNotificationsTitle: {
    fontSize: SIZES.large,
    fontFamily: FONTS.medium,
    textAlign: "center",
  },
  noNotificationsText: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.regular,
    textAlign: "center",
    color: COLORS.gray,
  },
});
