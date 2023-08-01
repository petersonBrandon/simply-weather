import React from "react";
import {
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Constants from "expo-constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Header = () => {
  return (
    <View
      style={{
        position: "absolute",
        top: 0 + Constants.statusBarHeight,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        width: Dimensions.get("window").width,
      }}
    >
      {/* <TouchableOpacity
        style={{
          position: "absolute",
          left: 20,
          top: 0,
        }}
        onPress={() => {}}
      >
        <Icon name="cog" size={30} color="#101010" />
      </TouchableOpacity> */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../../../assets/Logo.png")}
          width={1000}
          height={1000}
          style={{ width: 40, height: 40 }}
        />
        <Text style={{ marginLeft: 10, fontWeight: "bold" }}>
          Simply Weather
        </Text>
      </View>
    </View>
  );
};

export default Header;
