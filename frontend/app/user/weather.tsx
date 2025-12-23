import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const WEATHER_API_KEY = '1e43c92cf207341172019347336f5051';

interface WeatherData {
  main: {
    temp: number;
  };
  weather?: Array<{
    description: string;
  }>;
  name?: string;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const getWeather = async () => {
      try {
        const res = await axios.get(
          'https://api.openweathermap.org/data/2.5/weather',
          {
            params: {
              q: 'Pristina',
              units: 'metric',
              appid: WEATHER_API_KEY,
            },
          }
        );
        setWeather(res.data);
      } catch (err) {
        const error = err as AxiosError;
        console.log('Weather error:', error?.response?.data || error.message);
      }
    };

    getWeather();
  }, []);

  if (!weather || !weather.main) return null;

  return (
    <LinearGradient
      colors={['#222', '#555']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.city}>{weather.name || 'Pristina'}</Text>
      <Text style={styles.temp}>{Math.round(weather.main.temp)}°</Text>
      <Text style={styles.desc}>{weather.weather?.[0]?.description}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 160,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    marginBottom: 10,
  },
  city: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  temp: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '200',
    lineHeight: 46,
  },
  desc: {
    color: '#ddd',
    fontSize: 13,
    textTransform: 'capitalize',
    opacity: 0.9,
    marginTop: 4,
    textAlign: 'center',
  },
});
