// src/screens/BookingScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { db } from "../../firebase"; // seu Firebase configurado
import { collection, getDocs, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { services } from "../data/services";
import { navigate } from "expo-router/build/global-state/routing";

export default function BookingScreen() {
  const navigation = useNavigation();
  const auth = getAuth();

  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataHora, setDataHora] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [user, setUser] = useState(null);

  // Pega o usuário logado
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) setUser(currentUser);
  }, []);

  // Busca clientes do Firestore
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const snapshot = await getDocs(collection(db, "clientes"));
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClientes(lista);
      } catch (error) {
        console.log("Erro ao buscar clientes:", error);
        Alert.alert("Erro", "Não foi possível carregar clientes.");
      }
    };
    fetchClientes();
  }, []);

  // Combina clientes do Firestore + "Eu" se estiver logado
  const clientesComEu = user
    ? [{ id: "meuUsuario", nome: "Eu", uid: user.uid }, ...clientes]
    : clientes;

  // Função para salvar agendamento
  const salvarAgendamento = async () => {
    if (!clienteSelecionado || !servicoSelecionado) {
      Alert.alert("Atenção", "Selecione cliente e serviço antes de salvar!");
      return;
    }

    try {
      // Salva no Firestore
      await addDoc(collection(db, "agendamentos"), {
        cliente: clienteSelecionado,
        servico: services.find((s) => s.id === servicoSelecionado).name,
        dataHora: dataHora.toISOString(),
        criadoEm: new Date().toISOString(),
      });
      Alert.alert("Sucesso", "Agendamento salvo!");
      setClienteSelecionado(null);
      setServicoSelecionado(null);
      setDataHora(new Date());
    } catch (error) {
      console.log("Erro ao salvar agendamento:", error);
      Alert.alert("Erro", "Não foi possível salvar o agendamento.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Botão Voltar */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Novo Agendamento</Text>

      {/* Selecionar Cliente */}
      <TouchableOpacity style={styles.saveButton} onPress={salvarAgendamento}>
        <Text style={styles.saveButtonText}>Salvar Cliente</Text>
      </TouchableOpacity>


      {/* Selecionar Serviço */}
      <Text style={styles.sectionTitle}>Selecione o Serviço</Text>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              servicoSelecionado === item.id && styles.cardSelecionado,
            ]}
            onPress={() => setServicoSelecionado(item.id)}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>R$ {item.price}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Selecionar Data/Hora */}
      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 15,
          borderRadius: 8,
          backgroundColor: '#007AFF',
          alignItems: 'center', 
        }}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          {format(dataHora, "dd 'de' MMMM yyyy, HH:mm", { locale: ptBR })}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dataHora}
          mode="datetime"
          display="default"
          locale="pt-BR"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDataHora(selectedDate);
          }}
        />
      )}

      {/* Botão Salvar */}
      <TouchableOpacity style={styles.saveButton} onPress={salvarAgendamento}>
        <Text style={styles.saveButtonText}>Salvar Agendamento</Text>
      </TouchableOpacity>

      {/* Modal de Seleção de Cliente */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Selecione um Cliente</Text>

          {clientesComEu.length === 0 ? (
            <Text>Nenhum cliente cadastrado.</Text>
          ) : (
            <FlatList
              data={clientesComEu}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setClienteSelecionado(item.nome);
                    setModalVisible(false);
                  }}
                >
                  <Text>{item.nome}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  backButton: { marginBottom: 10 },
  backButtonText: { color: "#007AFF", fontWeight: "bold", fontSize: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  button: {
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  saveButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontWeight: "bold" },
  modalContainer: { flex: 1, padding: 20, backgroundColor: "#fff" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  closeButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#FF3B30",
    alignItems: "center",
  },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
  card: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  name: { fontSize: 16, fontWeight: "bold" },
  price: { fontSize: 14, color: "#333", marginTop: 5 },
  cardSelecionado: {
    borderWidth: 2,
    borderColor: "#007AFF",
    backgroundColor: "#D0E8FF",
  },
});
