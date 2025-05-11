import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/Profile";
import MyProfile from "../screens/ProfileScreens/MyProfile";
import Languages from "../screens/ProfileScreens/Languages";
import AboutApp from "../screens/ProfileScreens/AboutApp";

import { StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";

const ProfileStack = createNativeStackNavigator();

export default function ProfileStackNavigator() {
  const { theme } = useTheme();
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { flex: 1, backgroundColor: theme.background },
      }}
      initialRouteName="Profile">
      <ProfileStack.Screen name="Profile" component={Profile} />
      <ProfileStack.Screen name="MyProfile" component={MyProfile} />
      <ProfileStack.Screen name="Languages" component={Languages} />
      <ProfileStack.Screen name="AboutApp" component={AboutApp} />
    </ProfileStack.Navigator>
  );
}

const styles = StyleSheet.create({});
