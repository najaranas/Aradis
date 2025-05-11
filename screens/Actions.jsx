import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import TopTabPage from "../components/TopTabPage";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import MyButton from "../components/MyButton";
import { useTranslation } from "react-i18next";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../hooks/useTheme";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Actions() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [statusFocusedIndex, setStatusFocusedIndex] = useState(0);
  const status = ["All", "Pending", "In Progress", "Done"];
  const insets = useSafeAreaInsets();

  const statusPressHandle = (index) => {
    setStatusFocusedIndex(index);
  };

  const BackHandler = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: SIZES.small + insets.top }]}>
      <StatusBar
        backgroundColor="transparent"
        style={theme.name === "dark" ? "light" : "dark"}
      />
      <TopTabPage text={t("actions.title")} BackHandler={BackHandler} />
      <View style={{ alignItems: "flex-start" }}>
        <FlatList
          data={status}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingInline: SIZES.small,
            gap: SIZES.medium,
          }}
          renderItem={({ item, index }) => {
            const isFocused = index === statusFocusedIndex;

            return (
              <MyButton
                pressHandler={() => statusPressHandle(index)}
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
                      color:
                        index === statusFocusedIndex
                          ? COLORS.white
                          : COLORS.gray,
                      fontFamily: FONTS.medium,
                      fontSize: SIZES.medium,
                    }}>
                    {item}
                  </Text>
                </View>
              </MyButton>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.medium,
    gap: SIZES.large,
  },
});
