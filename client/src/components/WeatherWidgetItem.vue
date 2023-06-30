<template>
  <div class="weather-widget-item">
    <div class="weather-widget-item__header">
      <div :title="title" class="weather-widget-item__title">{{ title }}</div>
      <button
        v-if="canShowSetting"
        @click="$emit('openSettingComponent')"
        class="weather-widget-item__gear-btn"
      >
        <img src="@/assets/gear.svg" alt="gear" />
      </button>
    </div>
    <div class="weather-widget-item__img-weather-container">
      <img :src="imgUrl" :alt="weather.main" />
      <span>{{ temperature }} ˚C</span>
    </div>
    <div class="weather-widget-item__subtitle">
      {{ subtitle }}
    </div>
    <div class="weather-widget-item__additional-info-container">
      <div>
        <img
          :style="{
            transform: `rotate(${windDeg}deg)`,
          }"
          class="weather-widget-item__img-cursor"
          src="@/assets/cursor.svg"
          alt="cursor"
        />
        <div>{{ windSpeed }}m/s {{ direction }}</div>
      </div>
      <img
        class="weather-widget-item__img-pressure"
        src="@/assets/pressure-gauge.svg"
        alt="pressure"
      />
      <div>
        {{ `${pressure}hPa` }}
      </div>
    </div>
    <div class="weather-widget-item__additional-info-container">
      <div>Humidity: {{ humidity }}%</div>
      <div>Visibility: {{ visibility }}km</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, PropType, toRefs } from "vue";
import { IWeatherByCity } from "@/helper/types";
import getCardinalDirectionByDegree from "@/helper/getCardinalDirectionByDegree";
import { capitalize } from "lodash";

const WEATHER_URL_TEMPLATE = "https://openweathermap.org/img/wn/{{icon}}.png";

const props = defineProps({
  weatherByCity: {
    type: Object as PropType<IWeatherByCity>,
    required: true,
  },
  canShowSetting: {
    type: Boolean,
    default: false,
  },
});

const { weatherByCity, canShowSetting } = toRefs(props);

const title = `${weatherByCity.value.name}, ${weatherByCity.value.sys.country}`;

const weather = computed(() => weatherByCity.value?.weather?.[0]);
const iconName = computed(() => weather.value?.icon);
const imgUrl = computed(() =>
  WEATHER_URL_TEMPLATE.replace("{{icon}}", iconName.value)
);
const mainInfo = computed(() => weatherByCity.value?.main);
const temperature = computed(() => mainInfo.value.temp.toFixed(1));
const pressure = computed(() => mainInfo.value.pressure);
const humidity = computed(() => mainInfo.value.humidity);

const visibility = computed(() =>
  (weatherByCity.value.visibility / 1000).toFixed(1)
);

const subtitle = computed(() => {
  const feelsLike = `Feels like ${mainInfo.value.feels_like}˚C. `;
  const weatherDesc = capitalize(weather.value.description);
  return feelsLike + weatherDesc;
});

const windInfo = computed(() => weatherByCity.value.wind);

const windDeg = computed(() => windInfo.value.deg);
const windSpeed = computed(() => windInfo.value.speed);
const direction = computed(() => getCardinalDirectionByDegree(windDeg.value));
</script>

<style scoped lang="scss">
.weather-widget-item {
  font-size: 15px;
  width: 100%;
  margin-bottom: 4em;
  font-weight: 500;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__gear-btn {
    & > img {
      width: 1.5em;
    }
  }

  &__title {
    font-size: 1.1em;
    font-weight: 900;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-right: 0.5em;
  }
  &__img-weather-container {
    margin: 25px 0;
    display: flex;
    align-items: center;
    & > img {
      width: 3.3em;
    }
    & > span {
      font-size: 1.5em;
      font-weight: bold;
      flex-grow: 1;
      text-align: right;
      margin-right: 4em;
    }
  }
  &__subtitle {
    font-size: 1em;
  }
  &__additional-info-container {
    margin-top: 1em;
    font-size: 0.9em;
    display: flex;
    align-items: center;
    & > *:first-child {
      flex-grow: 1;
      display: flex;
    }
  }
  &__img-cursor {
    margin-left: 0.3em;
    width: 0.8em;
    margin-right: 0.6em;
  }
  &__img-pressure {
    width: 1.5em;
    margin-left: 1.2em;
    margin-right: 0.3em;
  }
  &__wind-info {
    font-size: 0.9em;
    display: flex;
    align-items: center;
  }
}
</style>
