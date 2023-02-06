import { defineStore } from "pinia";
import { ICity } from "@/helper/types";
import axios from "axios";

const WEATHER_CITY_LIST = "plumsail-weather-city-list";
const WEATHER_CAN_SHOW_SETTINGS = "plumsail-can-show-settings";

const defaultCities: Array<ICity> = [
  {
    name: "London",
    lat: 51.5073219,
    lon: -0.1276474,
    country: "GB",
    state: "England",
  },
  {
    name: "Moscow",
    lat: 55.7504461,
    lon: 37.6174943,
    country: "RU",
    state: "Russia",
  },
];

async function getCurrentCity() {
  try {
    const { data } = await axios.get<{
      latitude: number;
      longitude: number;
      city: string;
      countryName: string;
      countryCode: string;
      // eslint-disable-next-line
      [key: string]: any;
    }>("https://api.bigdatacloud.net/data/reverse-geocode-client");
    return {
      name: data.city,
      lat: data.latitude,
      lon: data.longitude,
      country: data.countryCode,
      state: data.countryName,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
function getCityId(city: ICity) {
  const lat = Math.trunc(city.lat);
  const lon = Math.trunc(city.lon);
  return `${city.name}_${city.country}_${lat}_${lon}`;
}
function isEqualTwoCity(city: ICity, city2: ICity) {
  return getCityId(city) === getCityId(city2);
}

export const useCityStore = defineStore("city", {
  state: () => {
    return {
      cities: [] as ICity[],
      canShowSetting: false,
    };
  },
  actions: {
    setCanShowSettings(canShowSetting: boolean) {
      this.canShowSetting = canShowSetting;
      window.localStorage.setItem(
        WEATHER_CAN_SHOW_SETTINGS,
        JSON.stringify(canShowSetting)
      );
    },
    setAutoSaveInLocalStorage() {
      this.$subscribe((mutations, state) => {
        window.localStorage.setItem(
          WEATHER_CITY_LIST,
          JSON.stringify(state.cities)
        );
      });
    },
    pushNewCity(city: ICity) {
      const foundCity = this.cities.find((c) => isEqualTwoCity(c, city));

      if (foundCity) {
        window.alert("This city has already been added");
        return;
      }
      this.cities.push(city);
    },
    setCities(cities: Array<ICity>) {
      this.cities = cities;
    },
    removeCity(city: ICity) {
      if (this.cities.length === 1) {
        window.alert("It is not possible to delete the last remaining city");
        return;
      }
      this.cities = this.cities.filter((c) => !isEqualTwoCity(c, city));
    },

    async fetchCities() {
      const defaultList = defaultCities;
      // auto change city local storage after change city store state
      this.setAutoSaveInLocalStorage();
      try {
        const list = window.localStorage.getItem(WEATHER_CITY_LIST);
        const canShowSetting = window.localStorage.getItem(
          WEATHER_CAN_SHOW_SETTINGS
        );

        this.canShowSetting =
          !list || canShowSetting === null || canShowSetting === "true";

        if (!list) {
          const currentCity = await getCurrentCity();
          const cities = [currentCity];
          this.setCities(cities);
          return;
        }
        const parsedCities: Array<ICity> = JSON.parse(list);

        const cities =
          Array.isArray(parsedCities) && parsedCities.length
            ? parsedCities
            : [await getCurrentCity()];

        this.setCities(cities);
      } catch (err) {
        console.error(err);

        this.setCities(defaultList);
      }
    },
  },
});
