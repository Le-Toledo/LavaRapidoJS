import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import BookingScreen from "../screens/BookingScreen";
import CustomersScreen from "../screens/CustomersScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import AgendamentosScreen from "../screens/AgendamentosScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Início" }} />
      <Stack.Screen name="Booking" component={BookingScreen} options={{ title: "Agendamento" }} />
      <Stack.Screen name="Agendamentos" component={AgendamentosScreen} options={{ title: "Agendamentos Salvos" }} />
      <Stack.Screen name="Customers" component={CustomersScreen} options={{ title: "Clientes" }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil" }} />
    </Stack.Navigator>
  );
}
