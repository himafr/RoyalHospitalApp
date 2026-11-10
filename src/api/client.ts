import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import { navigationRef } from '../navigation/RootNavigator';

export const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080/api' : 'http://localhost:8080/api';

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 15000,
});

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
   await new Promise((r) => setTimeout(r, 3000));
  return config;
});

client.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    console.error('API request failed', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      baseURL: error.config?.baseURL,
      method: error.config?.method,
      url: error.config?.url,
    });
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user');
      if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  }

    }
    if(error.response?.status === 404) {
      Alert.alert('Not Found', error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export default client;