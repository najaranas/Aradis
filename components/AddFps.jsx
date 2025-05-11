import {
  Button,
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";
import { ADDFPSDETAILS } from "../constants/data";
import PagerView from "react-native-pager-view";

import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { Image } from "expo-image";
import AddTaskActionButtons from "./AddTaskActionButtons";
import AddTaskProgress from "./AddTaskProgress";
import AddTaskForm from "./AddTaskForm";
import { useTranslation } from "react-i18next";
import * as NavigationBar from "expo-navigation-bar";
import MyButton from "./MyButton";
import ActionPage from "./formPages/ActionPage";
import { generateId } from "../utils/generateTagId";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

let initialFpsForm = {};
ADDFPSDETAILS.forEach(({ fields }) => {
  fields.forEach(({ type, selectType, options }) => {
    if (type === "image") {
      initialFpsForm[selectType] = Array.from({ length: 4 }, (_, i) => ({
        id: (i + 1).toString(),
        selectedImg: null,
      }));
    } else if (type === "actionResults") {
    } else if (type === "date" || type === "time" || type === "datetime") {
      initialFpsForm[selectType] = new Date();
    } else {
      initialFpsForm[selectType] = null;
    }
  });
});

export default function AddFps() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [progress, setProgress] = useState(1 / ADDFPSDETAILS?.length);
  const [activeFormPage, setActiveFormPage] = useState(0);
  const [tagId, setTagId] = useState(generateId());

  const [modalVisible, setModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);

  const [animatingIndex, setAnimatingIndex] = useState(null);
  const pagerViewRef = useRef(null);
  const imgFlatlistRef = useRef(null);
  const pageFlatlistRef = useRef([]);

  const translateY = useSharedValue(SIZES.xLarge);
  const [formData, setFormData] = useState(initialFpsForm);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "",
  });

  /**
   * Check if value is empty or not
   * @param {any} val
   * @returns {boolean} Returns `true` if the value is empty, otherwise `false`.
   */
  const isEmpty = (val) => {
    return (
      val === null ||
      val === undefined ||
      val.length === 0 ||
      val.toString().trim() === ""
    );
  };

  /**
   * Validates the input value based on the specified field type.
   * Displays an error message if validation fails.
   *
   * @param {any} value - The value to be validated.
   * @param {string} fieldType - The type of the field being validated.
   * @returns {boolean} - Returns `true` if the value is valid, otherwise `false`.
   */
  const errorHandling = (value, selectType) => {
    // Validation based on field type and select type
    switch (selectType) {
      case "serialNumber":
        const serialNumberPattern = /^S\/N-\d+$/;
        // if (isEmpty(value) || !serialNumberPattern.test(value)) {
        if (isEmpty(value)) {
          return {
            isValid: false,
            message: "Please enter a valid serial number (e.g., S/N-123456).",
          };
        }
        return { isValid: true };

      case "reference":
        const referencePattern = /^REF-\d+$/;
        // if (isEmpty(value) || !referencePattern.test(value)) {
        if (isEmpty(value)) {
          return {
            isValid: false,
            message: "Please enter a valid reference number (e.g., REF-98765).",
          };
        }
        return { isValid: true };

      case "dateTime":
        const todayDate = new Date();
        todayDate.setHours(0);
        const pickedDate = new Date(value);

        if (isEmpty(value) || isNaN(pickedDate.getTime())) {
          return {
            isValid: false,
            message: "Please enter a valid date",
          };
        }
        return { isValid: true };

      case "location":
        if (isEmpty(value)) {
          return {
            isValid: false,
            message: "Please enter a valid detection location.",
          };
        }
        return { isValid: true };

      case "detectedBy":
        if (isEmpty(value)) {
          return {
            isValid: false,
            message: "Please select who detected the issue.",
          };
        }
        return { isValid: true };

      case "detectionMethod":
        if (isEmpty(value)) {
          return {
            isValid: false,
            message: "Please specify the detection method.",
          };
        }
        return { isValid: true };

      case "defectiveQuantity":
        const quantity = Number(value);
        if (isEmpty(value) || quantity < 0) {
          return {
            isValid: false,
            message: "Please enter a valid defective quantity.",
          };
        }
        return { isValid: true };

      case "customerRisk":
        const validCustomerRiskOptions = ["Yes", "No"];
        if (isEmpty(value) || !validCustomerRiskOptions.includes(value?.type)) {
          return {
            isValid: false,
            message: "Please select a valid customer risk option.",
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

      case "notifiedTeams":
        if (isEmpty(value)) {
          return {
            isValid: false,
            message: "Please select at least one notified team.",
          };
        }
        return { isValid: true };

      case "produit":
        if (isEmpty(value)) {
          return {
            isValid: false,
            message: "Please describe Produit concerné.",
          };
        }
        return { isValid: true };

      case "immediateActions":
        if (isEmpty(value) || value.length < 10) {
          return {
            isValid: false,
            message:
              "Please describe immediate actions taken (minimum 10 characters).",
          };
        }
        return { isValid: true };

      case "sortingRequired":
        const validSortingOptions = ["Yes", "No"];
        if (isEmpty(value) || !validSortingOptions.includes(value.type)) {
          return {
            isValid: false,
            message: "Please select if sorting is required.",
          };
        }
        return { isValid: true };

      case "sortingResults":
        if (isEmpty(value) || value.length < 5) {
          return {
            isValid: false,
            message: "Please provide sorting results (minimum 5 characters).",
          };
        }
        return { isValid: true };

      case "sortingResultsNOK":
        if (isEmpty(value) || value.length < 5) {
          return {
            isValid: false,
            message: "Please provide sorting results (minimum 5 characters).",
          };
        }
        return { isValid: true };

      case "sortingBy":
        if (!value) {
          return {
            isValid: false,
            message: "Please select who handled the sorting.",
          };
        }
        return { isValid: true };

      case "restartTime":
        if (isEmpty(value)) {
          return {
            isValid: false,
            message: "Please enter a valid restart time (HH:MM).",
          };
        }
        return { isValid: true };

      case "causeCategory":
        const validCauseCategories = [
          "Workforce",
          "Material",
          "Method",
          "Machine",
        ];
        if (isEmpty(value) || !validCauseCategories.includes(value.type)) {
          return {
            isValid: false,
            message: "Please select a valid root cause category.",
          };
        }
        return { isValid: true };

      case "whyAnalysis":
        if (isEmpty(value)) {
          return {
            isValid: false,
            message: "Please provide the 5 Why Analysis.",
          };
        }
        return { isValid: true };

      case "whyNotDetected":
        if (isEmpty(value)) {
          return {
            isValid: false,
            message: "Please explain why the issue wasn't detected earlier.",
          };
        }
        return { isValid: true };

      case "correctiveActions":
        if (isEmpty(value) || value.length < 10) {
          return {
            isValid: false,
            message:
              "Please describe permanent corrective actions (minimum 10 characters).",
          };
        }
        return { isValid: true };

      case "standardImprovement":
        const validStandardImprovementOptions = ["Yes", "No"];
        if (
          isEmpty(value) ||
          !validStandardImprovementOptions.includes(value.type)
        ) {
          return {
            isValid: false,
            message: "Please select if standard improvement is needed.",
          };
        }
        return { isValid: true };

      case "correctiveResponsible":
        if (isEmpty(value)) {
          return {
            isValid: false,
            message:
              "Please select responsible person(s) for corrective actions.",
          };
        }
        return { isValid: true };

      case "plannedDate":
      case "completionDate":
        if (isEmpty(value)) {
          return {
            isValid: false,
            message: "Please enter a valid date (YYYY-MM-DD).",
          };
        }
        return { isValid: true };

      case "teamAwareness":
      case "validationActions":
        const validTimeOptions = ["Morning", "Evening", "Night"];
        if (isEmpty(value) || !validTimeOptions.includes(value.type)) {
          return {
            isValid: false,
            message: "Please select a valid time option.",
          };
        }
        return { isValid: true };

      case "managerComments":
        // Optional field, so no validation needed
        return { isValid: true };

      case "signatures":
        const validSignatureOptions = [
          "Supervisor",
          "UAP Manager",
          "Site Director",
        ];
        if (isEmpty(value) || !validSignatureOptions.includes(value.type)) {
          return {
            isValid: false,
            message: "Please select a valid signature option.",
          };
        }
        return { isValid: true };

      case "escalationNeeded":
        const validEscalationOptions = ["Yes", "No"];
        if (isEmpty(value) || !validEscalationOptions.includes(value.type)) {
          return {
            isValid: false,
            message: "Please select if escalation is needed.",
          };
        }
        return { isValid: true };

      default:
        return { isValid: true };
    }
  };

  /**
   * Set Modal sucess to false on ModalRequestClose
   */
  const onModalRequestClose = () => {
    setModalVisible(false);
  };

  /**
   * Handles the "Continue" button click.
   * Moves to the Next form page after the Validation
   */
  const handleContinueBtn = () => {
    const hasError = ADDFPSDETAILS[activeFormPage]["fields"].some(
      (fielName) => {
        const validationResult = errorHandling(
          formData[fielName?.selectType],
          fielName?.selectType
        );

        if (!validationResult.isValid) {
          setToast({
            show: true,
            message: t(`addFpsDetailsErrors.${fielName?.selectType}`),
            type: "error",
          });
          // setToastMessage(t(`addFpsDetailsErrors.${fielName?.selectType}`));
          // setToastType("error");
          // setShowToast(true);
        }

        return !validationResult.isValid;
      }
    );
    if (hasError) {
      return;
    }

    if (activeFormPage === ADDFPSDETAILS?.length - 1) {
      handleFinishBtn();
      return;
    }

    const nextPage = activeFormPage + 1;
    setActiveFormPage(nextPage);
    pagerViewRef.current?.setPage(nextPage);

    setProgress((oldValue) => oldValue + 1 / ADDFPSDETAILS?.length);
  };

  /**
   * Handles the "Back" button click.
   * Moves to the previous form page.
   */
  const handleBackBtn = () => {
    if (activeFormPage === 0) return; // Disable back button on the first page

    const prevPage = activeFormPage - 1;
    setActiveFormPage(prevPage);
    pagerViewRef.current?.setPage(prevPage);

    setProgress((oldValue) => oldValue - 1 / ADDFPSDETAILS?.length);
  };

  /**
   * Handles the "Finish" button click.
   */
  const handleFinishBtn = () => {
    // tagId

    setModalVisible(true);
  };

  /**
   * Reset the Form and Clear all the input
   * Scroll to the top of the page
   */

  const resetPageViewer = () => {
    setFormData(initialFpsForm);
    pagerViewRef.current.setPage(0);
    setActiveFormPage(0);
    setProgress(1 / ADDFPSDETAILS?.length);

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
  };

  return (
    <View style={styles.container}>
      <CustomToast
        type={toast.type}
        duration={3000}
        // isActive={showToast}
        isActive={toast.show}
        message={toast.message}
        setToast={setToast}
        toastTopPosition={SIZES.small}
      />

      <AddTaskProgress
        size={1.3 * SIZES.xLarge}
        progress={progress}
        styles={progressStyle}
        sectionTitle={t(
          `addFpsDetails.sections.${activeFormPage + 1}.sectionTitle`
        )}
        nextStep={t(
          `addFpsDetails.sections.${activeFormPage + 1}.nextPageTitle`
        )}
        formatText={`${activeFormPage + 1} / ${ADDFPSDETAILS?.length}`}
      />

      <View style={styles.content}>
        <PagerView
          scrollEnabled={false}
          ref={pagerViewRef}
          style={styles.pagerView}
          pageMargin={SIZES.medium}
          initialPage={activeFormPage}>
          {ADDFPSDETAILS?.map((pageItem, pageIndex) => (
            <View style={styles.page} key={(pageIndex + 1).toString()}>
              {pageItem.id !== "2" ? (
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
                  translationType="addFpsDetails"
                />
              ) : (
                <ActionPage
                  setFormData={setFormData}
                  theme={theme}
                  userSearchStyles={userSearchStyles}
                  translateY={translateY}
                  formData={formData}
                  styles={styles}
                  formFieldsData={pageItem}
                  pageIndex={pageIndex}
                  imgFlatlistRef={imgFlatlistRef}
                  pageFlatlistRef={pageFlatlistRef}
                  translationType="addFpsDetails"
                  errorHandling={errorHandling}
                />
              )}
            </View>
          ))}
        </PagerView>

        <AddTaskActionButtons
          lastPage={activeFormPage + 1 === ADDFPSDETAILS?.length}
          disabled={activeFormPage === 0}
          styles={actionButtonsStyles}
          handleBackBtn={handleBackBtn}
          handleContinueBtn={handleContinueBtn}
          backTranslationText={t("createTask.actionButtons.back")}
          finishTranslationText={t("createTask.actionButtons.finish")}
          continiueTranslationText={t("createTask.actionButtons.continue")}
        />
      </View>

      {/* Success Modal  */}
      <View>
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => {
            onModalRequestClose();
          }}>
          <View style={styles.modalOverlay}>
            <Pressable
              style={styles.backdropPressable}
              onPress={() => {
                setModalVisible(false);
                resetPageViewer();
              }}>
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
                      {t("addFpsDetails.successfully_created")}
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(false);
                        resetPageViewer();
                      }}
                      style={styles.closeButton}>
                      <Text style={styles.closeText}>
                        {t("addFpsDetails.successfully_created")}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalFooter} />
                </Pressable>
              </View>
            </Pressable>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    width: "100%",
  },

  // Keyboard Avoiding View Styles
  keyboardAvoidingView: {
    flex: 1,
  },

  // Content Styles
  content: {
    paddingHorizontal: 1.5 * SIZES.medium,
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
    borderRadius: "50%",
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
    zIndex: 9000,
  },
  modalContainer: {
    zIndex: 9500,
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
    zIndex: 9600,
  },
  successIcon: {
    width: 130,
    height: 130,
    position: "absolute",
    top: -40,
    zIndex: 9700,
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
    zIndex: 9800,
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
    zIndex: 9500,
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
    borderRadius: 50,
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

const progressStyle = StyleSheet.create({
  ProgressHeader: {
    padding: 1.5 * SIZES.medium,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  ProgressHeaderTextContainer: {
    gap: 0.2 * SIZES.small,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  ProgressSectionTitle: {
    fontSize: 1.4 * SIZES.medium,
    fontFamily: FONTS.medium,
  },
  progressNextStep: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  progressText: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
  },
});
