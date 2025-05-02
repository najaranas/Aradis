import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Platform,
  TouchableHighlight,
  KeyboardAvoidingView,
  I18nManager,
} from "react-native";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import MyButton from "./MyButton";
import CustomDateTimePicker from "./CustomDateTimePicker";
import {
  Ionicons,
  FontAwesome6,
  FontAwesome5,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import SelectorDropdown from "./SelectorDropdown";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { Image } from "expo-image";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { formatDate } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function AddTaskForm({
  formData,
  formFieldsData,
  setFormData,
  pageIndex,
  translateY,
  theme,
  userSearchStyles,
  imgFlatlistRef,
  pageFlatlistRef,
  translationType,
}) {
  const [isImgItemAdded, SetIsImgItemAdded] = useState(false);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [animatingIndex, setAnimatingIndex] = useState(null);

  const { t, i18n } = useTranslation();

  const isRTL = I18nManager.isRTL || i18n.language === "ar";
  /**
   * Automatically adds a new image field if 4 or more images are selected.
   */
  useEffect(() => {
    let selectedCount = formData["images"]?.reduce(
      (count, field) => (field.selectedImg ? count + 1 : count),
      0
    );

    if (selectedCount >= 4) {
      setFormData((prevFields) => {
        const hasEmptyField = prevFields["images"].some(
          (field) => !field.selectedImg
        );

        if (!hasEmptyField) {
          const newImages = [
            ...prevFields["images"],
            {
              id: (prevFields["images"].length + Date.now()).toString(), // More robust ID
              selectedImg: null,
            },
          ];

          requestAnimationFrame(() => {
            if (imgFlatlistRef.current) {
              setTimeout(() => {
                imgFlatlistRef.current.scrollToEnd({ animated: true });
              }, 100);
            }
          });

          return {
            ...prevFields,
            images: newImages,
          };
        }
        return prevFields;
      });
    }
  }, [formData["images"]]);
  // Remove the second useEffect that depends on isImgItemAdded
  /**
   * Updates an image in the selected images list.
   *
   * Opens the image picker or camera based on the given type, updates the selected image,
   * and triggers an animation effect.
   * @param {number} index - The index of the image to update.
   * @param {string} type - The source of the image ('photo' for gallery, 'camera' for camera).
   */
  const changeImgHandler = async (index, type, isChange) => {
    try {
      let result;
      if (type === "photo") {
        result = await ImagePicker.launchImageLibraryAsync({
          // allowsEditing: true,
          quality: 1,
        });
      } else if (type === "camera") {
        result = await ImagePicker.launchCameraAsync({
          quality: 1,
        });
      }

      if (!result.canceled) {
        // First, reset animation position
        translateY.value = SIZES.xLarge;

        if (isChange) {
          SetIsImgItemAdded(false);
        } else {
          SetIsImgItemAdded(true);
        }
        handleFormData(
          { index: index, img: result.assets[0].uri },
          "image",
          "images"
        );

        // Mark which index is animating
        setAnimatingIndex(index);

        // requestAnimationFrame(() => {
        //   translateY.value = withSpring(0, {
        //     damping: 10,
        //     stiffness: 100,
        //   });
        // });
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const renderField = (item, index) => {
    if (
      item.type === "date" ||
      item.type === "time" ||
      item.type === "datetime"
    ) {
      return (
        <MyButton pressHandler={() => setIsDatePickerVisible(true)}>
          <View style={[styles.dateButton]}>
            <Text style={styles.dateButtonText}>
              {formatDate(
                formData[item.selectType],
                item.type === "date"
                  ? "MM-dd-yyyy"
                  : item.type === "time"
                  ? "HH:mm a"
                  : "MM-dd-yyyy HH:mm"
              )}
            </Text>
            <Ionicons name="calendar-outline" style={styles.dateButtonIcon} />
          </View>

          {/* Date component Handler */}
          <View style={{ position: "absolute", width: 0, height: 0 }}>
            <CustomDateTimePicker
              pickerMode={item.type}
              isVisible={isDatePickerVisible}
              setIsVisible={setIsDatePickerVisible}
              selectedDate={formData[item.selectType]}
              setSelectedDate={handleFormData}
              dateStateField={item?.selectType}
            />
          </View>
        </MyButton>
      );
    } else if (item.type === "image") {
      return (
        <FlatList
          horizontal
          style={{ flexGrow: 0 }}
          ref={imgFlatlistRef}
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={() => {
            if (isImgItemAdded) {
              imgFlatlistRef.current?.scrollToEnd({ animated: true });
            }
          }}
          contentContainerStyle={{
            height: "100%",
            gap: SIZES.small,
            paddingInline: 2,
          }}
          data={formData[item.selectType]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item: imgField, index: imgIndex }) => (
            <Menu key={imgIndex}>
              <MenuTrigger
                customStyles={{
                  triggerWrapper: {
                    padding: 0,
                  },
                  triggerTouchable: {
                    underlayColor: COLORS.secondary + 20,
                    activeOpacity: 50,
                  },
                  TriggerTouchableComponent: TouchableHighlight,
                }}>
                <View
                  style={[
                    styles.imgPickerContainer,
                    {
                      backgroundColor: imgField.selectedImg
                        ? "transparent"
                        : COLORS.secondary + "51",

                      borderColor: imgField.selectedImg
                        ? "transparent"
                        : COLORS.primary,
                    },
                  ]}>
                  {!imgField.selectedImg && (
                    <View style={[styles.addImgIcon]}>
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: 2 * SIZES.medium,
                          textAlign: "center",
                        }}>
                        +
                      </Text>
                    </View>
                  )}
                  {imgField.selectedImg && (
                    <View
                      style={[
                        {
                          position: "relative",
                          width: "100%",
                          flex: 1,
                        },
                      ]}>
                      <Image
                        source={{ uri: imgField.selectedImg }}
                        style={styles.addedImg}
                        contentFit="cover"
                      />
                      <AnimatedBlurView
                        intensity={50}
                        tint="dark"
                        style={[
                          styles.changeImgBg,
                          // imgField.id === animatingIndex
                          //   ? animatedStyle
                          //   : {
                          //       transform: [{ translateY: 0 }],
                          //     },
                        ]}>
                        <FontAwesome6
                          name="camera-rotate"
                          size={1.2 * SIZES.small}
                          color={COLORS.white}
                        />
                        <Text
                          style={{
                            fontFamily: FONTS.medium,
                            color: COLORS.white,
                            fontSize: SIZES.small,
                          }}>
                          {t("imgagePicker.change")}
                        </Text>
                      </AnimatedBlurView>
                    </View>
                  )}
                </View>
              </MenuTrigger>
              <MenuOptions
                optionsContainerStyle={[
                  styles.menuOptions,
                  {
                    backgroundColor: theme.background,
                    borderWidth: 1,
                    borderColor: theme.lightGray,
                    borderRadius: 10,
                    marginRight: SIZES.xLarge,
                    gap: 0,
                  },
                ]}>
                <MenuOption
                  customStyles={{}}
                  onSelect={() => {
                    const isChange = imgField.selectedImg !== null;
                    changeImgHandler(imgField.id, "photo", isChange);
                  }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: SIZES.small,
                      padding: SIZES.small,
                    }}>
                    <FontAwesome6 name="image" style={styles.addImPopupIcon} />
                    <Text style={styles.addImgPopupText}>
                      {t("imgagePicker.photo")}
                    </Text>
                  </View>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    changeImgHandler(imgField.id, "camera");
                  }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: SIZES.small,
                      padding: SIZES.small,
                    }}>
                    <Feather name="camera" style={styles.addImPopupIcon} />
                    <Text style={styles.addImgPopupText}>
                      {t("imgagePicker.camera")}
                    </Text>
                  </View>
                </MenuOption>
                <MenuOption
                  disabled={imgField?.selectedImg ? false : true}
                  onSelect={() => {
                    removeImgHandler(imgField, item.selectType);
                  }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: SIZES.small,
                      padding: SIZES.small,
                      opacity: imgField.selectedImg ? 1 : 0.3,
                    }}>
                    <FontAwesome5
                      name="trash-alt"
                      style={[styles.addImPopupIcon, { color: COLORS.red }]}
                    />
                    <Text
                      style={[styles.addImgPopupText, { color: COLORS.red }]}>
                      {t("imgagePicker.delete")}
                    </Text>
                  </View>
                </MenuOption>
              </MenuOptions>
            </Menu>
          )}
        />
      );
    } else if (item.type === "select" || item.type === "multiSelect") {
      return (
        <SelectorDropdown
          type={item.type}
          nstyles={userSearchStyles}
          data={item?.options}
          labelField={item.optionsLabelField}
          valueField="id"
          setSelectedData={handleFormData}
          placeholder={t(`${translationType}.fields.${item.id}.placeholder`)}
          multiple={item.type === "multiSelect"}
          selectType={item.selectType}
          searchPlaceholder={t(
            `${translationType}.fields.${item.id}.searchPlaceholder`
          )}
          value={formData[item.selectType]}
          itemID={item.id}
          translationType={translationType}
        />
      );
    } else {
      return (
        <View style={[styles.inputWrapper]}>
          <TextInput
            value={formData[item.selectType]}
            placeholder={t(`${translationType}.fields.${item.id}.placeholder`)}
            placeholderTextColor={COLORS.gray}
            keyboardType={item.keyboardType || "default"}
            style={[
              styles.input,
              {
                color: theme.text,
                textAlign: i18n.language === "ar" ? "right" : "auto",
              },
            ]}
            autoCorrect={false}
            editable={item.editable !== false}
            autoCapitalize="none"
            onChangeText={(text) => {
              handleFormData(text, "input", item?.selectType);
            }}
          />
        </View>
      );
    }
  };

  const handleFormData = (newData, type = null, fieldType) => {
    if (fieldType === "images") {
      setFormData((oldData) => {
        const updatedImagesFields = oldData[fieldType].map((field) =>
          field.id === newData?.index
            ? { ...field, selectedImg: newData?.img }
            : field
        );

        return {
          ...oldData,
          [fieldType]: updatedImagesFields,
        };
      });
      return;
    }

    setFormData((oldData) => {
      return {
        ...oldData,
        [fieldType]: newData,
      };
    });
  };

  const removeImgHandler = (item, fieldType) => {
    const id = item.id;
    if (!item.selectedImg) {
      return;
    }

    setFormData((prevFields) => {
      if (prevFields[fieldType].length <= 4) {
        const newImages = prevFields[fieldType].map((field) =>
          field.id === id ? { ...field, selectedImg: null } : field
        );
        return { ...prevFields, [fieldType]: newImages };
      } else {
        const filteredFields = prevFields[fieldType].filter(
          (field) => field.id !== id
        );
        const newImages = filteredFields.map((field, index) => ({
          // reset the ids because in the middle can be removed eg.1 2 4 5
          ...field,
          id: (index + 1).toString(),
        }));

        SetIsImgItemAdded(false);
        //
        return { ...prevFields, [fieldType]: newImages };
      }
    });
  };

  return (
    <FlatList
      data={formFieldsData}
      ref={(el) => (pageFlatlistRef.current[pageIndex] = el)}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
      contentContainerStyle={{
        alignItems: "flex-start",
        gap: SIZES.medium,
      }}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <View style={[styles.fieldContainer]}>
          <Text
            style={[
              styles.label,
              {
                color: COLORS.gray,
              },
            ]}>
            {t(`${translationType}.fields.${item.id}.label`)}
          </Text>
          {renderField(item, index)}
        </View>
      )}
    />
  );
}
const styles = StyleSheet.create({
  // Field Container Styles
  fieldContainer: {
    gap: SIZES.small,
    minWidth: "100%",
    alignItems: "flex-start",
  },
  label: {
    fontFamily: FONTS.medium,
  },
  fieldSeparator: {
    height: SIZES.medium,
  },

  // Input Styles
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.small,
    borderRadius: 10,
    padding: SIZES.small,
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.gray,
    minHeight: 1.4 * SIZES.xLarge,
  },
  input: {
    fontSize: SIZES.medium,
    flex: 1,
    fontFamily: FONTS.medium,
  },

  // Date Button Styles
  dateButton: {
    backgroundColor: "transparent",
    padding: SIZES.small,
    borderRadius: 10,
    borderWidth: 1,
    gap: SIZES.small,
    borderColor: COLORS.lightGray,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderColor: COLORS.gray,
  },
  dateButtonText: {
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  dateButtonIcon: {
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    fontSize: 1.5 * SIZES.medium,
  },

  // Image Picker Styles
  imgPickerContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    width: 2 * SIZES.xLarge,
    height: 2 * SIZES.xLarge,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  addImgIcon: {
    backgroundColor: COLORS.primary,
    padding: 2,
    width: 1.3 * SIZES.large,
    height: 1.3 * SIZES.large,
    borderRadius: (1.3 * SIZES.large) / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  addedImg: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    borderRadius: 10,
  },
  changeImgBg: {
    backgroundColor: "rgba(0, 0, 50, 0.4)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderRadius: 10,
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    padding: 0.5 * SIZES.small,
    overflow: "hidden",
  },

  // image picker poup style
  addImPopupIcon: {
    fontSize: 1.5 * SIZES.medium,
    color: COLORS.gray,
    minWidth: 0.7 * SIZES.large,
  },
  addImgPopupText: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
  },
});
