import React from "react";
import { SafeAreaView, StyleSheet, ImageBackground, View } from "react-native";
import backgroundImage from "../../assets/images/lava.jpg";

export default function ScreenWrapper({ children }) {
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Overlay escuro */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.container}>{children}</SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // ocupa toda a tela
    backgroundColor: "rgba(0,0,0,0.4)", // preto com 40% de transparência
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "transparent", // transparente para deixar o overlay visível
  },
});
