//
// Home.jsx
// This component is responsible for rendering the home screen of the app.
// It includes a header with a greeting and date, a stats section, and a scrollable list of cards.
// It uses React Navigation for navigation, and Expo's NavigationBar API for setting the navigation bar color.
// It also includes a check for internet connectivity using a custom component.
// It uses the useTranslation hook for internationalization and the useTheme hook for theming.
//

import { useCallback, useEffect, useState } from "react";
import {
  Button,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { formatDate } from "date-fns";
import { ar, fr, enUS } from "date-fns/locale";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { useTheme } from "../hooks/useTheme";
import MyButton from "../components/MyButton";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getStoredValue } from "../utils/storage";
import { useUser } from "../hooks/useUser";
import { HOMEDATA, TAGS } from "../constants/data";
import { useNotifications } from "../hooks/useNotifications";
import { fetchStatsTags } from "../utils/api/tagApi";
import { DotIndicator } from "react-native-indicators";

export default function Home() {
  const date = new Date();
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const isScreenFocused = useIsFocused();
  const { userData } = useUser();
  const { unreadCount } = useNotifications();

  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [isStatsRefreshing, setIsStatsRefreshing] = useState(false);
  const [tagsStats, setTagsStats] = useState([]);
  console.log("userData:", userData);

  useEffect(() => {
    fetchTagsStats();
  }, []);

  const fetchTagsStats = async () => {
    setIsStatsLoading(true);
    const tagsStats = await fetchStatsTags();
    setTagsStats(tagsStats);
    setIsStatsLoading(false);
  };

  const notifcationPressHandler = () => {
    navigation.navigate("Notifications");
  };

  const scanPressHandler = () => {
    navigation.navigate("Scanner");
  };

  const cardPressHandler = (path) => {
    if (!path) return;
    navigation.navigate(path);
  };

  const formatStatsResult = (stat) => {
    // Format the number to always show two digits

    return stat?.toString().padStart(2, "0");
  };

  const onRefresh = async () => {
    setIsStatsRefreshing(true);
    await fetchTagsStats();
    setIsStatsRefreshing(false);
  };

  return (
    <View style={[styles.container]}>
      {isScreenFocused && <StatusBar style="light" />}
      <View
        style={[
          styles.headerContainer,
          { paddingTop: SIZES.small + insets.top },
        ]}>
        <View style={styles.headerContent}>
          <View
            style={{
              alignItems: "center",
              gap: SIZES.small,
              flexDirection: "row",
            }}>
            <Text style={styles.greetingText}>{t("home.hello")}</Text>
            <Text style={styles.greetingText}>
              {userData?.firstName} {userData?.lastName}
            </Text>
          </View>
          <View style={styles.iconsContainer}>
            <MyButton pressHandler={scanPressHandler}>
              <MaterialCommunityIcons
                name="qrcode-scan"
                style={styles.iconStyle}
              />
            </MyButton>
            <MyButton pressHandler={notifcationPressHandler}>
              <Ionicons name="notifications" style={styles.iconStyle} />
              {/* indicator */}
              {unreadCount > 0 && <View style={styles.notificationIndicator} />}
            </MyButton>
          </View>
        </View>
        <Text style={styles.dateText}>
          {formatDate(date, "EEEE, d MMM yyyy", {
            locale:
              i18n.language === "ar" ? ar : i18n.language === "fr" ? fr : enUS,
          })}
        </Text>
      </View>

      {/* stats content  */}
      <ScrollView
        style={{ marginBottom: SIZES.medium }}
        refreshControl={
          <RefreshControl
            refreshing={isStatsRefreshing}
            onRefresh={onRefresh}
            colors={[theme.text]}
            progressBackgroundColor={theme.background}
          />
        }>
        <View style={styles.statsContainer}>
          {isStatsLoading ? (
            <DotIndicator
              color={COLORS.secondary}
              count={3}
              size={SIZES.medium}
            />
          ) : (
            <>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {formatStatsResult(tagsStats?.open)}
                </Text>
                <Text style={styles.statLabel}>{t("home.tags_open")}</Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statItemSeperator} />
                <Text style={styles.statNumber}>
                  {formatStatsResult(tagsStats?.toDo)}
                </Text>
                <Text style={styles.statLabel}>
                  {t("home.tags_in_progress")}
                </Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statItemSeperator} />
                <Text style={styles.statNumber}>
                  {formatStatsResult(tagsStats?.done)}
                </Text>
                <Text style={styles.statLabel}>{t("home.tags_completed")}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.scrollViewContent}>
          {HOMEDATA.map((item, index) => {
            let subtitleText = "";
            let navigate = null;

            if (item.id === 1) {
              subtitleText = `${tagsStats?.total} ${t("home.1.subtitle")}`;
              navigate = "Tags";
            } else if (item.id === 2) {
              subtitleText = `${tagsStats?.total} ${t("home.2.subtitle")}`;
              navigate = "Actions";
            } else if (item.id === 3) {
              subtitleText = `${t("home.3.subtitle")}`;
            }

            return (
              <MyButton
                key={index}
                pressHandler={() => cardPressHandler(navigate)}>
                <View
                  style={[
                    styles.cardContainer,
                    {
                      backgroundColor: theme.background,
                      flexGrow: 1,
                    },
                    theme.name === "dark" && styles.cardDark,
                    theme.name === "light" && styles.cardLight,
                  ]}>
                  <View style={styles.cardIconContainer}>
                    <Image source={item.icon} style={styles.cardIcon} />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>
                      {t(`home.${item.id}.title`)}
                    </Text>

                    <Text style={styles.cardSubtitle}>{subtitleText}</Text>
                  </View>
                </View>
              </MyButton>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerContainer: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SIZES.medium,
  },
  greetingText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: 1.7 * SIZES.medium,
  },
  iconsContainer: {
    flexDirection: "row",
    gap: SIZES.medium,
    alignItems: "center",
  },
  iconStyle: {
    color: COLORS.white,
    fontSize: 1.7 * SIZES.medium,
  },
  notificationIndicator: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 5,
    height: 5,
    backgroundColor: COLORS.secondary,
    borderRadius: 25,
  },
  dateText: {
    color: COLORS.lightGray,
    fontFamily: FONTS.medium,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SIZES.medium,
    justifyContent: "space-between",
    paddingVertical: SIZES.large,
    paddingBottom: 2 * SIZES.large,
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  statItem: {
    flex: 1,
    position: "relative",
    // backgroundColor: "red",
    alignItems: "center",
  },
  statItemSeperator: {
    position: "absolute",
    width: 0.5,
    height: "30%",
    top: "50%",
    left: 0,
    backgroundColor: COLORS.lightGray,
  },
  statNumber: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.secondary,
    flexShrink: 1,
    textAlign: "center",
  },
  statLabel: {
    fontFamily: FONTS.medium,
    fontSize: 1.2 * SIZES.medium,
    flexShrink: 1,
    color: COLORS.lightGray,
    textAlign: "center",
  },
  scrollView: {
    marginTop: 2 * -SIZES.medium - SIZES.small,
    flex: 1,
  },
  scrollViewContent: {
    flexDirection: "row",
    gap: SIZES.medium,
    flexWrap: "wrap",
    paddingHorizontal: 1.5 * SIZES.medium,
    paddingVertical: SIZES.small,
    marginTop: -SIZES.large,
  },
  cardContainer: {
    borderRadius: 20,
    padding: SIZES.medium,
    alignItems: "flex-start",
    gap: 1.5 * SIZES.medium,
    width: (SIZES.screenWidth - 2 * 1.5 * SIZES.medium - SIZES.medium) / 2,
  },
  cardDark: {
    borderColor: COLORS.darkGray,
    borderWidth: 1,
  },
  cardLight: {
    // boxShadow:
    // "  rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.167)",
  },
  cardIconContainer: {
    backgroundColor: "#b2bcff7e",
    borderRadius: 10,
    padding: SIZES.small,
    minHeight: 1.2 * SIZES.large,
    minWidth: 1.2 * SIZES.large,
  },
  cardIcon: {
    width: 2.5 * SIZES.medium,
    height: 2.5 * SIZES.medium,
  },
  cardTextContainer: {
    gap: 5,
  },
  cardTitle: {
    fontFamily: FONTS.medium,
    fontSize: 1.3 * SIZES.medium,
  },
  cardSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
});
