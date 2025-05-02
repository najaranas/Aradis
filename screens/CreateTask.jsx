import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { useTheme } from "../contexts/ThemeProvider";
import PagerView from "react-native-pager-view";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import AddTag from "../components/AddTag";
import { Ionicons } from "@expo/vector-icons";
import AddFps from "../components/AddFps";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateTask() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [activePage, setActivePage] = useState(0);
  const pagerViewRef = useRef(null);
  const insets = useSafeAreaInsets();

  const handleSegmentChange = (index) => {
    setActivePage(index);
    pagerViewRef.current?.setPage(index);
  };

  const handlePageSelected = (event) => {
    setActivePage(event.nativeEvent.position);
  };

  return (
    <View style={[styles.container, { paddingTop: SIZES.small + insets.top }]}>
      <View style={styles.segmentedControl}>
        <View
          style={{
            backgroundColor: COLORS.secondary,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            padding: 0.5 * SIZES.small,
          }}>
          <Pressable
            style={[
              styles.segment,
              {
                backgroundColor:
                  activePage === 0 ? COLORS.white : "transparent",
                borderRadius: 7,
              },
            ]}
            onPress={() => {
              handleSegmentChange(0);
            }}>
            <Ionicons
              name={"pricetags-outline"}
              size={1.3 * SIZES.medium}
              color={theme.darkGray}
            />
            <Text
              style={[
                activePage === 0 ? styles.activeText : styles.regularText,
              ]}>
              {t("createTask.segmentedControl.add_tag")}
            </Text>
          </Pressable>

          {/* fps */}
          {/* <Pressable
            style={[
              styles.segment,
              {
                backgroundColor:
                  activePage === 1 ? COLORS.white : "transparent",
                borderRadius: 7,
              },
            ]}
            onPress={() => {
              handleSegmentChange(1);
            }}>
            <SimpleLineIcons
              name="wrench"
              size={1.3 * SIZES.medium}
              color={COLORS.black}
            />
            <Text
              style={[
                activePage === 1 ? styles.activeText : styles.regularText,
              ]}>
              {t("createTask.segmentedControl.add_fps")}
            </Text>
          </Pressable> */}
        </View>
        {/*  */}
      </View>

      <PagerView
        ref={pagerViewRef}
        style={styles.PagerView}
        initialPage={activePage}
        scrollEnabled={false}
        onPageSelected={handlePageSelected}>
        <View style={styles.page} key="1">
          <AddTag />
        </View>

        {/* <View style={styles.page} key="2">
          <AddFps />
        </View> */}
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  PagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  segmentedControl: {
    position: "relative",
    padding: 1.5 * SIZES.medium,
    paddingTop: 0,
    borderBlockColor: COLORS.lightGray,
    borderBottomWidth: 1,
  },
  customSegmentsContainer: {
    position: "absolute",
    top: 1.5 * SIZES.medium,
    left: 1.5 * SIZES.medium,
    right: 1.5 * SIZES.medium,
    bottom: 1.5 * SIZES.medium,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  segment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 0.4 * SIZES.small,
    flex: 1,
    paddingVertical: SIZES.small,
  },
  activeText: {
    fontFamily: FONTS.regular,
    fontSize: 1.2 * SIZES.medium,
  },
  regularText: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.regular,
  },
});
