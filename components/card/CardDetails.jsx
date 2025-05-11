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
import React, { useRef, useState, useEffect } from "react";
import TopTabPage from "../TopTabPage";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import CardHeader from "./CardHeader";
import CustomProgressSteps from "../CustomProgressSteps";
import CardInfo from "./CardInfo";
import { MenuProvider } from "react-native-popup-menu";
import { Feather } from "@expo/vector-icons";
import MyButton from "../MyButton";
import { useTheme } from "../../hooks/useTheme";
import { t } from "i18next";
import { TabSelector } from "./TabSelector";
import PagerView from "react-native-pager-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabs = [
  { id: 1, label: "description" },
  { id: 2, label: "actions" },
  { id: 3, label: "images" },
];

// Fixed item dimensions for FlatList
const ITEM_WIDTH = 4 * SIZES.xLarge;
const ITEM_HEIGHT = 3 * SIZES.xLarge;
const ITEM_SPACING = SIZES.small;

export default function CardDetails({
  cardData,
  categoryColor,
  setModalVisible,
  progressSteps,
  cardDetails,
  isRTL,
}) {
  const { theme } = useTheme();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupImgUri, setPopupImgUri] = useState("");
  const [imgHeight, setImgHeight] = useState(0);
  const [activeTab, setActiveTab] = useState(1);
  const [activePage, setActivePage] = useState(0);
  const pagerViewRef = useRef(null);
  const flatListRef = useRef(null);
  const insets = useSafeAreaInsets();

  // Ensure images data is properly formatted
  const imageData = React.useMemo(() => {
    if (!cardData?.images) return [];
    return Array.isArray(cardData.images) ? cardData.images : [cardData.images];
  }, [cardData?.images]);

  const hideModal = () => {
    setModalVisible(false);
  };

  const onTabChange = (id) => {
    setActiveTab(id);
    pagerViewRef.current?.setPage(id - 1);
  };

  const getData = (data, type) => {
    return data?.find((item) => item?.label === type)?.value;
  };

  const handlePageSelected = (event) => {
    const index = event.nativeEvent.position;
    setActivePage(index);
    setActiveTab(index + 1);
  };

  // Pre-calculate image dimensions when component mounts
  useEffect(() => {
    if (imageData.length > 0) {
      imageData.forEach((image) => {
        if (image) {
          Image.prefetch(image).catch((err) =>
            console.log("Image prefetch error:", err)
          );
        }
      });
    }
  }, [imageData]);

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
          nestedScrollEnabled={true}>
          <View style={{ gap: SIZES.large }}>
            <CardHeader
              TagNumber={cardData?.tagId}
              category={t(
                `cardDetails.category.${cardData?.category?.toLowerCase()}`
              )}
              priority={cardData?.priority?.toLowerCase()}
              categoryColor={categoryColor}
              isRTL={isRTL}
            />

            <CustomProgressSteps DATA={progressSteps} />

            <CardInfo
              cardDetails={cardDetails}
              preventData={["images", "actions", "description"]}
              isRTL={isRTL}
            />

            <View style={{ gap: SIZES.medium }}>
              <TabSelector
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={onTabChange}
                isRTL={isRTL}
              />
            </View>
          </View>

          {/* TabSelector Data */}
          <PagerView
            ref={pagerViewRef}
            pageMargin={SIZES.medium}
            style={{
              height: 3 * SIZES.xLarge + 2 * SIZES.large,
            }}
            initialPage={activePage}
            onPageSelected={handlePageSelected}>
            <View key="1" style={{ paddingTop: SIZES.large }}>
              <ScrollView nestedScrollEnabled={true}>
                <Text style={{ color: theme.text }}>
                  {cardData?.description}
                </Text>
              </ScrollView>
            </View>

            <View key="2" style={{ paddingTop: SIZES.large }}>
              <ScrollView nestedScrollEnabled={true}>
                <Text style={{ color: theme.text }}>
                  {/* Content for actions tab */}
                </Text>
              </ScrollView>
            </View>

            <View key="3" style={{ paddingTop: SIZES.large }}>
              <FlatList
                ref={flatListRef}
                data={imageData}
                horizontal
                keyExtractor={(item, index) => `image-${index}`}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={3}
                maxToRenderPerBatch={5}
                windowSize={5}
                getItemLayout={(data, index) => ({
                  length: ITEM_WIDTH,
                  offset: (ITEM_WIDTH + ITEM_SPACING) * index,
                  index,
                })}
                ListEmptyComponent={() => (
                  <Text
                    style={{
                      color: COLORS.gray,
                      fontFamily: FONTS.regular,
                      fontSize: SIZES.medium,
                      paddingVerticalEnd: SIZES.medium,
                    }}>
                    {t("cardDetails.no_iamge_found")}
                  </Text>
                )}
                contentContainerStyle={{
                  gap: SIZES.small,
                }}
                renderItem={({ item: image }) => {
                  if (!image) return null;

                  return (
                    <MyButton
                      pressHandler={() => {
                        setPopupImgUri(image);

                        // Pre-calculate image height before showing modal
                        Image.getSize(
                          image,
                          (width, height) => {
                            const aspectRatio = height / width;
                            const calculatedHeight = 350 * aspectRatio;

                            setImgHeight(calculatedHeight);
                            // Use requestAnimationFrame to ensure UI updates before showing modal
                            requestAnimationFrame(() => {
                              setPopupVisible(true);
                            });
                          },
                          (error) => {
                            console.log("Error getting image size:", error);
                            // Show modal anyway with a default height
                            setImgHeight(350);
                            setPopupVisible(true);
                          }
                        );
                      }}>
                      <View style={{ overflow: "hidden", borderRadius: 10 }}>
                        <Image
                          source={{ uri: image }}
                          style={{
                            width: ITEM_WIDTH,
                            height: ITEM_HEIGHT,
                            borderRadius: 10,
                            transform: [{ scale: 1.5 }],
                          }}
                          resizeMode="cover"
                        />
                      </View>
                      <View
                        style={{
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
                        }}>
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
                  );
                }}
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
              flex: 1,
              backgroundColor: COLORS.semiTransparentBlack,
              justifyContent: "center",
              alignItems: "center",
              paddingRight: SIZES.medium,
              paddingLeft: SIZES.medium,
              paddingTop: insets.top + SIZES.small,
              overflow: "hidden",
            }}
            onPress={() => {
              setPopupVisible(false);
            }}>
            <Pressable
              style={{
                width: "100%",
                maxHeight: imgHeight,
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
                resizeMode="contain"
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
