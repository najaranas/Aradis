import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";

export default function CheckInternet() {
  const navigation = useNavigation();
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        setWasOffline(true);
        navigation.navigate("NoInternet");
      } else if (wasOffline) {
        setWasOffline(false);
        navigation.navigate("Loading");
      }
    });

    return () => unsubscribe();
  }, [navigation, wasOffline]);

  return null;
}
