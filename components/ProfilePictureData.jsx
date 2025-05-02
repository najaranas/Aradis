import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { useTheme } from "../contexts/ThemeProvider";

export default function ProfilePictureData({ img, name, id }) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.img, { backgroundColor: COLORS.lightGray }]}>
        <Image
          source={{
            uri: img,
          }}
          style={styles.img}
        />
      </View>
      <View style={styles.texContainer}>
        <Text style={[styles.mainText, { color: theme.text }]}>{name}</Text>
        <Text style={[styles.subText, { color: COLORS.gray }]}>#{id}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SIZES.medium,
    flexDirection: "row",
    alignItems: "center",
  },
  img: {
    width: 1.5 * SIZES.xLarge,
    height: 1.5 * SIZES.xLarge,
    borderRadius: (1.5 * SIZES.xLarge) / 2,
  },
  texContainer: {
    gap: SIZES.small,
  },
  mainText: {
    fontSize: 1.7 * SIZES.medium,
    fontFamily: FONTS.medium,
  },
  subText: {},
});
