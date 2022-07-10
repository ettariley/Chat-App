import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence, } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Config information
const firebaseConfig = {
  apiKey: 'AIzaSyBXYcGsXU-n-QTqNDBOFB3J2FdgzthK5Bo',
  authDomain: 'chatapp-53949.firebaseapp.com',
  projectId: 'chatapp-53949',
  storageBucket: 'chatapp-53949.appspot.com',
  messagingSenderId: '399680179484',
  appId: '1:399680179484:web:cfd5870a173f6ffeb87ed9',
};

// Initialize firebase app
let setApp;
let setAuth;

// Check if app has been initialized already & initialize if not
if (getApps().length === 0) {
  setApp = initializeApp(firebaseConfig);
  setAuth = initializeAuth(setApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  setApp = getApp();
  setAuth = getAuth(app);
}

export const db = getFirestore(setApp);
export const auth = setAuth;
export const storage = getStorage(setApp);