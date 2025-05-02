import {
  BackHandler,
  I18nManager,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import * as tabNavigation from "expo-navigation-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTheme } from "../contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import { StatusBar } from "expo-status-bar";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { check } from "../constants/dataImage";
import MyButton from "../components/MyButton";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { formatDate } from "date-fns";
import { ar, enUS, fr } from "date-fns/locale";

export default function ConfirmScan() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isRTL = I18nManager.isRTL || i18n.language === "ar";
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const date = new Date();

  useFocusEffect(
    useCallback(() => {
      const setupNavigation = async () => {
        await tabNavigation.setBackgroundColorAsync(COLORS.primary);
        await tabNavigation.setVisibilityAsync("hidden");
        await tabNavigation.setButtonStyleAsync("light");
      };

      setupNavigation();

      return () => {
        const restoreNavigation = async () => {
          await tabNavigation.setButtonStyleAsync(
            theme.name === "light" ? "dark" : "light"
          );
          await tabNavigation.setVisibilityAsync("visible");
        };

        restoreNavigation();
      };
    }, [theme.name])
  );

  useEffect(() => {
    const backAction = () => {
      handleBackBtn();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const handleBackBtn = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "TabNavigator", params: { screen: "Home" } }],
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: SIZES.small + insets.top,
        },
      ]}>
      <StatusBar hidden />
      <View style={styles.topPages}>
        <MyButton pressHandler={handleBackBtn}>
          <Ionicons name="home" style={styles.icon} />
        </MyButton>
      </View>
      <View style={styles.dataContainer}>
        <Image source={check} style={styles.checkImg} />
        <Text style={[styles.title]}>{t("ConfirmScan.title")}</Text>
        <Text style={[styles.subTitle]}>{t("ConfirmScan.subTitle")} </Text>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: SIZES.small,
            }}>
            <AntDesign
              name="clockcircleo"
              style={[styles.icon, { color: COLORS.white + "c0" }]}
            />
            <Text style={styles.subTitle}>
              {formatDate(date, "d MMM yyyy : HH:mm", {
                locale:
                  i18n.language === "ar"
                    ? ar
                    : i18n.language === "fr"
                    ? fr
                    : enUS,
              })}
            </Text>
          </View>
        </View>
        <MyButton pressHandler={handleBackBtn}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: SIZES.small,
              paddingBottom: 5,
              borderBottomColor: "white",
              borderBottomWidth: 0.5,
            }}>
            <Text style={[styles.subTitle]}>{t("ConfirmScan.home_page")}</Text>
            <Ionicons
              name={`chevron-${isRTL ? "back" : "forward"}`}
              style={[{ fontSize: SIZES.medium, color: COLORS.white + "c0" }]}
            />
          </View>
        </MyButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 1.5 * SIZES.medium,
    // justifyContent: "center",
    // alignItems: "center",
  },
  checkImg: {
    width: 6 * SIZES.large,
    height: 6 * SIZES.large,
    resizeMode: "cover",
  },

  dataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: SIZES.medium,
  },

  icon: {
    color: COLORS.white,
    fontSize: 1.5 * SIZES.medium,
  },
  title: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 1.8 * SIZES.medium,
    textAlign: "center",
  },
  subTitle: {
    color: COLORS.white + "c0",
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    textAlign: "center",
  },
});
