import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';

export default function Header({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width:'100%',
    padding:20,
    backgroundColor: colors.primary,
    alignItems: 'center'
  },
  title: {
    color:'#fff',
    fontSize:20,
    fontWeight:'bold'
  }
});
