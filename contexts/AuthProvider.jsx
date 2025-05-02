import { StyleSheet } from "react-native";
import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [userData, setUserData] = useState({});

  const changeUserData = (data) => {
    setUserData(data);
  };

  return (
    <AuthContext.Provider
      value={{
        userData: userData,
        changeUserData,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({});
