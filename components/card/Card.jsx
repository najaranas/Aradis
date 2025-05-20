import { Modal, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import CardHeader from "./CardHeader";
import { COLORS, SIZES } from "../../constants/theme";
import CustomProgressSteps from "../CustomProgressSteps";
import MyButton from "../MyButton";
import CardInfo from "./CardInfo";
import CardDetails from "./CardDetails";
import { useTranslation } from "react-i18next";
import { formatDate } from "date-fns";
import { ar, fr } from "date-fns/locale";
import {
  maintenanceIcon,
  productionIcon,
  qualityIcon,
  securityIcon,
  teamIcon,
} from "../../constants/dataImage";

export default function Card({ cardData, preventData, isUpdated, isRTL }) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryColor, setCategoryColor] = useState({
    color: COLORS.gray,
    bgColor: "transparent",
  });
  console.log("cardData", cardData);

  const cardDetails = [
    {
      label: "date",
      value: formatDate(cardData?.createdAt || null, "MM-dd-yyyy : HH:mm"),
    },
    {
      label: "deadline",
      value: "Feb 10, 2023",
    },
    { label: "zone", value: cardData?.zone },
    {
      label: "machine",
      value: cardData?.machine,
    },
    { label: "equipment", value: cardData?.equipment },
    {
      label: "responsibleDepartment",

      value: cardData?.tagAction
        ?.map((item) => ({
          name: item?.dataValues?.userService,
          image: getServiceIcon(item?.dataValues?.userService),
        }))
        // Remove duplicates based on name
        .reduce((acc, item) => {
          const isDuplicate = acc.some(
            (existing) => existing.name === item.name
          );
          if (!isDuplicate) acc.push(item);
          return acc;
        }, []),
    },
    {
      label: "foundedBy",
      value: [
        {
          name: `${cardData?.user?.firstName} ${cardData?.user?.lastName}`,
          image: cardData?.user?.image,
        },
      ],
    },
    // {
    //   label: "actions",
    //   value: cardData?.tagAction,
    // },
    {
      label: "description",
      value: cardData?.description,
    },
    {
      label: "equipment",
      value: cardData?.equipment,
    },
  ];

  const progressSteps = {
    activeStep:
      cardData?.category === "open"
        ? 1
        : cardData?.category === "In progress"
          ? 2
          : 3,
    data: [
      { label: "Open", id: 1 },
      { label: "In Progress", id: 2 },
      { label: "Resolved", id: 3 },
    ],
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "security":
        setCategoryColor({ color: "#FF0000", bgColor: "#FF000030" });
        break;

      case "production":
        setCategoryColor({ color: "#0777e7", bgColor: "#0070C030" });
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

  function getServiceIcon(service) {
    switch (service?.toLowerCase()) {
      case "security":
        return securityIcon;
      case "production":
        return productionIcon;
      case "maintenance":
        return maintenanceIcon;
      case "quality":
        return qualityIcon;
      default:
        return teamIcon;
    }
  }
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
          cardDetails={cardDetails}
          categoryColor={categoryColor}
          progressSteps={progressSteps}
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
