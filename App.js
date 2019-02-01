import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { observable, action, computed } from 'mobx';
import { observer, Provider } from 'mobx-react';

import Weather from './components/Weather';

import { API_KEY } from './utils/WeatherAPIKey';

//branch: second


class WeatherData {
  id=Math.random();
  @observable isLoading = true;
  @observable temperature = 0;
  @observable pressure_here = 0;
  @observable humidity_here = 0;
  @observable wind = 0;
  @observable weatherCondition = null;
  @error = null;

  @action
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

  @action
   fetchWeather(lat = 25, lon = 25) {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
      // `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
    )
      .then(res => res.json())
      .then(action(json => {
          this.temperature: json.main.temp,
          this.pressure_here: json.main.pressure,
          this.humidity_here: json.main.humidity,
          this.wind: json.wind.speed,          
          this.weatherCondition: json.weather[0].main,

          this.isLoading: false
      }));
  }
}

@observer
export default class App extends React.Component {

  render() {
    const t = this.props.temperature;
    // const { isLoading, weatherCondition, temperature, pressure_here, humidity_here, wind } = this.state;
    return (
      <View style={styles.container}>
        {t.isLoading ? 
          (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Fetching The Weather</Text>
            </View>
          ) : (
            <View>
              <Weather 
                weather={t.weatherCondition} 
                temperature={t.temperature} 
                pressure_here={t.pressure_here} 
                humidity_here={t.humidity_here} 
                wind={t.wind}/>
            </View>
          )
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