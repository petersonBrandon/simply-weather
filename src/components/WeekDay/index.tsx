import React from "react";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getStatusIcon } from "../../util/genericFunctions";
import { Status } from "../../types/enums";

interface WeekDayTypes {
  weekDay: string;
  theme: "dark" | "light";
  weatherStatus: Status;
  highTemp: number;
  lowTemp: number;
  rainChance: number;
}

const WeekDay: React.FC<WeekDayTypes> = ({
  weekDay,
  theme,
  weatherStatus,
  highTemp,
  lowTemp,
  rainChance,
  ...props
}) => {
  const [statusIcon, setStatusIcon] = React.useState({
    icon: "white-balance-sunny",
    color: "#FFB811",
  });
  React.useEffect(() => {
    setStatusIcon(getStatusIcon(weatherStatus));
  }, [weatherStatus]);
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>{weekDay}</Text>
      <Icon name={statusIcon.icon} size={30} color={statusIcon.color} />
      <View
        style={{
          marginTop: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>{`${Math.ceil(highTemp)}°`}</Text>
          <Text>{`${Math.ceil(lowTemp)}°`}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="water" size={15} color="#004385" />
          <Text>{`${Math.floor(rainChance)}%`}</Text>
        </View>
      </View>
    </View>
  );
};

export default WeekDay;
