import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import TagFpsHeader from "../components/TagFpsHeader";
import { FONTS, SIZES } from "../constants/theme";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeProvider";
import SearchFilter from "../components/SearchFilter";
import { useTranslation } from "react-i18next";
import { FlashList } from "@shopify/flash-list";
import Card from "../components/card/Card";
import { TAGS } from "../constants/data";

export default function Fpss() {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [tags, setTags] = useState(TAGS);
  const listRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  /**
   * Opens the filter modal and dismisses keyboard
   * Triggered when user clicks the filter icon
   */
  const handleFilterPress = () => {
    setFilterModalVisible(true);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TagFpsHeader text={"QRQC Reporting (FPS)"}>
        <SimpleLineIcons
          name={"wrench"}
          size={SIZES.large * 0.8}
          color={theme.text}
        />
      </TagFpsHeader>

      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleFilterPress={handleFilterPress}
        // searchFilterHandler={}
        // clearSearchInputHandler={}
        searchPlaceholder={"Search..."}
        isRTL={isRTL}
      />

      {/* card list  */}
      <View style={{ flex: 1 }}>
        {tags.length ? (
          <FlashList
            ref={listRef}
            data={tags}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View style={{ height: SIZES.medium }} />
            )}
            contentContainerStyle={styles.tagsContentContainer}
            estimatedItemSize={200}
            renderItem={({ item, index }) => (
              <Card
                cardData={item}
                isUpdated={true}
                isRTL={isRTL}
                preventData={[
                  "deadline",
                  "actions",
                  "images",
                  "machine",
                  "equipment",
                ]}
              />
            )}
          />
        ) : (
          // No data Found
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ height: "100%" }}>
              <Text
                style={{
                  ...styles.noDataFound,
                  color: theme.gray,
                }}>
                {t("tagsReporting.noTags")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.medium,
    gap: SIZES.medium,
  },
  noDataFound: {
    textAlign: "center",
    fontFamily: FONTS.regular,
    fontSize: SIZES.large,
  },
});
