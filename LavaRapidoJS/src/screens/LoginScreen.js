import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { auth } from '../../firebase';
import Button from '../components/Button';
import colors from '../styles/colors';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 🔹 Login do usuário
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Erro', 'Email ou senha inválidos');
      console.log(error);
    }
  };

  // 🔹 Recuperar senha
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Erro', 'Digite seu email para recuperar a senha.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Sucesso', 'Enviamos um link de recuperação para seu email!');
    } catch (error) {
      Alert.alert('Erro', 'Não conseguimos enviar o email. Verifique se está cadastrado.');
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize='none'       // impede letra maiúscula no começo
        autoCorrect={false}         // evita o corretor mudar
      />

      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Button title="Entrar" onPress={handleLogin} />

      {/* 🔹 Link para cadastro */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>

      {/* 🔹 Botão de esqueci senha */}
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.link}>Esqueci minha senha</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor: colors.background, padding:20 },
  title: { fontSize:24, fontWeight:'bold', marginBottom:20 },
  input: { width:'100%', borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginBottom:10 },
  link: { color: colors.primary, marginTop:15, textAlign: 'center' },
  forgotPassword: { color: 'blue', marginTop: 10, textAlign:'center' }
});
