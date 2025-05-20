import React from "react";
import { useTranslation } from "react-i18next";
import DateTimePicker from "react-native-modal-datetime-picker";
// import DateTimePicker from "@react-native-community/datetimepicker";

import { useTheme } from "../hooks/useTheme";

export default function CustomDateTimePicker({
  pickerMode, // 'date' | 'time' | 'datetime'
  isVisible,
  setIsVisible,
  selectedDate,
  setSelectedDate,
  dateStateField,
  visibilityStateField,
}) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const handleConfirm = (newDate) => {
    // Proceed with date selection
    if (newDate) {
      if (dateStateField) {
        setSelectedDate(newDate, pickerMode, dateStateField);
      } else {
        setSelectedDate(newDate);
      }

      // Close the picker
      setIsVisible(false, pickerMode, visibilityStateField);
    }
  };

  const handleCancel = () => {
    // Close the picker without selecting a date
    setIsVisible(false, pickerMode, visibilityStateField);
  };
  return (
    <DateTimePicker
      isVisible={isVisible}
      mode={pickerMode}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      // date={selectedDate || new Date()}
      value={selectedDate || new Date()}
      // is24Hour={true}
      isDarkModeEnabled={theme.name === "dark"}
      negativeButton={{ label: t("DatePicker.cancel") }}
      positiveButton={{ label: t("DatePicker.ok") }}
    />
  );
}
