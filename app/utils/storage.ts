import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveTimers = async (timers: any) => {
  await AsyncStorage.setItem("timers", JSON.stringify(timers));
};

export const getTimers = async () => {
  const timers = await AsyncStorage.getItem("timers");
  return timers ? JSON.parse(timers) : [];
};

export const saveHistory = async (history: any) => {
  await AsyncStorage.setItem("history", JSON.stringify(history));
};

export const getHistory = async () => {
  const history = await AsyncStorage.getItem("history");
  return history ? JSON.parse(history) : [];
};
