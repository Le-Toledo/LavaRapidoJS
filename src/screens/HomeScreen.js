import React from "react";
import { StyleSheet, Text } from "react-native";
import Button from "../components/Button";
import ScreenWrapper from "../components/ScreenWrapper";

export default function HomeScreen({ navigation }) {
  return (
    <ScreenWrapper>
      <Text style={styles.title}>Bem-vindo ao Lava Rápido</Text>

      <Button title="Agendar Serviço" onPress={() => navigation.navigate("Booking")} />
      <Button title="Clientes" onPress={() => navigation.navigate("Customers")} />
      <Button title="Agendamentos" onPress={() => navigation.navigate("Agendamentos")} />
      <Button title="Perfil" onPress={() => navigation.navigate("Profile")} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginVertical: 30 },
});
