<template>
  <div class="weather-widget">
    <WeatherWidgetSettings
      @hideSettingComponent="onHideSettingComponent"
      class="weather-widget__settings"
      :class="{
        'weather-widget__settings_show': showSettingComponent,
        'weather-widget__settings_hide': !showSettingComponent,
      }"
    />
    <div class="weather-widget__weather-list">
      <div
        v-for="(weatherByCity, idx) of weatherByCityList"
        :key="`${weatherByCity.coord.lat}_${weatherByCity.coord.lon}`"
      >
        <WeatherWidgetItem
          :weatherByCity="weatherByCity"
          :canShowSetting="canShowSetting && idx === 0"
          @openSettingComponent="showSettingComponent = true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  onBeforeMount,
  onBeforeUnmount,
  ref,
  computed,
  watchEffect,
} from "vue";
import axios from "axios";

import { ICity, IWeatherByCity } from "@/helper/types";
import { useCityStore } from "@/store/city";
import { useEnvStore } from "@/store/env";

import WeatherWidgetItem from "./WeatherWidgetItem.vue";
import WeatherWidgetSettings from "./WeatherWidgetSettings.vue";

const cityStore = useCityStore();
const envStore = useEnvStore();

let weatherUpdateIntervalInMinutes = envStore.weatherUpdateIntervalInMinutes;

if (!weatherUpdateIntervalInMinutes)
  throw "interval in minutes must be number string";

const WEATHER_URL_TEMPLATE = `https://api.openweathermap.org/data/2.5/weather?lat={{lat}}&lon={{lon}}&mode=JSON&units=metric&lang=en&appid=${envStore.weatherServiceApiKey}`;

const weatherByCityList = ref<Array<IWeatherByCity>>([]);

const cities = computed(() => cityStore.cities);
const canShowSetting = computed(() => cityStore.canShowSetting);
const showSettingComponent = ref<boolean>(false);

async function getCities(cities: ICity[]) {
  try {
    const weatherList = await Promise.all(
      cities.map(async (city) => {
        // prettier-ignore
        const url = WEATHER_URL_TEMPLATE
          .replace("{{lat}}", String(city.lat))
          .replace("{{lon}}", String(city.lon));
        const res = await axios.get<IWeatherByCity>(url);
        return res.data;
      })
    );
    return weatherList;
  } catch {
    return [];
  }
}

let intervalId: number;

const MILLISECONDS_IN_MUNITE = 60 * 1000;

const interval = weatherUpdateIntervalInMinutes * MILLISECONDS_IN_MUNITE;

onBeforeMount(async () => {
  await cityStore.fetchCities();

  intervalId = setInterval(async () => {
    weatherByCityList.value = await getCities(cities.value);
  }, interval);
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});

watchEffect(async () => {
  weatherByCityList.value = await getCities(cities.value);
});
function onHideSettingComponent() {
  showSettingComponent.value = false;
  cityStore.setCanShowSettings(false);
}
</script>

<style lang="scss">
$maxWidth: 210px;
.weather-widget {
  padding: 0.5em;
  max-width: $maxWidth;
  width: 100%;
  display: inline-flex;
  position: relative;
  &__settings {
    position: absolute;
    z-index: 1;
    background-color: #fff;
    transform: translateX(-$maxWidth);
    opacity: 0;
    transition: all 0.3s linear;
    &_show {
      transform: translateX(0);
      opacity: 1;
    }
  }
  &__weather-list {
    width: 100%;
  }
}

.slide-fade-enter-active {
  transition: all 0.3s linear;
}

.slide-fade-leave-active {
  transition: all 0.3s linear;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
