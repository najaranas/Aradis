import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopTabPage from "../components/TopTabPage";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";
import { silentNotification } from "../constants/dataImage";
import { useTranslation } from "react-i18next";
import MyButton from "../components/MyButton";
import { formatDate } from "date-fns";
import { useNotifications } from "../hooks/useNotifications";
import { markNotificationAsRead } from "../utils/api/notificationApi";
import { getStoredValue } from "../utils/storage";
import { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";

export default function Notifications() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { notifications, unreadCount, setNotifications, setUnreadCount } =
    useNotifications();
  console.log("Notifications", notifications);
  const [token, setToken] = useState("");

  useEffect(() => {
    const readToken = async () => {
      const token = await getStoredValue("token");
      setToken(token);
    };
    readToken();
  }, []);

  const btnPressHandler = async (notif) => {
    navigation.navigate("Scanner");

    if (notif.status === "unread") {
      try {
        await markNotificationAsRead(token, notif.id);

        // With Redux, we need to create a new array based on current notifications
        const updatedNotifications = notifications.map((n) =>
          n.id === notif.id ? { ...n, status: "read" } : n
        );

        // Dispatch the updated notifications array to Redux
        setNotifications(updatedNotifications);

        // Update unread count directly
        setUnreadCount(Math.max(0, unreadCount - 1));
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
  };

  const renderItem = ({ item }) => {
    return (
      <MyButton pressHandler={() => btnPressHandler(item)}>
        <View style={styles.notificationsCard}>
          <View style={styles.cardHeader}>
            <Text style={[styles.titleText, { color: theme.text }]}>
              {item?.title}
            </Text>
            <Text style={styles.timeText}>
              {formatDate(item?.createdAt, "dd-MM-yyyy : HH:mm")}
            </Text>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={[styles.description, { color: theme.text }]}>
              {item?.message}
            </Text>
            {item?.status === "unread" && (
              <View style={styles.unreadIndicator} />
            )}
          </View>
        </View>
      </MyButton>
    );
  };

  const BackHandler = () => navigation.goBack();

  return (
    <View style={[styles.container, { paddingTop: SIZES.small + insets.top }]}>
      <TopTabPage
        text={t("notifications.notifications")}
        BackHandler={BackHandler}
      />

      {notifications.length > 0 ? (
        <FlashList
          data={notifications}
          renderItem={renderItem}
          estimatedItemSize={125}
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
    alignItems: "center",
  },
  titleText: {
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
    gap: SIZES.medium,
  },
  description: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.regular,
    flexGrow: 1,
    opacity: 0.7,
    flexShrink: 1,
    flexWrap: "wrap",
    overflow: "hidden",
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
