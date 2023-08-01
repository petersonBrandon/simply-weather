import React from "react";
import { ActivityIndicator, Dimensions, Modal, View } from "react-native";

interface LoadingOverlayProps {
  visible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  ...props
}) => {
  return (
    <Modal
      animationType="fade"
      statusBarTranslucent={true}
      visible={visible}
      transparent={true}
    >
      <View
        style={{
          height: Dimensions.get("screen").height,
          width: Dimensions.get("screen").width,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <View
          style={{
            position: "absolute",
            flex: 1,
            backgroundColor: "#101010",
            opacity: 0.25,
            height: Dimensions.get("screen").height,
            width: Dimensions.get("screen").width,
          }}
        />
        <ActivityIndicator
          size="large"
          color="#05B2DC"
          style={{ transform: [{ scale: 3 }] }}
        />
      </View>
    </Modal>
  );
};

export default LoadingOverlay;
