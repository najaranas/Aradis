import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

import MyButton from "../MyButton";
import AddTaskForm from "../AddTaskForm";
import AddTaskActionButtons from "../AddTaskActionButtons";
import CustomToast from "../CustomToast";
import { FONTS, SIZES, COLORS } from "../../constants/theme";
import { ADDFPSDETAILS } from "../../constants/data";
import { FontAwesome5 } from "@expo/vector-icons";

const actionsFormData = {
  produit: "",
  sortingResults: "",
  sortingResultsNOK: "",
  sortingBy: [],
};

const resultsFormData = {
  immediateActions: "",
  immediateActionsResponsible: [],
};

export default function ActionPage({
  setFormData,
  theme,
  userSearchStyles,
  translateY,
  formData,
  styles: propStyles,
  formFieldsData,
  pageIndex,
  imgFlatlistRef,
  pageFlatlistRef,
  translationType,
  errorHandling,
}) {
  const { t } = useTranslation();

  // States for modal and toast
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [isItemWillAdded, setIsItemWillAdded] = useState(false);
  const [modalType, setModalType] = useState("action"); // "action" or "result"
  const [modalFormData, setModalFormData] = useState(resultsFormData);

  // States for actions and results
  const [actions, setActions] = useState([]);
  const [results, setResults] = useState([]);

  // Update parent form data when actions or results change
  useEffect(() => {
    setFormData((prev) => ({ ...prev, actions, results }));
  }, [actions, results]);
  // console.log(formData);

  // Item selection handlers
  const itemPressHandler = (index, type) => {
    setFormModalVisible(true);
    setModalType(type);
    setModalFormData(type === "action" ? actions[index] : results[index]);
    setIsItemWillAdded(false);
  };

  // Add new item handlers
  const addItemHandler = (type) => {
    setModalType(type);
    setModalFormData(resultsFormData);
    setIsItemWillAdded(true);
    setFormModalVisible(true);
  };

  // Remove item handlers
  const removeItem = (itemId, type) => {
    if (type === "action") {
      setActions((prevData) => prevData.filter((_, index) => index !== itemId));
    } else {
      setResults((prevData) => prevData.filter((_, index) => index !== itemId));
    }
  };

  // Modal continue button handler
  const handleContinueBtn = () => {
    // Validate form fields
    const hasError = ADDFPSDETAILS[1]["fields"].some((fielName) => {
      const validationResult = errorHandling(
        modalFormData[fielName?.selectType],
        fielName?.selectType
      );

      if (!validationResult.isValid) {
        setToastMessage(t(`addFpsDetailsErrors.${fielName?.selectType}`));
        setToastType("error");
        setShowToast(true);
      }

      return !validationResult.isValid;
    });

    if (hasError) return;

    if (isItemWillAdded) {
      const newItem = {
        ...modalFormData,
        id: modalType === "action" ? actions.length + 1 : results.length + 1,
      };

      if (modalType === "action") {
        setActions((prevData) => [...prevData, newItem]);
      } else {
        setResults((prevData) => [...prevData, newItem]);
      }
    } else {
      // Update existing item
      if (modalType === "action") {
        setActions((prevData) =>
          prevData.map((item, index) =>
            index === modalFormData.id - 1 ? modalFormData : item
          )
        );
      } else {
        setResults((prevData) =>
          prevData.map((item, index) =>
            index === modalFormData.id - 1 ? modalFormData : item
          )
        );
      }
    }

    setFormModalVisible(false);
  };

  // Render section (actions or results)
  const renderSection = (type, data, title) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {title}: {data.length}
        </Text>
        <MyButton pressHandler={() => addItemHandler(type)}>
          <View style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </View>
        </MyButton>
      </View>
      <View style={styles.itemsContainer}>
        {data.map((item, index) => (
          <MyButton
            key={index}
            pressHandler={() => itemPressHandler(index, type)}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>
                {type === "action" ? "Action N°" : "Result N°"}
                {index + 1}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 1.5 * SIZES.medium,
                  alignItems: "center",
                }}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <TouchableOpacity onPress={() => removeItem(index, type)}>
                  <FontAwesome5
                    name="trash-alt"
                    style={[
                      { color: COLORS.red, fontSize: 1.4 * SIZES.medium },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </MyButton>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* Actions Section */}
      {renderSection("action", actions, "Nombre d'actions")}

      {/* Results Section */}
      {renderSection("result", results, "Nombre de Results")}

      {/* Form Modal */}
      <Modal
        animationType="slide"
        transparent
        statusBarTranslucent
        visible={formModalVisible}
        onRequestClose={() => setFormModalVisible(false)}>
        <CustomToast
          type={toastType}
          duration={3000}
          isActive={showToast}
          message={toastMessage}
          setShowToast={setShowToast}
          toastTopPosition={SIZES.xLarge}
        />
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {modalType === "action" ? "Action N°" : "Result N°"}
            {isItemWillAdded
              ? (modalType === "action" ? actions.length : results.length) + 1
              : modalFormData?.id}
          </Text>

          <AddTaskForm
            setFormData={setModalFormData}
            theme={theme}
            userSearchStyles={userSearchStyles}
            translateY={translateY}
            formData={modalFormData}
            styles={propStyles}
            formFieldsData={
              modalType === "action"
                ? formFieldsData.actionsFields
                : formFieldsData.resultsFields
            }
            pageIndex={pageIndex}
            imgFlatlistRef={imgFlatlistRef}
            pageFlatlistRef={pageFlatlistRef}
            translationType={translationType}
          />

          <AddTaskActionButtons
            backTranslationText={t("createTask.actionButtons.back")}
            continiueTranslationText={
              isItemWillAdded
                ? t("createTask.actionButtons.add")
                : t("createTask.actionButtons.update")
            }
            handleBackBtn={() => setFormModalVisible(false)}
            handleContinueBtn={handleContinueBtn}
          />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    gap: SIZES.large,
  },
  sectionContainer: {
    gap: SIZES.medium,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sectionTitle: {
    fontSize: 1.3 * SIZES.medium,
    fontFamily: FONTS.medium,
  },
  addButton: {
    backgroundColor: COLORS.primary + "30",
    borderRadius: 10,
    width: 1.2 * SIZES.large,
    height: 1.2 * SIZES.large,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    includeFontPadding: false,
    textAlignVertical: "center",
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    fontSize: 2 * SIZES.medium,
    textAlign: "center",
    verticalAlign: "middle",
    lineHeight: 30,
  },
  itemsContainer: {
    gap: SIZES.medium,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: COLORS.lightGray,
    borderWidth: 0.5,
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.small,
    borderRadius: 10,
  },
  itemTitle: {
    fontFamily: FONTS.medium,
  },
  viewDetailsText: {
    fontFamily: FONTS.light,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 1.5 * SIZES.medium,
    paddingTop: 1.3 * SIZES.xLarge,
    gap: SIZES.medium,
  },
  modalTitle: {
    fontSize: 1.5 * SIZES.medium,
    fontFamily: FONTS.medium,
  },
});
