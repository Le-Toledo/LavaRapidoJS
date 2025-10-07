import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';

export default function ServiceCard({ service }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{service.name}</Text>
      <Text style={styles.price}>R$ {service.price.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  name: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  price: { fontSize: 16, fontWeight: 'bold', color: colors.primary }
});
