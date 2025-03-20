import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import HomeScreen from "../../components/home";
import HistoryScreen from "../../components/history";
import { TimerProvider } from "../context/TimerContext";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <TimerProvider>
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="clock-o" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="history" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
    </TimerProvider>
  );}