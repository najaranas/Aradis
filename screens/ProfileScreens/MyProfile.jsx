//
// MyProfile.jsx
// this component is responsible for displaying and editing the user's profile information.
// It includes a profile image, user details, and a save button to apply changes.
// It uses React Native components, Expo's ImagePicker for selecting images, and a custom button component.
// It also utilizes context providers for theme and authentication management, and i18next for translations.
//

import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  TouchableHighlight,
} from "react-native";
import { useRef, useState } from "react";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import TopTabPage from "../../components/TopTabPage";
import { Feather, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { getMYPROFILEDATA } from "../../constants/data";
import MyButton from "../../components/MyButton";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getStoredValue } from "../../utils/storage";
import { updateUserProfileImage } from "../../utils/api/userApi";
import { workerMan } from "../../constants/dataImage";
import { useUser } from "../../hooks/useUser";

export default function MyProfile({ navigation }) {
  const { theme } = useTheme();
  const { userData, updateUserData } = useUser();
  const [selectedImg, setSelectedImg] = useState(userData?.image || workerMan);
  const [isdataChanged, setIsdataChanged] = useState(false);
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef();
  const inputRefs = useRef([]);
  const MYPROFILEDATA = getMYPROFILEDATA(userData);
  const { t } = useTranslation();

  /**
   * Saves the profile image and navigates back to the previous screen.
   * If no data has changed, it simply returns.
   * Handles the image upload process and updates the user data.
   */
  const saveBtnHandler = () => {
    if (!isdataChanged) return;
    handleProfileImageUpload();
    navigation.goBack();
  };

  /**
   * Handles the profile image upload process.
   * Updates the user data with the new image.
   * Sends the image to the server for updating the user's profile.
   * @async
   * @returns {Promise<void>}
   * @throws {Error} If the image upload fails.
   *
   */
  const handleProfileImageUpload = async () => {
    try {
      const token = await getStoredValue("token");
      updateUserData({ image: selectedImg });
      const response = await updateUserProfileImage(
        userData?.id,
        selectedImg,
        token
      );
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Scrolls to the input field at the specified index.
   * This function is called when an input field is focused.
   * It ensures that the input field is visible on the screen.
   * @param {number} index - The index of the input field to scroll to.
   */
  const scrollToInput = (index) => {
    if (scrollViewRef.current) {
      // Scroll to the item at the specified index
      scrollViewRef.current.scrollToIndex({
        index,
        animated: true,
        viewOffset: SIZES.xLarge, // Add some padding at the top
      });
    }
  };

  /**
   * Handles the back button press.
   * Navigates back to the previous screen.
   * This function is called when the back button in the header is pressed.
   */
  const BackHandler = () => {
    navigation.goBack();
  };

  /**
   * Renders each item in the FlatList.
   * Displays a label and an input field for user data.
   * @param {object} item - The item data to render.
   * @param {number} index - The index of the item in the list.
   * @return {JSX.Element} The rendered item component.
   * */
  const renderItem = ({ item, index }) => (
    <View style={styles.inputBox}>
      <Text style={[styles.labelText, { color: theme.darkGray }]}>
        {t(item.translationKey)}
      </Text>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor:
              item.editable === false ? theme.lightGray : theme.background,
            opacity: item.editable === false ? 0.4 : 1,
            borderColor: theme.lightGray,
          },
        ]}>
        <TextInput
          defaultValue={item.value}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          onFocus={() => scrollToInput(index)}
          keyboardType={item.keyboardType || "default"}
          style={[styles.input, { color: theme.text }]}
          autoCorrect={false}
          editable={item.editable !== false}
          autoCapitalize="none"
        />
      </View>
    </View>
  );

  /**
   * Handles the image selection process.
   * Allows the user to choose an image from the library or take a new photo with the camera.
   * @param {string} type - The type of image selection ("photo" or "camera").
   * @throws {Error} If the image selection fails.
   */
  const changeImgHandler = async (type) => {
    try {
      let result;

      if (type === "photo") {
        result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 1,
        });
      } else if (type === "camera") {
        result = await ImagePicker.launchCameraAsync({
          quality: 1,
        });
      }

      if (!result.canceled) {
        setSelectedImg(result.assets[0].uri);
        setIsdataChanged(true);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  /**
   * Handles the removal of the selected image.
   * Sets the selected image back to the default user image.
   * This function is called when the user selects the "Delete" option from the image picker popup.
   */
  const removeImgHandler = () => {
    setSelectedImg(userData?.image);
  };

  return (
    <View style={[styles.container, { paddingTop: SIZES.small + insets.top }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ gap: SIZES.large }}>
          <TopTabPage
            text={t("myProfile.my_profile")}
            BackHandler={BackHandler}>
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
                {t("myProfile.save")}
              </Text>
            </MyButton>
          </TopTabPage>

          {/* User Image */}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Menu>
              <MenuTrigger
                customStyles={{
                  triggerWrapper: {
                    padding: 0,
                  },
                  triggerTouchable: {
                    underlayColor: "transparent",
                    activeOpacity: 50,
                  },
                  TriggerTouchableComponent: TouchableHighlight,
                }}>
                <View style={{ borderRadius: 50 }}>
                  <View
                    style={[
                      styles.myImg,
                      { backgroundColor: COLORS.lightGray },
                    ]}>
                    <Image
                      source={
                        typeof selectedImg === "string"
                          ? { uri: selectedImg }
                          : selectedImg
                      }
                      style={styles.myImg}
                    />
                  </View>

                  <View
                    style={[
                      styles.editIconContainer,
                      { backgroundColor: theme.background },
                    ]}>
                    <Feather
                      name="edit-3"
                      style={[
                        styles.editIcon,
                        {
                          backgroundColor: theme.primary,
                          color: theme.white,
                        },
                      ]}
                    />
                  </View>
                </View>
              </MenuTrigger>
              <MenuOptions
                optionsContainerStyle={{
                  backgroundColor: theme.background,
                  borderWidth: 1,
                  borderColor: theme.lightGray,
                  borderRadius: 10,
                  marginTop: 2 * SIZES.xLarge + 10,
                  marginRight: 2 * SIZES.xLarge,
                }}>
                <MenuOption
                  customStyles={{}}
                  onSelect={() => {
                    changeImgHandler("photo");
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
                    changeImgHandler("camera");
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
                  disabled={selectedImg !== userData?.image ? false : true}
                  onSelect={() => {
                    removeImgHandler();
                  }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: SIZES.small,
                      padding: SIZES.small,
                      opacity: selectedImg !== userData?.image ? 1 : 0.3,
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
          </View>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.dataContainer}>
        <FlatList
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ gap: SIZES.medium }}
          showsVerticalScrollIndicator={false}
          data={MYPROFILEDATA}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SIZES.large,
    flex: 1,
    padding: 1.5 * SIZES.medium,
  },
  saveBtn: {
    padding: SIZES.small,
    borderRadius: 10,
  },

  // image picker poup style

  myImg: {
    width: 2 * SIZES.xLarge,
    height: 2 * SIZES.xLarge,
    borderRadius: (2 * SIZES.xLarge) / 2,
    resizeMode: "cover",
  },
  editIconContainer: {
    padding: 4,
    position: "absolute",
    borderRadius: 50,
    right: 0,
    bottom: 0,
  },
  editIcon: {
    padding: 6,
    borderRadius: 50,
    fontSize: 0.6 * SIZES.large,
  },

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

  inputBox: {
    gap: SIZES.small,
  },
  labelText: {
    fontFamily: FONTS.medium,
  },
  dataContainer: {
    gap: SIZES.medium,
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.small,
    borderRadius: 10,
    padding: SIZES.medium,
    width: "100%",
    borderWidth: 2,
  },
  input: {
    fontSize: 1.2 * SIZES.medium,
    flex: 1,
    fontFamily: FONTS.medium,
  },
});
