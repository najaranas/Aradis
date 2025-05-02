import React, { useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Button,
  SafeAreaView,
} from "react-native";
import { aradisBigLogo } from "../../constants/dataImage";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import TopTabPage from "../../components/TopTabPage";
import { ABOUTAPPDATA } from "../../constants/data";
import { useTheme } from "../../contexts/ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

export default function AboutApp({ navigation }) {
  const { theme, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  const BackHandler = () => {
    navigation.goBack();
  };

  const { t } = useTranslation();
  return (
    <View style={[styles.container, { paddingTop: SIZES.small + insets.top }]}>
      <View style={styles.TopPage}>
        <TopTabPage text={t("aboutApp.about_app")} BackHandler={BackHandler} />
        <View style={styles.header}>
          <Image source={aradisBigLogo} style={styles.logo} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}>
        {/* Our App */}
        <View style={styles.descriptionBox}>
          <Text style={[styles.descriptionTitle, { color: theme.text }]}>
            {t("aboutApp.sections_title.1_1")}
          </Text>
          <Text style={[styles.description, { color: theme.text }]}>
            {t("aboutApp.description")}
          </Text>
        </View>

        {/* Key Features */}
        <View style={styles.descriptionBox}>
          <Text style={[styles.descriptionTitle, { color: theme.text }]}>
            {t("aboutApp.sections_title.1_2")}
          </Text>
          {ABOUTAPPDATA.keyFeatures.map((feature) => (
            <Text
              key={feature.id}
              style={[styles.description, { color: theme.text }]}>
              - {t(`aboutApp.key_features.${feature.id}`)}
            </Text>
          ))}
        </View>

        {/* Why Choose Us? */}
        <View style={styles.descriptionBox}>
          <Text style={[styles.descriptionTitle, { color: theme.text }]}>
            {t("aboutApp.sections_title.1_3")}
          </Text>
          {ABOUTAPPDATA.whyChooseUs.map((reason) => (
            <Text
              key={reason.id}
              style={[styles.description, { color: theme.text }]}>
              - {t(`aboutApp.why_choose_us.${reason.id}`)}
            </Text>
          ))}
        </View>

        {/* Our Mission */}
        <View style={styles.descriptionBox}>
          <Text style={[styles.descriptionTitle, { color: theme.text }]}>
            {t("aboutApp.sections_title.1_4")}
          </Text>
          {ABOUTAPPDATA.ourMission.map((mission) => (
            <Text
              key={mission.id}
              style={[styles.description, { color: theme.text }]}>
              - {t(`aboutApp.our_mission.${mission.id}`)}
            </Text>
          ))}
        </View>

        {/* Contact Us */}
        <View style={styles.descriptionBox}>
          <Text style={[styles.descriptionTitle, { color: theme.text }]}>
            {t("aboutApp.sections_title.1_5")}
          </Text>
          <Text style={[styles.description, { color: theme.text }]}>
            Email: {t(`aboutApp.contact_us.email`)}
          </Text>
          <Text style={[styles.description, { color: theme.text }]}>
            Phone: {t(`aboutApp.contact_us.phone`)}
          </Text>
          <Text style={[styles.description, { color: theme.text }]}>
            Website: {t(`aboutApp.contact_us.website`)}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: SIZES.small,
  },
  TopPage: {
    padding: 1.5 * SIZES.medium,
    paddingTop: 0,
    gap: SIZES.large,
  },
  logo: {
    width: "100%",
    height: SIZES.xLarge,
    resizeMode: "contain",
  },
  scrollView: {
    gap: SIZES.medium,
    padding: 1.5 * SIZES.medium,
  },
  descriptionBox: {
    gap: SIZES.small,
  },
  descriptionTitle: {
    fontSize: 1.3 * SIZES.medium,
    fontFamily: FONTS.bold,
  },
  description: {
    fontSize: SIZES.medium,
    textAlign: "left",
  },
});
