interface StorageTypes {
  zipcode?: string;
  useLocation: boolean;
  longitude: number;
  latitude: number;
  city: string;
}

interface ZipcodeAPITypes {
  country: string;
  lat: number;
  lon: number;
  name: string;
  zip: string;
}

interface ReverseGeocodeAPITypes {
  results: {
    address_components: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
  }[];
}
