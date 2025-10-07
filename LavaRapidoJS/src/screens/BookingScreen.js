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
import { db, auth } from "../../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { services } from "../data/services";

export default function BookingScreen() {
  const navigation = useNavigation();
  const user = auth.currentUser;

  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataHora, setDataHora] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  // Busca clientes
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

  const clientesComEu = user
    ? [{ id: "meuUsuario", nome: "Eu", uid: user.uid }, ...clientes]
    : clientes;

  // Salvar agendamento
  const salvarAgendamento = async () => {
    if (!clienteSelecionado || !servicoSelecionado) {
      Alert.alert("Atenção", "Selecione cliente e serviço antes de salvar!");
      return;
    }

    try {
      await addDoc(collection(db, "agendamentos"), {
        userId: user.uid,
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
      <Text style={styles.title}>Novo Agendamento</Text>

      {/* Selecionar Cliente */}
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: "#fff" }}>
          {clienteSelecionado ? clienteSelecionado : "Selecionar Cliente"}
        </Text>
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
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
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

      <TouchableOpacity style={styles.saveButton} onPress={salvarAgendamento}>
        <Text style={styles.saveButtonText}>Salvar Agendamento</Text>
      </TouchableOpacity>

      {/* Modal Seleção Cliente */}
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  card: { padding: 15, marginBottom: 10, borderRadius: 8, backgroundColor: "#eee" },
  cardSelecionado: { borderWidth: 2, borderColor: "#007AFF", backgroundColor: "#D0E8FF" },
  name: { fontSize: 16, fontWeight: "bold" },
  price: { fontSize: 14, color: "#333", marginTop: 5 },
  saveButton: { marginTop: 20, padding: 15, borderRadius: 8, backgroundColor: "#007AFF", alignItems: "center" },
  saveButtonText: { color: "#fff", fontWeight: "bold" },
  selectButton: { padding: 15, borderRadius: 8, backgroundColor: "#007AFF", alignItems: "center", marginBottom: 20 },
  dateButton: { marginTop: 20, padding: 15, borderRadius: 8, backgroundColor: "#007AFF", alignItems: "center" },
  modalContainer: { flex: 1, padding: 20, backgroundColor: "#fff" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  closeButton: { marginTop: 20, padding: 15, borderRadius: 8, backgroundColor: "#FF3B30", alignItems: "center" },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
});
