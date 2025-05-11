import {
  I18nManager,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";
import MyButton from "./MyButton";
import { useTranslation } from "react-i18next";

export default function SearchFilter({
  searchQuery,
  setSearchQuery,
  searchFilterHandler,
  handleFilterPress,
  handleAddPress,
  clearSearchInputHandler,
  searchPlaceholder,
}) {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const isRTL = I18nManager.isRTL || i18n.language === "ar";

  const handleTextChange = (text) => {
    setSearchQuery(text);
    searchFilterHandler && searchFilterHandler(text);
  };

  return (
    <View style={styles.searchFilterContainer}>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" style={styles.searchIcon} />
        <TextInput
          style={[
            styles.searchInput,
            {
              textAlign: isRTL ? "right" : "left",
              color: theme.name === "dark" ? COLORS.white : COLORS.black,
            },
          ]}
          value={searchQuery}
          onChangeText={handleTextChange}
          placeholderTextColor={COLORS.gray}
          placeholder={searchPlaceholder}
        />
        {searchQuery !== "" && (
          <MaterialIcons
            name="clear"
            style={styles.searchIcon}
            onPress={clearSearchInputHandler && clearSearchInputHandler}
            color={"red"}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 0.5 * SIZES.small,
          alignItems: "center",
        }}>
        <MyButton pressHandler={handleAddPress}>
          <View style={styles.filter}>
            <MaterialIcons name="add" style={styles.filterIcon} />
          </View>
        </MyButton>
        <MyButton pressHandler={handleFilterPress}>
          <View style={styles.filter}>
            <MaterialIcons name="filter-list" style={styles.filterIcon} />
          </View>
        </MyButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: SIZES.medium,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 10,
    flex: 1,
    gap: 0.5 * SIZES.small,
    padding: SIZES.small,
    height: SIZES.xLarge,
  },
  searchIcon: {
    fontSize: 1.4 * SIZES.medium,
    color: COLORS.gray,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.medium,
    fontFamily: FONTS.medium,
  },
  filter: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    height: SIZES.xLarge,
    width: SIZES.xLarge,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  filterIcon: {
    fontSize: SIZES.large,
    color: COLORS.white,
  },
});
