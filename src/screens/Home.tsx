import {
  Animated,
  Dimensions,
  Keyboard,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Header, WeekDay } from "../components";
import { Status, Store } from "../types/enums";
import React from "react";
import Constants from "expo-constants";
import AwesomeAlert from "react-native-awesome-alerts";
import * as Location from "expo-location";
import {
  convertWeatherType,
  getData,
  getLocationData,
  getStatusIcon,
  getWeatherData,
  getZipcodeData,
  storeData,
} from "../util/genericFunctions";
import moment from "moment";
import LoadingOverlay from "../components/LoadingOverlay";

interface AlertTypes {
  title: string;
  message: string;
  visible: boolean;
}

export default function Home() {
  const [textbox, setTextbox] = React.useState("60601");
  const [location, setLocation] = React.useState<StorageTypes | null>(null);
  const [weather, setWeather] = React.useState<OneCallWeatherTypes | null>(
    null
  );
  const [showAlert, setShowAlert] = React.useState<AlertTypes>({
    title: "Invalid Zipcode",
    message: "Zipcode must be 5 digits",
    visible: false,
  });
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const inputRef = React.useRef<TextInput | null>(null);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await getWeatherDataAsync();
    setRefreshing(false);
  }, []);

  const getWeatherDataAsync = async () => {
    const locationData = await getData(Store.LOCATION);
    setLocation(locationData);
    try {
      const weatherData: OneCallWeatherTypes | void = await getWeatherData(
        locationData.latitude,
        locationData.longitude
      );
      if (weatherData != null && weatherData != undefined) {
        setWeather(weatherData);
      }
    } catch (error) {
      const temp = JSON.parse(JSON.stringify(showAlert));
      temp.title = "Could not get weather data";
      temp.message = "Try again later";
      temp.visible = true;
      setShowAlert(temp);
    }
  };

  const getForecast = () => {
    if (weather != null && weather != undefined) {
      // Start at 1 to not get weather data of current day.
      const forecast = [];
      for (let i = 1; i < weather.daily.length - 1; i++) {
        const day = moment.unix(weather.daily[i].dt).format("ddd");
        const status = convertWeatherType(weather.daily[i].weather[0].main);
        forecast.push(
          <WeekDay
            key={day}
            weekDay={day}
            weatherStatus={status}
            highTemp={weather.daily[i].temp.max}
            lowTemp={weather.daily[i].temp.min}
            rainChance={weather.daily[i].pop * 100}
            theme="light"
          />
        );
      }
      return forecast;
    }
  };

  const setWeatherByLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    try {
      let data: ReverseGeocodeAPITypes | void = await getLocationData(
        location.coords.latitude,
        location.coords.longitude
      );
      let saveData: ZipcodeAPITypes | void;
      if (data != null && data != undefined) {
        for (let i = 0; i < data.results.length; i++) {
          for (let j = 0; j < data.results[i].address_components.length; j++) {
            if (
              data.results[i].address_components[j].types[0] === "postal_code"
            ) {
              saveData = await getZipcodeData(
                data.results[i].address_components[j].long_name
              );
              if (saveData != null && saveData != undefined) {
                storeData(Store.LOCATION, {
                  zipcode: saveData.zip,
                  useLocation: true,
                  longitude: saveData.lon,
                  latitude: saveData.lat,
                  city: saveData.name,
                });
              }
            }
          }
        }
      }
    } catch (error) {
      const temp = JSON.parse(JSON.stringify(showAlert));
      temp.title = "Could not get location data";
      temp.message = "Try again later";
      temp.visible = true;
      setShowAlert(temp);
    }
  };

  React.useEffect(() => {
    const setup = async () => {
      setLoading(true);
      const storedData = await getData(Store.LOCATION);
      if (
        storedData.useLocation ||
        storedData == null ||
        storedData == undefined
      ) {
        await setWeatherByLocationAsync();
      }
      await getWeatherDataAsync();
      setLoading(false);
    };
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        inputRef.current?.blur();
      }
    );
    setup();
    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);
  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading} />
      <AwesomeAlert
        show={showAlert.visible}
        showProgress={false}
        title={showAlert.title}
        message={showAlert.message}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonStyle={{
          paddingHorizontal: Dimensions.get("window").width / 5,
        }}
        confirmButtonColor="#05B2DC"
        onConfirmPressed={() => {
          const temp = JSON.parse(JSON.stringify(showAlert));
          temp.visible = false;
          setShowAlert(temp);
        }}
        onDismiss={() => {
          const temp = JSON.parse(JSON.stringify(showAlert));
          temp.visible = false;
          setShowAlert(temp);
        }}
      />
      <Header />

      <ScrollView
        style={{
          height: Dimensions.get("window").height,
          width: Dimensions.get("window").width,
          marginTop: Constants.statusBarHeight + 70,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: 50,
            borderRadius: 1000,
            backgroundColor: "#E0E0E0",
            width: Dimensions.get("window").width / 1.5,
            paddingHorizontal: 5,
          }}
        >
          <Icon
            name="magnify"
            size={20}
            color="#101010"
            style={{ position: "absolute", left: 10 }}
          />
          <TextInput
            ref={inputRef}
            onChangeText={setTextbox}
            onSubmitEditing={async () => {
              if (textbox.length === 5) {
                inputRef.current?.blur();
                inputRef.current?.clear();
                setLoading(true);
                try {
                  const data: ZipcodeAPITypes | void = await getZipcodeData(
                    textbox
                  );
                  if (data != null && data != undefined) {
                    storeData(Store.LOCATION, {
                      zipcode: data.zip,
                      useLocation: false,
                      longitude: data.lon,
                      latitude: data.lat,
                      city: data.name,
                    });
                    await getWeatherDataAsync();
                  }
                } catch (error) {
                  const temp = JSON.parse(JSON.stringify(showAlert));
                  temp.title = "Could not get location data";
                  temp.message = "Try again later";
                  temp.visible = true;
                  setShowAlert(temp);
                }
                setLoading(false);
              } else {
                inputRef.current?.blur();
                inputRef.current?.clear();
                const temp = JSON.parse(JSON.stringify(showAlert));
                temp.title = "Invalid Zipcode";
                temp.message = "Zipcode must be 5 digits";
                temp.visible = true;
                setShowAlert(temp);
              }
            }}
            keyboardType="numeric"
            placeholder="zip code"
            maxLength={5}
            cursorColor={"#004385"}
            style={{ paddingVertical: 5, flex: 1, textAlign: "center" }}
          />
          <TouchableOpacity
            onPress={async () => {
              setLoading(true);
              await setWeatherByLocationAsync();
              await getWeatherDataAsync();
              setLoading(false);
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
              padding: 5,
            }}
          >
            <Icon
              name="navigation"
              size={20}
              color="#101010"
              style={{
                position: "absolute",
                right: 10,
                transform: [{ rotate: "45deg" }],
              }}
            />
          </TouchableOpacity>
        </View>
        <Text style={{ marginBottom: 20, fontSize: 20 }}>{`${
          location?.city != null ? location.city : "Unknown"
        }`}</Text>
        <Icon
          name={
            weather?.daily[0].weather[0].main != null
              ? getStatusIcon(
                  convertWeatherType(weather?.daily[0].weather[0].main)
                ).icon
              : "minus"
          }
          size={100}
          color={
            weather?.daily[0].weather[0].main != null
              ? getStatusIcon(
                  convertWeatherType(weather?.daily[0].weather[0].main)
                ).color
              : "#010101"
          }
        />
        <Text style={{ fontSize: 50, marginTop: 20 }}>{`${
          weather?.current.temp != null
            ? Math.ceil(weather?.current.temp)
            : "NA"
        }°F`}</Text>
        <Text style={{ fontSize: 20 }}>{`${
          weather?.daily[0].temp.max != null
            ? Math.ceil(weather?.daily[0].temp.max)
            : "NA"
        }° / ${
          weather?.daily[0].temp.min != null
            ? Math.ceil(weather?.daily[0].temp.min)
            : "NA"
        }°`}</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="water" size={20} color="#004385" />
          <Text style={{}}>{`${
            weather?.daily[0].pop != null
              ? Math.floor(weather?.daily[0].pop * 100)
              : "NA"
          }%`}</Text>
        </View>

        <View
          style={{
            marginVertical: 50,
            flexDirection: "row",
            maxWidth: Dimensions.get("window").width,
            flexWrap: "wrap",
            justifyContent: "space-around",
            alignItems: "center",
            gap: 10,
          }}
        >
          {weather?.daily != null ? (
            getForecast()
          ) : (
            <Text>No Data Available</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={async () => {
            const URL = "https://www.patreon.com/BrandonPeterson/membership";
            const supported = await Linking.canOpenURL(URL);

            if (supported) {
              await Linking.openURL(URL);
            } else {
              const temp = JSON.parse(JSON.stringify(showAlert));
              temp.title = "Could not open link";
              temp.message = "Try again later";
              temp.visible = true;
              setShowAlert(temp);
            }
          }}
          style={{
            padding: 10,
            paddingHorizontal: 30,
            borderRadius: 1000,
            backgroundColor: "#FF424D",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Icon name="patreon" size={20} color="white" />
          <Text style={{ marginLeft: 5, color: "white" }}>
            Support me on Patreon
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
