import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import TopTabPage from "../components/TopTabPage";
import { useNavigation } from "@react-navigation/native";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { NOTIFICATIONS } from "../constants/data";
import { useTheme } from "../contexts/ThemeProvider";
import { Image } from "react-native";
import { silentNotification } from "../constants/dataImage";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchNotifications } from "../utils/api/tagApi";
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from "react-native-indicators";

export default function Notifications() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const BackHandler = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setIsLoading(false);
        setData(data);
      } catch (error) {
        console.error("error fetching notifications data : ", error);
      }
    };
    loadNotifications();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.notificationsCard}>
      <View style={styles.cardHeader}>
        <Text style={[styles.typeText, { color: theme.text }]}>
          {item?.title}
        </Text>
        <Text style={styles.timeText}>{item?.timestamp}</Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={[styles.description, { color: theme.text }]}>
          {item?.description}
        </Text>
        {item?.status?.toLowerCase() === "unread" && (
          <View style={styles.unreadIndicator} />
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: SIZES.small + insets.top }]}>
      <TopTabPage
        text={t("notifications.notifications")}
        BackHandler={BackHandler}
      />
      {isLoading ? (
        <View style={styles.indicatorContainer}>
          <DotIndicator color={COLORS.gray} count={3} size={SIZES.medium} />
        </View>
      ) : data?.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          estimatedItemSize={100}
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
    alignItems: "center",
    justifyContent: "space-between",
    gap: SIZES.small,
  },
  typeText: {
    fontFamily: FONTS.medium,
    fontSize: 1.1 * SIZES.medium,
    flexShrink: 1,
  },
  timeText: {
    color: COLORS.gray,
    fontSize: SIZES.medium,
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  description: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.regular,
    lineHeight: 20,
    flexShrink: 1,
  },
  unreadIndicator: {
    backgroundColor: COLORS.blue,
    width: SIZES.small,
    height: SIZES.small,
    borderRadius: SIZES.small / 2,
  },
  separator: {
    height: SIZES.large,
    height: 0.5,
    backgroundColor: COLORS.lightGray,
  },
  silentImg: {
    width: 5 * SIZES.xLarge,
    height: 5 * SIZES.xLarge,
    resizeMode: "cover",
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
