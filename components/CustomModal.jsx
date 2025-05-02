import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Children } from "react";

export default function CustomModal({
  onModalRequestClose,
  isVisible,
  children,
  transparent,
  animationType,
}) {
  return (
    <View>
      <Modal
        animationType={animationType}
        transparent={transparent}
        visible={isVisible}
        onRequestClose={() => {
          onModalRequestClose();
        }}>
        {children}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({});
