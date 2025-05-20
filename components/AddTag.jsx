import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";
import { ADDTAGDETAILS } from "../constants/data";
import PagerView from "react-native-pager-view";
import { BlurView } from "expo-blur";
import Animated, { useSharedValue } from "react-native-reanimated";
import { Image } from "expo-image";
import CustomToast from "./CustomToast";
import AddTaskActionButtons from "./AddTaskActionButtons";
import AddTaskProgress from "./AddTaskProgress";
import AddTaskForm from "./AddTaskForm";
import { useTranslation } from "react-i18next";
import { generateId } from "../utils/generateTagId";
import { getStoredValue } from "../utils/storage";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// Create initialTagForm outside component to avoid recreation on every render
const buildInitialTagForm = () => {
  const initialForm = {};
  ADDTAGDETAILS.forEach(({ fields }) => {
    fields.forEach(({ type, selectType }) => {
      if (type === "image") {
        initialForm[selectType] = Array.from({ length: 4 }, (_, i) => ({
          id: (i + 1).toString(),
          selectedImg: null,
        }));
      } else if (type === "date" || type === "time" || type === "datetime") {
        initialForm[selectType] = new Date();
      } else {
        initialForm[selectType] = null;
      }
    });
  });
  return initialForm;
};

export default function AddTag() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Lazy initialization of formData using a function
  const [formData, setFormData] = useState(() => buildInitialTagForm());
  const [progress, setProgress] = useState(1 / ADDTAGDETAILS.length);
  const [activeFormPage, setActiveFormPage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  // Initialize refs lazily
  const pagerViewRef = useRef(null);
  const imgFlatlistRef = useRef(null);
  const pageFlatlistRef = useRef([]);

  const translateY = useSharedValue(SIZES.xLarge);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Use memo for validation functions to avoid recreating them on every render
  const isEmpty = useCallback((val) => {
    return (
      val === null ||
      val === undefined ||
      val.length === 0 ||
      val.toString().trim() === ""
    );
  }, []);

  const errorHandling = useCallback(
    (value, fieldType) => {
      switch (fieldType) {
        case "tagNumber":
          const tagNumberPattern = /^#TAG-\d+$/;
          if (isEmpty(value) || !tagNumberPattern.test(value)) {
            return {
              isValid: false,
              message: "Please enter a valid tag number (e.g., #TAG-123456).",
            };
          }
          return { isValid: true };

        case "category":
          if (isEmpty(value)) {
            return {
              isValid: false,
              message: "Please select a valid category.",
            };
          }
          return { isValid: true };

        case "description":
          if (isEmpty(value) || value.toString().trim().length < 10) {
            return {
              isValid: false,
              message: "Description must be at least 10 characters long.",
            };
          }
          return { isValid: true };

        case "images":
          if (!Array.isArray(value) || !value.some((img) => img.selectedImg)) {
            return {
              isValid: false,
              message: "Please upload at least one image of the anomaly.",
            };
          }
          return { isValid: true };

        case "zone":
          const zonePattern = /^[A-Za-z]$/;

          if (isEmpty(value) || !zonePattern.test(value)) {
            return {
              isValid: false,
              message: "Please enter a valid zone (e.g., Zone A).",
            };
          }
          return { isValid: true };

        case "machine":
          const machinePattern = /^[1-9]\d*$/;
          if (isEmpty(value) || !machinePattern.test(value)) {
            return {
              isValid: false,
              message: "Please enter a valid machine name (e.g., Machine 5).",
            };
          }
          return { isValid: true };

        case "equipment":
        case "priority":
        case "status":
        case "foundBy":
          if (isEmpty(value)) {
            return {
              isValid: false,
              message: `Please enter a valid ${fieldType}.`,
            };
          }
          return { isValid: true };

        case "responsiblePerson":
          if (isEmpty(value)) {
            return {
              isValid: false,
              message:
                "Please select the person(s) responsible for resolving the anomaly.",
            };
          }
          return { isValid: true };

        case "actions":
          if (isEmpty(value) || value.toString().trim().length < 10) {
            return {
              isValid: false,
              message:
                "Please describe the actions to be taken (minimum 10 characters).",
            };
          }
          return { isValid: true };

        case "deadline":
          const todayDate = new Date();
          const pickedDate = new Date(value);
          if (
            isEmpty(value) ||
            isNaN(pickedDate.getTime()) ||
            pickedDate <= todayDate
          ) {
            return {
              isValid: false,
              message:
                "Please select a valid deadline date (must be in the future).",
            };
          }
          return { isValid: true };

        default:
          return { isValid: true };
      }
    },
    [isEmpty]
  );

  const onModalRequestClose = useCallback(() => {
    setModalVisible(false);
    resetPageViewer();
  }, []);

  /**
   * Handles the "Continue" button click.
   * Moves to the Next form page after the Validation
   */
  const handleContinueBtn = useCallback(() => {
    const activeFields = ADDTAGDETAILS[activeFormPage]["fields"];
    let hasError = false;

    // Optimize validation to exit early
    for (let i = 0; i < activeFields.length; i++) {
      const fielName = activeFields[i];
      const validationResult = errorHandling(
        formData[fielName?.selectType],
        fielName?.selectType
      );

      if (!validationResult.isValid) {
        setToast({
          show: true,
          message: t(`addTagDetailsErrors.${fielName?.selectType}`),
          type: "error",
        });
        hasError = true;
        break;
      }
    }

    if (hasError) {
      return;
    }

    if (activeFormPage === ADDTAGDETAILS.length - 1) {
      handleFinishBtn();
      return;
    }

    const nextPage = activeFormPage + 1;
    setActiveFormPage(nextPage);
    if (pagerViewRef.current) {
      pagerViewRef.current.setPage(nextPage);
    }

    setProgress((oldValue) => oldValue + 1 / ADDTAGDETAILS.length);
  }, [activeFormPage, errorHandling, formData, , t]);

  /**
   * Handles the "Back" button click.
   * Moves to the previous form page.
   */
  const handleBackBtn = useCallback(() => {
    if (activeFormPage === 0) return; // Disable back button on the first page

    const prevPage = activeFormPage - 1;
    setActiveFormPage(prevPage);
    if (pagerViewRef.current) {
      pagerViewRef.current.setPage(prevPage);
    }

    setProgress((oldValue) => oldValue - 1 / ADDTAGDETAILS.length);
  }, [activeFormPage]);

  /**
   * Handles the "Finish" button click.
   */
  const handleFinishBtn = useCallback(() => {
    setModalVisible(true);
    sendDataToServer();
  }, [formData]);

  const sendDataToServer = useCallback(async () => {
    try {
      const formDataToSend = new FormData();
      const tagId = generateId("TAG");

      formDataToSend.append("zone", formData?.zone);
      formDataToSend.append("machine", formData?.machine);
      formDataToSend.append("equipment", formData?.equipment);
      formDataToSend.append("description", formData?.description);
      formDataToSend.append("category", formData?.category?.type);
      formDataToSend.append("priority", formData?.priority?.type);

      // Add only the first image
      if (formData?.images?.[0]?.selectedImg) {
        formDataToSend.append("image", {
          uri: formData.images[0].selectedImg,
          name: "image1.jpg",
          type: "image/jpeg",
        });
      }

      // Add multiple images if needed
      formData?.images?.forEach((item, index) => {
        if (item.selectedImg) {
          formDataToSend.append("images", {
            uri: item.selectedImg,
            name: `image${index + 1}.jpg`,
            type: "image/jpeg",
          });
        }
      });

      const token = await getStoredValue("token");

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/tag/${tagId}`,
        {
          method: "POST",
          body: formDataToSend,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`,
          },
        }
      );
      console.log(res.json());
    } catch (error) {
      console.log(error);
    }
  }, [formData]);

  /**
   * Reset the Form and Clear all the input
   * Scroll to the top of the page
   */
  const resetPageViewer = useCallback(() => {
    setFormData(buildInitialTagForm());
    if (pagerViewRef.current) {
      pagerViewRef.current.setPage(0);
    }
    setActiveFormPage(0);
    setProgress(1 / ADDTAGDETAILS.length);

    if (imgFlatlistRef?.current) {
      imgFlatlistRef.current.scrollToOffset({ offset: 0 });
    }

    if (pageFlatlistRef?.current) {
      pageFlatlistRef.current.forEach((item) => {
        if (!item) return;
        item.scrollToOffset({
          offset: 0,
        });
      });
    }
  }, []);

  return (
    <View style={styles.container}>
      <CustomToast
        type={toast.type}
        duration={3000}
        isActive={toast.show}
        message={toast.message}
        setToast={setToast}
        toastTopPosition={SIZES.small}
      />

      <AddTaskProgress
        size={1.3 * SIZES.xLarge}
        progress={progress}
        sectionTitle={t(
          `addTagDetails.sections.${activeFormPage + 1}.sectionTitle`
        )}
        nextStep={t(
          `addTagDetails.sections.${activeFormPage + 1}.nextPageTitle`
        )}
        formatText={`${activeFormPage + 1} / ${ADDTAGDETAILS.length}`}
      />

      <View style={styles.content}>
        <PagerView
          scrollEnabled={false}
          ref={pagerViewRef}
          style={styles.pagerView}
          pageMargin={SIZES.medium}
          initialPage={activeFormPage}>
          {ADDTAGDETAILS.map((pageItem, pageIndex) => (
            <View style={styles.page} key={(pageIndex + 1).toString()}>
              <AddTaskForm
                setFormData={setFormData}
                theme={theme}
                userSearchStyles={userSearchStyles}
                translateY={translateY}
                formData={formData}
                styles={styles}
                formFieldsData={pageItem?.fields}
                pageIndex={pageIndex}
                imgFlatlistRef={imgFlatlistRef}
                pageFlatlistRef={pageFlatlistRef}
                translationType={"addTagDetails"}
              />
            </View>
          ))}
        </PagerView>

        <AddTaskActionButtons
          lastPage={activeFormPage + 1 === ADDTAGDETAILS.length}
          disabled={activeFormPage === 0}
          styles={actionButtonsStyles}
          handleBackBtn={handleBackBtn}
          handleContinueBtn={handleContinueBtn}
          backTranslationText={t("createTask.actionButtons.back")}
          finishTranslationText={t("createTask.actionButtons.finish")}
          continiueTranslationText={t("createTask.actionButtons.continue")}
        />
      </View>

      {/* Success Modal - Only render when visible */}
      {modalVisible && (
        <Modal
          animationType="slide"
          transparent
          statusBarTranslucent={true}
          visible={modalVisible}
          onRequestClose={onModalRequestClose}>
          <View style={styles.modalOverlay}>
            <Pressable
              style={styles.backdropPressable}
              onPress={onModalRequestClose}>
              <View style={styles.modalContainer}>
                <Pressable>
                  <View
                    style={[
                      styles.modalContent,
                      { backgroundColor: theme.background },
                    ]}>
                    <Image
                      source={require("../assets/icons/success.png")}
                      style={styles.successIcon}
                    />

                    <Text style={[styles.modalText, { color: theme.text }]}>
                      {t("addTagDetails.successfully_created")}
                    </Text>

                    <TouchableOpacity
                      onPress={onModalRequestClose}
                      style={styles.closeButton}>
                      <Text style={styles.closeText}>
                        {t("addTagDetails.close")}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalFooter} />
                </Pressable>
              </View>
            </Pressable>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    padding: 1.5 * SIZES.medium,
    gap: SIZES.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Keyboard Avoiding View Styles
  keyboardAvoidingView: {
    flex: 1,
  },

  // Content Styles
  content: {
    // paddingHorizontal: 1.5 * SIZES.medium,
    flex: 1,
    gap: SIZES.small,
    justifyContent: "flex-start",
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },

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

  // modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdropPressable: {
    backgroundColor: "#2e2d2da1",
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContainer: {
    zIndex: 1001,
    width: "80%",
    maxWidth: 300,
  },
  modalContent: {
    borderRadius: 10,
    gap: SIZES.small,
    paddingHorizontal: SIZES.xLarge,
    paddingVertical: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 2 * SIZES.xLarge,
    position: "relative",
    zIndex: 1002,
  },
  successIcon: {
    width: 130,
    height: 130,
    position: "absolute",
    top: -40,
    zIndex: 1003,
  },
  modalText: {
    fontFamily: FONTS.medium,
    fontSize: 1.3 * SIZES.medium,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: -SIZES.large,
    padding: SIZES.small,
    zIndex: 1004,
  },
  closeText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontFamily: FONTS.regular,
  },
  modalFooter: {
    height: 20,
    position: "absolute",
    left: SIZES.medium,
    right: SIZES.medium,
    bottom: 0,
    transform: [{ translateY: 10 }],
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: COLORS.secondary,
    zIndex: 1001,
  },
});

const userSearchStyles = StyleSheet.create({
  inputWrapper: {
    borderRadius: 10,
    padding: SIZES.small,
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  input: {
    fontSize: SIZES.medium,
    flex: 1,
    fontFamily: FONTS.medium,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.small,
  },
  userImage: {
    borderRadius: (1.2 * SIZES.large) / 2,
    width: 1.2 * SIZES.large,
    height: 1.2 * SIZES.large,
  },
  userName: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.medium,
    textTransform: "capitalize",
  },
  input: {
    minWidth: "100%",
  },
  userList: {
    minWidth: "100%",
  },
  listContent: {
    gap: SIZES.medium,
  },

  noUsersText: {
    fontSize: SIZES.medium,
  },
});

const actionButtonsStyles = StyleSheet.create({
  // Button Container Styles
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SIZES.small,
  },
  backButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: SIZES.medium,
    paddingVertical: 1.3 * SIZES.medium,
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: COLORS.black,
    fontSize: SIZES.medium,
  },
  disabledButton: {
    opacity: 0.4,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    paddingVertical: 1.3 * SIZES.medium,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: "center",
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
});
