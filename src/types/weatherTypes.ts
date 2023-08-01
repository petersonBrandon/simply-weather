interface OneCallWeatherTypes {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeatherTypes;
  minutely: { dt: number; precipitation: number }[];
  hourly: CurrentWeatherTypes[];
  daily: DailyWeatherTypes[];
}

interface CurrentWeatherTypes {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  clouds: number;
  uvi: number;
  visibility: number;
  wind_speed: number;
  wind_gust: number;
  wind_deg: number;
  rain: { "1h": number };
  snow: { "1h": number };
  weather: GeneralWeatherTypes[];
}

interface GeneralWeatherTypes {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface DailyWeatherTypes {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  summary: string;
  temp: DayTempTypes;
  feels_like: DayTempFeelsLikeTypes;
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_gust: number;
  wind_deg: number;
  clouds: number;
  uvi: number;
  pop: number;
  rain: number;
  snow: number;
  weather: GeneralWeatherTypes[];
}

interface DayTempTypes {
  morn: number;
  day: number;
  eve: number;
  night: number;
  min: number;
  max: number;
}

interface DayTempFeelsLikeTypes {
  morn: number;
  day: number;
  eve: number;
  night: number;
}

interface AlertTypes {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}
