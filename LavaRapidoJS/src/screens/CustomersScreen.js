// src/screens/CustomersScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import ScreenWrapper from "../components/ScreenWrapper";
import Button from "../components/Button";

export default function CustomersScreen({ navigation }) {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "customers"));
        setCustomers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os clientes.");
      }
    };

    fetchCustomers();
  }, []);

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Clientes</Text>
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.phone}>{item.phone}</Text>
          </View>
        )}
      />
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: "600" },
  phone: { fontSize: 16, color: "#555" },
});
