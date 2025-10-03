// Importa funções essenciais do Firebase
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuração do Firebase (pegue do seu projeto no console)
const firebaseConfig = {
  apiKey: "AIzaSyAK0lWIgbf2yzH17B6YWNGx-y2bvKAPQc4",
  authDomain: "lavarapidoapp-f840a.firebaseapp.com",
  projectId: "lavarapidoapp-f840a",
  storageBucket: "lavarapidoapp-f840a.firebasestorage.app",
  messagingSenderId: "412366410999",
  appId: "1:412366410999:web:622241acbaa5181752aff2",
  measurementId: "G-REYXFRRJJ5"
};

// Evita inicializar Firebase mais de uma vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Inicializa Auth com persistência no AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Conecta ao Firestore
const db = getFirestore(app);

export { auth, db };
