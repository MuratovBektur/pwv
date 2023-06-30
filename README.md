## Dev mode:
1) Register on https://openweathermap.org/
2) Create and fill env/dev.env file as env/example.env file. You can get the VUE_APP_WEATHER_SERVICE_API_KEY field on https://home.openweathermap.org/api_keys 
3) Run command in terminal in root directory: 
  ```./restart-dev``` 

## Prod mode:

1) Run command in terminal in root directory: 
  ```./build``` 
2) Add required weather API key in client/dist/index.html for widget-vue tag.  You can get the API key field on https://home.openweathermap.org/api_keys 


## Optional fields

You can also add an optional field that sets the weather update interval. Depending on the mode, this will be either an environment file (dev.env ) or an attribute of the widget-view tag