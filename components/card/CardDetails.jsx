import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from "react-native";
import React, { useRef, useState } from "react";
import TopTabPage from "../TopTabPage";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import CardHeader from "./CardHeader";
import CustomProgressSteps from "../CustomProgressSteps";
import CardInfo from "./CardInfo";
import { MenuProvider } from "react-native-popup-menu";
import { Feather } from "@expo/vector-icons";
import MyButton from "../MyButton";
import { useTheme } from "../../contexts/ThemeProvider";
import { t } from "i18next";
import { TabSelector } from "./TabSelector";
import PagerView from "react-native-pager-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabs = [
  { id: 1, label: "description" },
  { id: 2, label: "actions" },
  { id: 3, label: "images" },
];

export default function CardDetails({
  cardData,
  categoryColor,
  setModalVisible,
  isRTL,
}) {
  const { theme } = useTheme();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupImgUri, setPopupImgUri] = useState("");
  const [imgHeight, setImgHeight] = useState(0);
  const [activeTab, setActiveTab] = useState(1);
  const [activePage, setActivePage] = useState(0);
  const pagerViewRef = useRef(null);
  const insets = useSafeAreaInsets();

  const hideModal = () => {
    setModalVisible(false);
  };

  const onTabChange = (id) => {
    setActiveTab(id);
    pagerViewRef.current?.setPage(id - 1);
  };

  const getData = (data, type) => {
    return data?.find((item) => item?.label === type).value;
  };

  const handlePageSelected = (event) => {
    const index = event.nativeEvent.position;
    setActivePage(index);
    setActiveTab(index + 1);
  };

  return (
    <MenuProvider
      skipInstanceCheck
      style={{
        backgroundColor: theme.background,
        paddingTop: SIZES.small + insets.top,
      }}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <TopTabPage
          text={t("cardDetails.tagDetails")}
          BackHandler={hideModal}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          nestedScrollEnabled={true}
          contentContainerStyle={[
            {
              gap: SIZES.large,
            },
          ]}>
          <CardHeader
            TagNumber={cardData.tagNumber}
            category={t(`cardDetails.category.${cardData.category}`)}
            priority={cardData.priority}
            categoryColor={categoryColor}
            isRTL={isRTL}
          />
          <CustomProgressSteps DATA={cardData.progressSteps} />
          <CardInfo
            cardDetails={cardData.taskDetails}
            preventData={["images", "actions", "description"]}
            isRTL={isRTL}
          />
          {/* TabSelector */}

          <View style={{ gap: SIZES.medium }}>
            <TabSelector
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={onTabChange}
              isRTL={isRTL}
            />
          </View>

          <PagerView
            ref={pagerViewRef}
            pageMargin={SIZES.medium}
            style={{ minHeight: 3 * SIZES.xLarge }}
            initialPage={activePage}
            onPageSelected={handlePageSelected}>
            <View key="1">
              <ScrollView
                nestedScrollEnabled={true}
                contentContainerStyle={{ paddingInlineEnd: SIZES.small }}>
                <Text style={{ color: theme.text }}>
                  {getData(cardData.taskDetails, "description")}
                </Text>
              </ScrollView>
            </View>

            <View key="2">
              <ScrollView
                nestedScrollEnabled={true}
                contentContainerStyle={{ paddingInlineEnd: SIZES.small }}>
                <Text style={{ color: theme.text }}>
                  {getData(cardData.taskDetails, "actions")}
                </Text>
              </ScrollView>
            </View>

            <View key="3">
              <FlatList
                data={cardData?.images?.value}
                horizontal
                style={{ marginLeft: SIZES.medium }}
                keyExtractor={(item, index) => index}
                showsHorizontalScrollIndicator={false}
                estimatedItemSize={200}
                ListEmptyComponent={() => (
                  <Text style={styles.label}>
                    {t("cardDetails.no_iamge_found")}{" "}
                  </Text>
                )}
                contentContainerStyle={styles.imgsContainer}
                renderItem={({ item }) => (
                  <MyButton
                    pressHandler={() => {
                      setPopupImgUri(item.uri);

                      Image.getSize(item.uri, (width, height) => {
                        const aspectRatio = height / width;
                        setImgHeight(350 * aspectRatio);

                        requestAnimationFrame(() => {
                          setPopupVisible(true);
                        });
                      });
                    }}>
                    <View style={{ overflow: "hidden", borderRadius: 10 }}>
                      <Image
                        source={{ uri: item.uri }}
                        style={{
                          width: 4 * SIZES.xLarge,
                          height: 3 * SIZES.xLarge,
                          borderRadius: 10,
                          transform: [{ scale: 1.5 }],
                        }}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.imgOverlay}>
                      <View
                        style={{
                          backgroundColor: COLORS.semiTransparentBlack,
                          padding: SIZES.small,
                          borderWidth: 1,
                          borderRadius: 10,
                          borderColor: COLORS.primary,
                        }}>
                        <Feather
                          name="zoom-in"
                          size={SIZES.medium}
                          color="white"
                        />
                      </View>
                    </View>
                  </MyButton>
                )}
              />
            </View>
          </PagerView>
        </ScrollView>

        {/* Image Popup */}
        <Modal
          transparent={true}
          statusBarTranslucent
          visible={popupVisible}
          onRequestClose={() => setPopupVisible(false)}>
          <Pressable
            style={{
              zIndex: 9,
              height: "100%",
              width: "100%",
              backgroundColor: COLORS.semiTransparentBlack,
              justifyContent: "center",
              alignItems: "center",
              paddingRight: SIZES.medium,
              paddingLeft: SIZES.medium,
            }}
            onPress={() => {
              setPopupVisible(false);
            }}>
            <Pressable
              style={{
                width: "100%",
                height: imgHeight,
              }}>
              <Pressable
                onPress={() => {
                  setPopupVisible(false);
                }}
                style={{
                  backgroundColor: COLORS.semiTransparentBlack,
                  padding: SIZES.small,
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: COLORS.primary,
                  marginRight: SIZES.small,
                  position: "absolute",
                  top: SIZES.medium,
                  right: SIZES.medium,
                  zIndex: 11,
                }}>
                <Feather name="zoom-out" size={SIZES.medium} color="white" />
              </Pressable>
              <Image
                source={{ uri: popupImgUri }}
                style={{
                  width: "100%",
                  height: imgHeight,
                  maxHeight: "100%",
                  zIndex: 10,
                }}
                resizeMode="cover"
              />
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 1.5 * SIZES.medium,
    paddingTop: 0,
    gap: SIZES.large,
    flex: 1,
  },

  imgsContainer: {
    gap: SIZES.small,
    alignItems: "center",
  },
  imgOverlay: {
    backgroundColor: COLORS.semiTransparentBlack,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,

    justifyContent: "center",
    alignItems: "center",
    zIndex: 9,
  },

  label: {
    color: COLORS.gray,
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    paddingVerticalEnd: SIZES.medium,
  },
});
