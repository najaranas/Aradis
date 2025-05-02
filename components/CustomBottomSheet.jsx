import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useTheme } from "../contexts/ThemeProvider";

export default function CustomBottomSheet({
  isVisible,
  onClose,
  children,
  backgroundBorderRaduis = 20,
  overlay = true,
}) {
  const bottomSheetRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  return (
    <>
      {overlay && isVisible && (
        <Pressable style={styles.overlay} onPress={onClose} />
      )}
      <BottomSheet
        index={isVisible ? 0 : -1}
        ref={bottomSheetRef}
        snapPoints={null}
        enablePanDownToClose={true}
        handleComponent={null}
        onClose={onClose}
        enableContentPanningGesture={true}
        backgroundStyle={{
          backgroundColor: theme.secondaryBackground || "white",
          borderTopLeftRadius: backgroundBorderRaduis || 0,
          borderTopRightRadius: backgroundBorderRaduis || 0,
        }}>
        <BottomSheetView style={styles.content}>{children}</BottomSheetView>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    padding: 16,
  },
});
