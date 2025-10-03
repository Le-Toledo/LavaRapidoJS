// src/components/ScreenWrapper.js
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";

/**
 * ScreenWrapper é um componente genérico que envolve cada tela
 * usando SafeAreaView para respeitar áreas seguras de iPhone (como a ilha) 
 * e garantir layout consistente. NÃO usamos ScrollView aqui para evitar erros de FlatList.
 */
export default function ScreenWrapper({ children }) {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ocupa toda a tela
    backgroundColor: "#fff",
    padding: 20, // padding interno padrão
  },
});
