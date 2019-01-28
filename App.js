import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Weather from './components/Weather';

import { API_KEY } from './utils/WeatherAPIKey';

export default class App extends React.Component {
  state = {
    isLoading: true,
    temperature: 0,
    pressure_here: 0,
    humidity_here: 0,
    wind: null,
    

    weatherCondition: null,
    error: null
};

componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      error => {
        this.setState({
          error: 'Error Gettig Weather Condtions'
        });
      }
    );
  }

  fetchWeather(lat = 25, lon = 25) {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
    )
      .then(res => res.json())
      .then(json => {
        // console.log(json);
        this.setState({
          temperature: json.main.temp,
          pressure_here: json.main.pressure,
          humidity_here: json.main.humidity,
          wind: json.wind.speed,
          
          weatherCondition: json.weather[0].main,
          isLoading: false
          });
      });
}


  render() {
    const { isLoading, weatherCondition, temperature, pressure_here, humidity_here, wind } = this.state;
    return (
      <View style={styles.container}>
        { isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Fetching The Weather</Text>
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <View >
            <Text style={styles.loadingText}> The Weather</Text>
          </View>

          <Weather weather={weatherCondition} temperature={temperature} 
                   pressure_here={pressure_here} humidity_here={humidity_here} wind={wind}/>
          </View>
        ) }
      </View>
    );
}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDE4'
  },
  loadingText: {
    fontSize: 30
  }
});