import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Button from '../components/Button';
import colors from '../styles/colors';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      // Cria usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Salva dados do usuário no Firestore
      await setDoc(doc(db, 'customers', userCredential.user.uid), {
        name: name,
        email: email,
        createdAt: new Date()
      });

      Alert.alert('Sucesso', 'Usuário cadastrado!');
      navigation.replace('Home');

    } catch (error) {
      console.log(error.code, error.message);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Erro', 'Email já cadastrado.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Erro', 'Email inválido.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Erro', 'Senha muito fraca (mínimo 6 caracteres).');
      } else {
        Alert.alert('Erro', 'Não foi possível cadastrar o usuário');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar</Text>
      <TextInput placeholder="Nome" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <Button title="Cadastrar" onPress={handleRegister} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Já tem conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor: colors.background, padding:20 },
  title: { fontSize:24, fontWeight:'bold', marginBottom:20 },
  input: { width:'100%', borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginBottom:10 },
  link: { color: colors.primary, marginTop:15 }
});
