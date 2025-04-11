import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAgTBX7-LR5qExExZQ6Yi_Ho7gt8Yw3Suo",
    authDomain: "ankit10252-bc683.firebaseapp.com",
    projectId: "ankit10252-bc683",
    storageBucket: "ankit10252-bc683.appspot.com",
    messagingSenderId: "617164414578",
    appId: "1:617164414578:web:c74d4f1dc2c1f50dd76ceb",
     measurementId: "G-6G110W7E0V"
};

initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
export default app;
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });