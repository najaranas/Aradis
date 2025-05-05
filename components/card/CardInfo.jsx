import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { Image } from "expo-image";
import { useTheme } from "../../contexts/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

export default function CardInfo({ cardDetails, preventData, isRTL }) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {cardDetails?.map((item, index) => {
        const isPrevent = preventData?.some(
          (prevItem) => prevItem === item?.label?.toLowerCase()
        );
        return (
          !isPrevent && (
            <View
              key={index}
              style={[
                styles.infoContainer,
                {
                  alignItems:
                    item.label === "foundedBy" ||
                    item.label === "responsiblePerson"
                      ? "center"
                      : "flex-start",
                },
                isRTL && { flexDirection: "row-reverse" },
              ]}>
              <Text style={styles.label}>
                {t(`cardDetails.taskDetails.${item?.label}`) + " :"}
              </Text>
              {Array.isArray(item?.value) ? (
                <Menu>
                  <MenuTrigger
                    customStyles={{ TriggerTouchableComponent: Pressable }}>
                    <View
                      style={{
                        flexDirection: isRTL ? "row-reverse" : "row",
                        alignItems: "flex-end",
                        gap: 3,
                      }}>
                      <View
                        style={{
                          flexDirection: isRTL ? "row-reverse" : "row",
                          alignItems: "flex-end",
                        }}>
                        <View style={{ flexDirection: "row" }}>
                          {item?.value.slice(0, 3).map((val, valIndex) => {
                            return (
                              <View
                                key={`${index}-${valIndex}`}
                                style={{
                                  backgroundColor: theme.background,
                                  padding: 2,
                                  borderRadius: 50,
                                  marginLeft: valIndex !== 0 ? -10 : 0,
                                }}>
                                <Image
                                  source={val.avatar}
                                  style={styles.userImg}
                                />
                              </View>
                            );
                          })}
                        </View>

                        <View style={styles.userInfoIcon}>
                          <Ionicons name="information" color={COLORS.primary} />
                        </View>
                      </View>
                      {item?.value?.length > 3 && (
                        <Text
                          style={{
                            ...styles.label,
                          }}>
                          +{item?.value?.length - 3}
                        </Text>
                      )}
                    </View>
                  </MenuTrigger>
                  <MenuOptions
                    optionsContainerStyle={[
                      styles.menuOptions,
                      {
                        backgroundColor: theme.background,
                        borderColor: theme.lightGray,
                        marginRight: SIZES.large,
                      },
                    ]}>
                    <ScrollView
                      style={{
                        maxHeight: 3.7 * SIZES.xLarge,
                        paddingLeft: SIZES.small,
                      }}>
                      {item?.value?.map((val, valIndex) => (
                        <MenuOption
                          key={`${index}-menu-${valIndex}`}
                          value={valIndex}
                          disableTouchable>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: SIZES.small,
                            }}>
                            <Image source={val.avatar} style={styles.userImg} />
                            <Text style={styles.label}>{val.name}</Text>
                          </View>
                        </MenuOption>
                      ))}
                    </ScrollView>
                  </MenuOptions>
                </Menu>
              ) : (
                <Text
                  style={[styles.value, { color: theme.text }]}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {item?.value}
                </Text>
              )}
            </View>
          )
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    gap: SIZES.small,
  },
  infoContainer: {
    flexDirection: "row",
    gap: SIZES.small,
    flexWrap: "wrap",
  },
  label: {
    color: COLORS.gray,
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
  },
  value: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.regular,
  },
  userImg: {
    width: 2 * SIZES.medium,
    height: 2 * SIZES.medium,
    borderRadius: (2 * SIZES.medium) / 2,
    resizeMode: "cover",
  },
  userInfoIcon: {
    fontSize: 1.6 * SIZES.medium,
    borderColor: COLORS.primary,
    borderWidth: 1.3,
    color: COLORS.primary,
    padding: 1,
    borderRadius: 50,
  },
  menuOptions: {
    borderRadius: 10,
    padding: SIZES.small,
    borderWidth: 1,
    marginTop: 40,
  },
});
