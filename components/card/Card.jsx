import { Modal, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import CardHeader from "./CardHeader";
import { COLORS, SIZES } from "../../constants/theme";
import CustomProgressSteps from "../CustomProgressSteps";
import MyButton from "../MyButton";
import CardInfo from "./CardInfo";
import CardDetails from "./CardDetails";
import { useTranslation } from "react-i18next";

export default function Card({ cardData, preventData, isUpdated, isRTL }) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryColor, setCategoryColor] = useState({
    color: COLORS.gray,
    bgColor: "transparent",
  });

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "security":
        setCategoryColor({ color: "#FF0000", bgColor: "#FF000030" });
        break;

      case "production":
        setCategoryColor({ color: "#0000FF", bgColor: "#0070C030" });
        break;

      case "maintenance":
        setCategoryColor({ color: "#ffaa00", bgColor: "#ffaa0030" });
        break;

      case "quality":
        setCategoryColor({ color: "#00B050", bgColor: "#00B05030" });
        break;

      default:
        setCategoryColor({ color: COLORS.gray, bgColor: "transparent" });
        break;
    }
  };

  useEffect(() => {
    getCategoryColor(cardData?.category);
  }, [cardData]);

  const handleViewDetails = () => {
    setModalVisible(true);
  };
  return (
    <View
      style={[
        styles.cardContainer,
        {
          borderColor: categoryColor.bgColor,
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
        preventData={preventData}
        isRTL={isRTL}
      />

      {/*Details  Buttons */}
      <View
        style={{
          gap: SIZES.small,
          flexDirection: isRTL ? "row-reverse" : "row",
        }}>
        <MyButton pressHandler={handleViewDetails} parentStyle={{ flex: 1 }}>
          <View style={styles.detailsBtn}>
            <Text style={{ color: COLORS.white, fontSize: SIZES.medium }}>
              {t("cardDetails.buttons.viewDetails")}
            </Text>
          </View>
        </MyButton>

        {isUpdated && (
          <MyButton pressHandler={handleViewDetails} parentStyle={{ flex: 1 }}>
            <View style={styles.detailsBtn}>
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: SIZES.medium,
                }}>
                {t("cardDetails.buttons.updateDetails")}
              </Text>
            </View>
          </MyButton>
        )}
      </View>

      {/* View Details Modal */}
      <Modal
        animationType="slide"
        style={{ flex: 1 }}
        statusBarTranslucent={true}
        // presentationStyle="pageSheet"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <CardDetails
          setModalVisible={setModalVisible}
          cardData={cardData}
          categoryColor={categoryColor}
          isRTL={isRTL}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    borderRadius: 10,
    borderWidth: 1.3,
    padding: SIZES.medium,
    gap: SIZES.large,
  },
  detailsBtn: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",

    flex: 1,
  },

  // details modal

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});
