<template>
  <WeatherWidget />
</template>

<script setup lang="ts">
import WeatherWidget from "@/components/WeatherWidget.vue";
import { useEnvStore } from "@/store/env";

const envStore = useEnvStore();

const {
  VUE_APP_WEATHER_SERVICE_API_KEY: weatherServiceApiKey,
  VUE_APP_WEATHER_UPDATE_INTERVAL_IN_MINUTES: weatherUpdateIntervalInMinutes,
} = process.env;

if (!weatherServiceApiKey) {
  throw "weatherServiceApiKey is required";
}

envStore.setState(weatherServiceApiKey, weatherUpdateIntervalInMinutes);
</script>

<style>
button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}
</style>
