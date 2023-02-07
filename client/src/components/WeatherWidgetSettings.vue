<template>
  <div class="weather-widget-settings">
    <div class="weather-widget-settings__header">
      <div class="weather-widget-settings__title">Settings</div>
      <button
        @click="$emit('hideSettingComponent')"
        class="weather-widget-settings__close-btn"
      >
        <img src="@/assets/close.svg" alt="close" />
      </button>
    </div>

    <draggable v-model="draggableCities" item-key="id">
      <template #item="{ element: city }">
        <div class="weather-widget-settings__city">
          <button class="weather-widget-settings__hamburger-city-btn">
            <img src="@/assets/hamburger.svg" alt="hamburger" />
          </button>
          <div draggable="true" @dragstart.prevent.stop>
            <div>
              {{ city.title }}
            </div>
            <button
              @click="removeCity(city)"
              class="weather-widget-settings__city-remove-btn"
            >
              <img src="@/assets/trash.svg" alt="trash" />
            </button>
          </div>
        </div>
      </template>
    </draggable>
    <div class="weather-widget-settings__add-city-panel">
      <div class="weather-widget-settings__add-city-panel-title">
        Add Location:
      </div>
      <div class="weather-widget-settings__add-city-panel-input-container">
        <input
          v-model="searchCityInput"
          @input="onSearchCityInput"
          @keydown.enter="addCity"
          class="weather-widget-settings__add-city-panel-input"
        />
        <button @click="addCity" class="weather-widget-settings__add-city-btn">
          <img src="@/assets/arrow-return-left.svg" alt="arrow-left" />
        </button>
      </div>
      <div
        v-if="searchCityList.length"
        class="weather-widget-settings__search-city-list"
      >
        <div
          class="weather-widget-settings__search-city"
          @click="onSelectCity(city)"
          v-for="city of searchCityList"
          :key="`${city.lat}_${city.lon}`"
          :title="city.title"
        >
          {{ city.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { debounce } from "lodash";
import axios from "axios";

import draggable from "vuedraggable";

import { useCityStore } from "@/store/city";
import { useEnvStore } from "@/store/env";
import { ICity } from "@/helper/types";

interface ISearchCity extends ICity {
  title: string;
}

const cityStore = useCityStore();
const envStore = useEnvStore();

const WEATHER_CITY_SEARCH_URL_TEMPLATE = `https://api.openweathermap.org/geo/1.0/direct?q={{q}}&limit=20&appid=${envStore.weatherServiceApiKey}`;

const draggableCities = computed({
  get() {
    return cities.value;
  },
  set(cities) {
    cityStore.setCities(cities);
  },
});
const cities = computed(() =>
  cityStore.cities.map((city) => ({
    ...city,
    title: getShortTitle(city),
    id: `${city.lat}_${city.lon}`,
  }))
);

const searchCityInput = ref<string>("");
const searchCityList = ref<Array<ISearchCity>>([]);

function getShortTitle(city: ICity): string {
  return `${city.name}, ${city.country}`;
}

function getTitle(city: ICity): string {
  let cityState = city.state;
  cityState = cityState ? ` (${cityState})` : "";
  return `${city.name}, ${city.country}${cityState}`;
}

async function searchCity() {
  const url = WEATHER_CITY_SEARCH_URL_TEMPLATE.replace(
    "{{q}}",
    searchCityInput.value
  );
  const { data } = await axios.get<Array<ICity>>(url);
  searchCityList.value = data.map((city) => ({
    ...city,
    title: getTitle(city),
  }));
}

const onSearchCityInput = debounce(searchCity, 500);

const selectedCity = ref<ISearchCity | null>();

function onSelectCity(city: ISearchCity) {
  searchCityInput.value = city.title;
  searchCityList.value = [];
  selectedCity.value = city;
}

function addCity() {
  if (searchCityList.value.length === 1) {
    selectedCity.value = searchCityList.value[0];
  }
  if (selectedCity.value) {
    cityStore.pushNewCity(selectedCity.value);
    searchCityList.value = [];
    searchCityInput.value = "";
    selectedCity.value = null;
  }
}
function removeCity(city: ICity) {
  cityStore.removeCity(city);
}
</script>

<style scoped lang="scss">
.weather-widget-settings {
  width: 100%;
  min-height: 100%;
  font-size: 15px;
  font-weight: 500;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__close-btn {
    & > img {
      width: 2em;
    }
  }

  &__title {
    font-size: 1.1em;
    font-weight: 900;
  }
  &__city {
    width: 90%;
    margin: 1.2em 0;
    background-color: #edebe9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > *:last-child {
      padding: 0.6em 0.3em;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      & > div {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
  &__hamburger-city-btn {
    margin-right: 0.3em;
    display: flex;
    & > img {
      width: 1.4em;
    }
  }
  &__city-remove-btn {
    & > btn {
      width: 1.2em;
    }
  }
  &__add-city-panel {
    margin-top: 2em;
    &-title {
      font-size: 1.1em;
      font-weight: 900;
    }
    &-input {
      height: 1.7em;
      &-container {
        margin-top: 0.5em;
        align-items: flex-end;
        display: flex;
      }
    }
  }
  &__add-city-btn {
    margin-left: 0.4em;
    & > img {
      width: 1.5em;
    }
  }
  &__search-city {
    padding: 0.4em;
    cursor: pointer;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    &-list {
      margin-top: 0.5em;
      padding-top: 0.4em;
      border: 1px solid black;
      width: 90%;
      max-height: 8em;
      overflow: auto;
    }
  }
}
</style>
