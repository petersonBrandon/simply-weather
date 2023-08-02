import { Status } from "../types/enums";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * @param status
 * @returns Object with the icon and color of the status
 */
export const getStatusIcon = (status: Status) => {
  switch (status) {
    case Status.SUNNY:
      return { icon: "white-balance-sunny", color: "#FFB811" };
    case Status.RAINY:
      return { icon: "weather-pouring", color: "#004385" };
    case Status.CLOUDY:
      return { icon: "weather-cloudy", color: "#262626" };
    case Status.THUNDERSTORMS:
      return { icon: "weather-lightning-rainy", color: "#101010" };
    case Status.FOGGY:
      return { icon: "weather-fog", color: "#3A3A3A" };
    case Status.WINDY:
      return { icon: "weather-windy", color: "#4C4C4C" };
    case Status.SNOWY:
      return { icon: "weather-snowy", color: "#5C5C5C" };
    case Status.HAIL:
      return { icon: "weather-hail", color: "#4C4C4C" };
    case Status.PARTLY_CLOUDY:
      return { icon: "weather-partly-cloudy", color: "#5C5C5C" };
    default:
      return { icon: "white-balance-sunny", color: "#FFB811" };
  }
};

/**
 * @param lat
 * @param lon
 * @returns weather object
 */
export const getWeatherData = async (
  lat: number,
  lon: number
): Promise<OneCallWeatherTypes | void> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY}`
    );
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const getLocationData = async (
  lat: string | number,
  lon: string | number
): Promise<ReverseGeocodeAPITypes | void> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY}`
    );
    return response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * @param zipcode
 * @returns Object with the zipcode, city, longitude, and latitude
 */
export const getZipcodeData = async (
  zipcode: string
): Promise<ZipcodeAPITypes | void> => {
  const countryCode = "US";
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},${countryCode}&appid=${process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY}`
    );
    return response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * @param key
 * @param value
 */
export const storeData = async (key: string, value: StorageTypes) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

/**
 * @param key
 * @returns retrieved data from local storage
 */
export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
  }
};

export const convertWeatherType = (type: string) => {
  let status = Status.SUNNY;
  switch (type.toUpperCase()) {
    case "CLEAR":
      status = Status.SUNNY;
      break;
    case "RAIN":
    case "DRIZZLE":
      status = Status.RAINY;
      break;
    case "THUNDERSTORM":
      status = Status.THUNDERSTORMS;
      break;
    case "SNOW":
      status = Status.SNOWY;
      break;
    case "CLOUDS":
      status = Status.CLOUDY;
      break;
    case "ATMOSPHERE":
      status = Status.FOGGY;
      break;
    default:
      status = Status.SUNNY;
  }
  return status;
};
