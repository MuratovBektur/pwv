<template>
  <WeatherWidget />
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import WeatherWidget from "@/components/WeatherWidget.vue";
import { useEnvStore } from "@/store/env";

const envStore = useEnvStore();

const props = defineProps({
  weather_service_api_key: {
    type: String,
    required: true,
  },
  weather_update_interval_in_minutes: {
    type: String,
    required: true,
  },
});
/* eslint-disable vue/no-setup-props-destructure */
const weatherServiceApiKey = props.weather_service_api_key;
/* eslint-disable vue/no-setup-props-destructure */
const weatherUpdateIntervalInMinutes = props.weather_update_interval_in_minutes;

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
