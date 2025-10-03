import React from "react";
import { TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
import colors from "../styles/colors";

export default function Button({ title, onPress, type = "primary" }) {
  const scale = new Animated.Value(1);

  const handlePressIn = () => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          type === "primary" && { backgroundColor: colors.primary },
          type === "danger" && { backgroundColor: colors.danger },
        ]}
      >
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
  },
  text: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
