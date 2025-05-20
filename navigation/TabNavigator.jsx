//
// TabNavigator.jsx
// This component is responsible for rendering the bottom tab navigator for the app.
// It includes tabs for Home, Tags, Create Task, Notifications, and Profile.
// It uses React Navigation for navigation, and Expo's NavigationBar API for setting the navigation bar color.
// It also includes a check for internet connectivity using a custom component.

import { use, useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, TouchableWithoutFeedback, Text } from "react-native";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import CheckInternet from "../components/handlers/CheckInternet";
import ProfileStackNavigator from "./ProfileNavigator";
import { StatusBar } from "expo-status-bar";
// import { useTheme } from "../hooks/useTheme";
import Tags from "../screens/Tags";

import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import CreateTask from "../screens/CreateTask";

// import Fpss from "../screens/Fpss";
import Notifications from "../screens/Notifications";
import * as NavigationBar from "expo-navigation-bar";
import HomeStackNavigator from "./HomeStackNavigator";
import Home from "../screens/Home";
import Actions from "../screens/Actions";
import { useTheme } from "../hooks/useTheme";
import { useUser } from "../hooks/useUser";
import { useNotifications } from "../hooks/useNotifications";
import NotificationSocketManager from "../utils/NotificationSocketManager";
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { theme } = useTheme();
  const { unreadCount } = useNotifications();

  const getRoutename = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName === "MyProfile" ||
      routeName === "Languages" ||
      routeName === "AboutApp" ||
      routeName === "Actions"
    ) {
      return "none";
    }
    return "flex";
  };

  console.log("unreadCount", unreadCount);
  useEffect(() => {
    requestAnimationFrame(async () => {
      await NavigationBar.setBackgroundColorAsync(theme.background);
      await NavigationBar.setButtonStyleAsync(
        theme.name === "light" ? "dark" : "light"
      );
    });
  }, [theme.name]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}>
      <CheckInternet />
      {/* Notification Socket Manager */}
      <NotificationSocketManager />

      <StatusBar
        backgroundColor={"transparent"}
        style={theme.name === "dark" ? "light" : "dark"}
      />

      <Tab.Navigator
        initialRouteName="HomeStack"
        screenOptions={({ route }) => {
          // console.log(route);
          return {
            tabBarStyle: [
              styles.tabBar,
              {
                backgroundColor: theme.secondary,
                display: getRoutename(route),
              },
            ],
            tabBarHideOnKeyboard: true,
            tabBarShowLabel: false,
            headerShown: false,

            animation: "shift",
            sceneStyle: [styles.screen, { backgroundColor: theme.background }],
            tabBarButton: (props) => (
              <TouchableWithoutFeedback {...props}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  {props.children}
                </View>
              </TouchableWithoutFeedback>
            ),
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name.toLowerCase() === "tags")
                iconName = "pricetags-outline";
              else if (route.name.toLowerCase() === "fps") iconName = "wrench";
              else if (route.name.toLowerCase() === "homestack")
                iconName = "home-outline";
              else if (route.name.toLowerCase() === "createtask")
                iconName = "add-outline";
              else if (route.name.toLowerCase() === "profilestack")
                iconName = "person-outline";
              else if (route.name.toLowerCase() === "notifications")
                iconName = "notifications-outline";

              return (
                <View
                  style={[
                    styles.iconContainer,
                    focused && {
                      backgroundColor: theme.primary,
                      borderRadius: 50,
                    },
                  ]}>
                  {route.name.toLowerCase() === "fps" ? (
                    <SimpleLineIcons
                      name={iconName}
                      size={focused ? SIZES.large : SIZES.large * 0.8}
                      color={focused ? theme.white : theme.darkGray}
                    />
                  ) : route.name.toLowerCase() === "notifications" ? (
                    <View>
                      <Ionicons
                        name={iconName}
                        size={
                          route.name.toLowerCase() === "createtask"
                            ? SIZES.large * 1.4
                            : focused
                              ? SIZES.large
                              : SIZES.large * 0.8
                        }
                        color={focused ? theme.white : theme.darkGray}
                      />
                      {unreadCount > 0 && (
                        <View style={styles.notificationIconContainer}>
                          <Text style={styles.notificationIconText}>
                            {unreadCount}
                          </Text>
                        </View>
                      )}
                    </View>
                  ) : (
                    <Ionicons
                      name={iconName}
                      size={
                        route.name.toLowerCase() === "createtask"
                          ? SIZES.large * 1.4
                          : focused
                            ? SIZES.large
                            : SIZES.large * 0.8
                      }
                      color={focused ? theme.white : theme.darkGray}
                    />
                  )}
                </View>
              );
            },
          };
        }}>
        <Tab.Screen name="HomeStack" component={HomeStackNavigator} />
        <Tab.Screen name="Tags" component={Tags} />
        {/* <Tab.Screen name="Fps" component={Fpss} /> */}
        <Tab.Screen name="CreateTask" component={CreateTask} />
        <Tab.Screen name="Notifications" component={Notifications} />
        <Tab.Screen name="ProfileStack" component={ProfileStackNavigator} />
      </Tab.Navigator>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  tabBar: {
    height: SIZES.large * 2.3,
    borderRadius: SIZES.large * 1.5,
    marginBottom: SIZES.medium,
    marginHorizontal: SIZES.small,
    elevation: 0,
    position: "relative",
  },
  iconContainer: {
    width: SIZES.xLarge * 1.15,
    height: SIZES.xLarge * 1.15,
    justifyContent: "center",
    alignItems: "center",
  },

  notificationIconContainer: {
    position: "absolute",
    top: -3,
    right: 0,
    backgroundColor: "red",
    padding: 2,
    minWidth: SIZES.medium,
    minHeight: SIZES.medium,
    borderRadius: SIZES.medium / 2,
  },
  notificationIconText: {
    fontFamily: FONTS.bold,
    color: COLORS.white,
    fontSize: SIZES.small,
    textAlign: "center",
  },
});
