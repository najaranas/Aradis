import { SafeAreaView, StyleSheet, Text, View, Image } from "react-native";
import { noInternet } from "../constants/dataImage";
import MyButton from "../components/MyButton";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useLayoutEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { useTranslation } from "react-i18next";

export default function NoInternet() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  // Use useLayoutEffect instead of useEffect to set navigation bar color
  // This runs synchronously after all DOM mutations but before the browser paints
  useEffect(() => {
    requestAnimationFrame(async () => {
      await NavigationBar.setBackgroundColorAsync(COLORS.secondary);
      await NavigationBar.setButtonStyleAsync("light");
    });
  }, []);

  const pressHandler = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        navigation.navigate("Loading");
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={noInternet} style={styles.img} />
      <View style={styles.textContainer}>
        <Text style={styles.mainText}>{t("noInternet.noInternet")}</Text>
        <Text style={styles.subText}>{t("noInternet.noInternet_message")}</Text>
        <MyButton pressHandler={pressHandler}>
          <Text style={styles.button}>{t("noInternet.retry")}</Text>
        </MyButton>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
  },

  img: {
    resizeMode: "cover",
    width: "100%",
    height: 3 * SIZES.xLarge,
  },

  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.medium,
  },

  mainText: {
    fontSize: SIZES.large,
    fontFamily: FONTS.semiBold,
    textAlign: "center",
  },
  subText: {
    fontSize: 1.1 * SIZES.medium,
    fontFamily: FONTS.medium,
    textAlign: "center",
    lineHeight: 20,
    color: COLORS.darkGray,
  },
  button: {
    borderColor: COLORS.darkGray,
    borderWidth: 0.5,
    borderRadius: 10,
    padding: SIZES.small,
    fontSize: 1.6 * SIZES.medium,
    fontFamily: FONTS.regular,
    color: COLORS.darkGray,
    marginTop: SIZES.medium,
  },
});
