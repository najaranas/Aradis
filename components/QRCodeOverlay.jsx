//
// QRCodeOverlay.jsx
// This component is responsible for rendering the QR code scanning overlay.
// It includes a transparent scanning area with corner markers and an overlay for instructions.
// It uses React Native's StyleSheet for styling and the useTranslation hook for internationalization.
//

import { View, Text, StyleSheet } from "react-native";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { useTranslation } from "react-i18next";

const QRCodeOverlay = ({ isRTL }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.overlay}>
      {/* Top overlay */}
      <View style={styles.overlaySection} />

      {/* Middle section with scanning window */}
      <View style={styles.middleSection}>
        <View style={styles.overlayColumn} />

        {/* Transparent Scanning Area */}
        <View style={styles.scanWindow}>
          {/* Corner markers with RTL support */}
          <View
            style={[
              styles.cornerTL,
              styles.corner,
              {
                borderRightWidth: isRTL ? undefined : 0,
                borderTopWidth: undefined,
                borderLeftWidth: isRTL ? 0 : undefined,
                borderBottomWidth: 0,
              },
            ]}
          />
          <View
            style={[
              styles.cornerTR,
              styles.corner,
              {
                borderRightWidth: isRTL ? 0 : undefined,
                borderTopWidth: undefined,
                borderLeftWidth: isRTL ? undefined : 0,
                borderBottomWidth: 0,
              },
            ]}
          />
          <View
            style={[
              styles.cornerBL,
              styles.corner,
              {
                borderRightWidth: isRTL ? undefined : 0,
                borderBottomWidth: undefined,
                borderLeftWidth: isRTL ? 0 : undefined,
                borderTopWidth: 0,
              },
            ]}
          />
          <View
            style={[
              styles.cornerBR,
              styles.corner,
              {
                borderRightWidth: isRTL ? 0 : undefined,
                borderBottomWidth: undefined,
                borderLeftWidth: isRTL ? undefined : 0,
                borderTopWidth: 0,
              },
            ]}
          />
        </View>

        <View style={styles.overlayColumn} />
      </View>

      {/* Bottom overlay */}
      <View style={styles.overlaySection}>
        <View>
          <Text
            style={{
              color: COLORS.white,
              fontFamily: FONTS.medium,
              fontSize: SIZES.large,
            }}>
            {t("scanner.scan")}
          </Text>
          <Text
            style={{
              color: COLORS.white,
              fontFamily: FONTS.medium,
              fontSize: SIZES.large,
            }}>
            {t("scanner.qrcode")}
          </Text>
        </View>

        <Text style={[styles.instructionText]}>
          {t("scanner.scan_message")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
  },
  overlaySection: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: SIZES.large,
    paddingVertical: SIZES.xLarge,
    gap: SIZES.large,
  },
  middleSection: {
    flexDirection: "row",
    height: "30%",
  },
  overlayColumn: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  scanWindow: {
    width: "70%",
    height: "100%",
    position: "relative",
  },
  instructionText: {
    color: COLORS.lightGray,
    fontFamily: FONTS.light,
    fontSize: SIZES.medium,
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: COLORS.white,
    borderWidth: 3,
  },
  cornerTL: {
    top: 0,
    left: 0,
  },
  cornerTR: {
    top: 0,
    right: 0,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
  },
});

export default QRCodeOverlay;
