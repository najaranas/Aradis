//
// App.js
// This is the main entry point of the application.
// It initializes the app, sets up navigation, and handles authentication.
//

import { useState, useEffect } from "react";
import "react-native-get-random-values";
import "expo-dev-client";
import "./firebase";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import Loading from "./screens/Loading";
import Login from "./screens/Login";
import NoInternet from "./screens/NoInternet";
import NotificationHandler from "./components/handlers/NotificationHandler";
import TabNavigator from "./navigation/TabNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import { I18nextProvider } from "react-i18next";
import i18next from "./i18n";
import Scanner from "./screens/Scanner";
import ConfirmScan from "./screens/ConfirmScan";
import { Provider } from "react-redux";
import { store } from "./store/index";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [fontLoaded] = useFonts({
    InterBold: require("./assets/fonts/Inter-Bold.ttf"),
    InterLight: require("./assets/fonts/Inter-Light.ttf"),
    InterMedium: require("./assets/fonts/Inter-Medium.ttf"),
    InterRegular: require("./assets/fonts/Inter-Regular.ttf"),
    InterSemiBold: require("./assets/fonts/Inter-SemiBold.ttf"),
  });

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Add a small delay to ensure React context initialization
        // This helps avoid the timing issues with lifecycle events
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.warn("App initialization error:", error);
      } finally {
        setIsReady(true);
      }
    };

    if (fontLoaded) {
      prepareApp();
    }
  }, [fontLoaded]);

  return (
    <NavigationContainer>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <MenuProvider>
            <NotificationHandler />
            <I18nextProvider i18n={i18next}>
              <Stack.Navigator
                initialRouteName="Loading"
                screenOptions={{
                  headerShown: false,
                }}>
                <Stack.Screen name="Loading" component={Loading} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="TabNavigator" component={TabNavigator} />
                <Stack.Screen name="Scanner" component={Scanner} />
                <Stack.Screen name="ConfirmScan" component={ConfirmScan} />
                <Stack.Screen name="NoInternet" component={NoInternet} />
              </Stack.Navigator>
            </I18nextProvider>
          </MenuProvider>
        </Provider>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
}
