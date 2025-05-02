import {
  Image,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  I18nManager,
} from "react-native";
import React, { useEffect, useState } from "react";
import TopTabPage from "../../components/TopTabPage";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { LANGUAGES } from "../../constants/data";
import MyButton from "../../components/MyButton";
import { useTheme } from "../../contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Languages({ navigation }) {
  const { t, i18n } = useTranslation();
  const [pickedLanguage, setPickedLanguage] = useState(i18n.language);
  const [activeLanguage, setActiveLanguage] = useState(i18n.language);
  const [isdataChanged, setIsdataChanged] = useState(false);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const checkChanges = (newValue, oldValue) => {
    if (newValue === oldValue) {
      setIsdataChanged(false);
    } else {
      setIsdataChanged(true);
    }
  };
  const saveBtnHandler = () => {
    if (!isdataChanged) return;
    changeLanguage(pickedLanguage);
    Updates.reloadAsync();
  };

  const storeLanguage = async (value) => {
    try {
      await AsyncStorage.setItem("lang", value);
    } catch (error) {
      console.error("Error Saving language:", error);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);

    // Force RTL if Arabic
    if (lng === "ar") {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }
    storeLanguage(lng);
  };

  const BackHandler = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: SIZES.small + insets.top }]}>
      <View style={styles.topPage}>
        <TopTabPage text={t("languages.languages")} BackHandler={BackHandler}>
          <MyButton pressHandler={saveBtnHandler} noOpacity={!isdataChanged}>
            <Text
              style={{
                ...styles.saveBtn,
                backgroundColor: isdataChanged
                  ? COLORS.primary
                  : COLORS.lightGray,
                opacity: isdataChanged ? 1 : 0.3,
                color: isdataChanged ? COLORS.white : COLORS.black,
              }}>
              {t("languages.save")}
            </Text>
          </MyButton>
        </TopTabPage>

        <Text style={[styles.title, { color: theme.text }]}>
          {t("languages.preferred_languages")}
        </Text>
      </View>

      <FlatList
        data={LANGUAGES}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              backgroundColor: theme.lightGray,
              marginTop: -2,
            }}
          />
        )}
        ListHeaderComponent={() => (
          <View
            style={{
              height: 1,
              marginTop: 2,
              backgroundColor: theme.lightGray,
            }}
          />
        )}
        ListFooterComponent={() => (
          <View
            style={{
              height: 1,
              marginTop: -2,
              backgroundColor: theme.lightGray,
            }}
          />
        )}
        renderItem={({ item }) => {
          const isSelected = pickedLanguage === item.langCode;

          return (
            <MyButton
              key={item.id}
              pressHandler={() => {
                setPickedLanguage(item.langCode);
                checkChanges(item.langCode, activeLanguage);
              }}>
              <View
                style={{
                  ...styles.itemContainer,
                  backgroundColor: isSelected
                    ? theme.secondary + "50"
                    : "transparent",
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: isSelected ? theme.primary : "transparent",
                }}>
                <Image source={item.logo} style={styles.languageLogo} />
                <Text style={[styles.LanguageText, { color: theme.text }]}>
                  {item.text}
                </Text>
                {isSelected && (
                  <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <View
                      style={[
                        styles.pickedCircle,
                        { borderColor: theme.primary },
                      ]}>
                      <View
                        style={[
                          styles.pickedCircleIn,
                          {
                            backgroundColor: theme.primary,
                            // boxShadow: `0 0 6 2 ${theme.primary}`,
                            shadowColor: theme.primary,
                          },
                        ]}
                      />
                    </View>
                  </View>
                )}
              </View>
            </MyButton>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: SIZES.small,
  },
  topPage: {
    padding: 1.5 * SIZES.medium,
    paddingTop: 0,
    gap: SIZES.large,
  },
  title: {
    textAlign: "center",
    fontFamily: FONTS.medium,
    fontSize: 1.4 * SIZES.medium,
  },
  saveBtn: {
    padding: SIZES.small,
    borderRadius: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.medium,
    padding: 1.5 * SIZES.medium,
  },
  LanguageText: {
    fontFamily: FONTS.medium,
    fontSize: 1.4 * SIZES.medium,
  },
  languageLogo: {
    width: 1.2 * SIZES.large,
    height: 1.2 * SIZES.large,
    resizeMode: "contain",
  },
  pickedCircle: {
    borderWidth: 2,
    width: SIZES.large,
    height: SIZES.large,
    borderRadius: SIZES.large / 2,
    padding: 5,
  },
  pickedCircleIn: {
    flex: 1,
    borderRadius: 50,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
});
