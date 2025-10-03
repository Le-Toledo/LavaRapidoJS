import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "../components/ScreenWrapper";
import { db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AgendamentosScreen() {
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const fetchAgendamentos = async () => {
    try {
      const q = query(collection(db, "agendamentos"), orderBy("dataHora", "asc"));
      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAgendamentos(lista);
    } catch (error) {
      console.log("Erro ao buscar agendamentos:", error);
    }
  };

  const deletarAgendamento = (id) => {
    Alert.alert(
      "Deletar Agendamento",
      "Deseja realmente deletar este agendamento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "agendamentos", id));
              setAgendamentos(prev => prev.filter(a => a.id !== id));
            } catch (error) {
              console.log("Erro ao deletar agendamento:", error);
              Alert.alert("Erro", "Não foi possível deletar o agendamento.");
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Agendamentos</Text>

      {agendamentos.length === 0 ? (
        <Text style={styles.noAgendamentoText}>Nenhum agendamento encontrado.</Text>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cliente}>{item.cliente}</Text>
                {item.servico && <Text style={styles.servico}>{item.servico}</Text>}
                <Text style={styles.data}>
                  {format(new Date(item.dataHora), "dd 'de' MMMM yyyy, HH:mm", { locale: ptBR })}
                </Text>
              </View>
              <TouchableOpacity onPress={() => deletarAgendamento(item.id)}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginVertical: 30 },
  noAgendamentoText: { fontSize: 16, textAlign: "center", color: "#555" },
  card: {
    flexDirection: "row",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cliente: { fontSize: 16, fontWeight: "bold" },
  servico: { fontSize: 14, marginTop: 5 },
  data: { fontSize: 14, marginTop: 5, color: "#555" },
});
