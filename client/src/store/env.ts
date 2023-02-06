import { defineStore } from "pinia";

export const useEnvStore = defineStore("env", {
  state: () => {
    return {
      weatherServiceApiKey: "",
      weatherUpdateIntervalInMinutes: 1,
    };
  },
  actions: {
    setState(
      weatherServiceApiKey: string,
      weatherUpdateIntervalInMinutes: string
    ) {
      this.weatherServiceApiKey = weatherServiceApiKey;
      if (isNaN(+weatherUpdateIntervalInMinutes)) {
        console.log(
          "Interval props in minutes must be number string. Default time set (1 minute)"
        );
        return;
      }
      this.weatherUpdateIntervalInMinutes = +weatherUpdateIntervalInMinutes;
    },
  },
});
