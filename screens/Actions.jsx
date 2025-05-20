import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import TopTabPage from "../components/TopTabPage";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import MyButton from "../components/MyButton";
import { useTranslation } from "react-i18next";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../hooks/useTheme";
import { useUser } from "../hooks/useUser";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchActions } from "../utils/api/actionsApi";
import { FlashList } from "@shopify/flash-list";
import { formatDate } from "date-fns";
import { DotIndicator } from "react-native-indicators";

export default function Actions() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { userData } = useUser();

  const navigation = useNavigation();
  const [statusFocusedIndex, setStatusFocusedIndex] = useState(0);
  const status = ["all", "open", "in_progress", "done"];
  const [initialAction, setInitialAction] = useState([]);
  const [actions, setActions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const insets = useSafeAreaInsets();

  const BackHandler = () => {
    navigation.goBack();
  };

  // Filter actions based on the status index
  const filterActions = useCallback((tags = [], statusIndex) => {
    console.log("Filtering with statusIndex:", statusIndex);

    if (statusIndex === 1) {
      return tags.filter((action) => action.status === "open");
    } else if (statusIndex === 2) {
      return tags.filter((action) => action.status === "inProgress");
    } else if (statusIndex === 3) {
      return tags.filter((action) => action.status === "done");
    }

    return tags;
  }, []);

  // Fetch actions from API (only called on initial load and refresh)
  const fetchActionsData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await fetchActions(userData?.id);
      setInitialAction(result);

      // Apply the current filter to the new data
      const filteredActions = filterActions(result, statusFocusedIndex);
      setActions(filteredActions);
    } catch (error) {
      console.error("Error fetching actions:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [userData?.id, statusFocusedIndex, filterActions]);

  // Initial data fetch - only happens once on component mount
  useEffect(() => {
    fetchActionsData();
  }, []);

  useEffect(() => {
    // Only apply filtering if we already have data
    // This avoids API calls when just changing filters
    if (initialAction.length > 0) {
      const filteredActions = filterActions(initialAction, statusFocusedIndex);
      setActions(filteredActions);
    }
  }, [statusFocusedIndex, filterActions, initialAction]);

  // Handle filter button press
  const filterBtnHandler = (index) => {
    setStatusFocusedIndex(index);
  };

  // Handle refresh - only time we fetch new data after initial load
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchActionsData();
  }, [fetchActionsData]);

  const renderFilterItem = ({ item, index }) => {
    const isFocused = index === statusFocusedIndex;
    return (
      <MyButton
        pressHandler={() => filterBtnHandler(index)}
        disabled={isFocused}>
        <View
          style={{
            backgroundColor: isFocused ? COLORS.primary : "transparent",
            padding: 10,
            paddingVertical: 5,
            borderRadius: 5,
          }}>
          <Text
            style={{
              color: index === statusFocusedIndex ? COLORS.white : COLORS.gray,
              fontFamily: FONTS.medium,
              fontSize: SIZES.medium,
            }}>
            {t(`actions.status.${item}`)}
          </Text>
        </View>
      </MyButton>
    );
  };

  const renderContentItem = ({ item }) => {
    return (
      <View
        style={[
          styles.actionCard,
          {
            backgroundColor: theme.background,
            borderColor: theme.lightGray,
          },
        ]}>
        <View style={styles.actionHeader}>
          <Text style={[styles.actionId, { color: theme.text }]}>
            {item?.tagId || item?.fpsId}
          </Text>
          <Text style={[styles.actionType, { color: theme.text }]}>
            {item?.type === "tag"
              ? t(`actions.actionInfo.tag`)
              : t(`actions.actionInfo.fps`)}
          </Text>
        </View>
        <View style={styles.actionContent}>
          <View style={styles.actionInfo}>
            <Text style={styles.label}>{t(`actions.actionInfo.date`)} :</Text>
            <Text style={styles.label}>
              {item?.createdAt &&
                formatDate(new Date(item?.createdAt), "dd-MM-yyyy HH:mm")}
            </Text>
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.label}>{t(`actions.actionInfo.status`)} :</Text>
            <Text style={styles.label}>
              {item?.status.toLowerCase() === "todo"
                ? t(`actions.status.open`)
                : item?.status.toLowerCase() === "inprogress"
                  ? t(`actions.status.in_progress`)
                  : t(`actions.status.done`)}
            </Text>
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.label}>
              {t(`actions.actionInfo.scan_status`)} :
            </Text>
            <Text style={styles.label}>
              {item?.scanStatus === "scanned"
                ? t(`actions.actionInfo.scanned`)
                : t(`actions.actionInfo.unscanned`)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: SIZES.small + insets.top }]}>
      <StatusBar
        backgroundColor="transparent"
        style={theme.name === "dark" ? "light" : "dark"}
      />
      <TopTabPage text={t("actions.title")} BackHandler={BackHandler} />
      <View style={{ flex: 1, gap: 1.5 * SIZES.medium }}>
        {/* actions Filter */}

        <View>
          <FlatList
            data={status}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingInline: SIZES.small,
              gap: SIZES.medium,
              flexGrow: 1,
            }}
            renderItem={renderFilterItem}
          />
        </View>

        {/* actions list */}
        {isLoading ? (
          <View style={styles.indicatorContainer}>
            <DotIndicator
              color={COLORS.secondary}
              count={3}
              size={SIZES.medium}
            />
          </View>
        ) : actions?.length > 0 ? (
          <FlatList
            data={actions}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderContentItem}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View style={{ height: SIZES.medium }} />
            )}
            estimatedItemSize={100}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.text]}
                progressBackgroundColor={theme.background}
              />
            }
          />
        ) : (
          <View style={styles.emptyActionsContainer}>
            <Image
              source={require("../assets/icons/no-actions.png")}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>
              {t("actions.no_actions_found")}
            </Text>
          </View>
        )}
      </View>
      {/* content  */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.medium,
    gap: SIZES.large,
  },
  actionsListContainer: {
    gap: SIZES.medium,
  },
  actionCard: {
    borderRadius: 10,
    padding: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    gap: SIZES.medium,
  },
  actionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionContent: {
    gap: 0.5 * SIZES.small,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    marginLeft: 4,
  },
  actionInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.small,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  value: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.black,
    flex: 1,
  },
  scanStatus: {
    flexDirection: "row",
    alignItems: "center",
  },

  emptyActionsContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: SIZES.xLarge,
    gap: SIZES.medium,
  },
  emptyImage: {
    width: 5 * SIZES.xLarge,
    height: 5 * SIZES.xLarge,
    resizeMode: "cover",
  },
  emptyText: {
    fontSize: SIZES.large,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
    textAlign: "center",
  },
  indicatorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
