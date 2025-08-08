import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
 apiKey: "AIzaSyAEjbFsCew-kQDLaLlUM11bBianzlw8IsI",
  authDomain: "getta-7ab03.firebaseapp.com",
  projectId: "getta-7ab03",
  storageBucket: "getta-7ab03.firebasestorage.app",
  messagingSenderId: "684756589836",
  appId: "1:684756589836:web:dd797b806792383353fd29",
  measurementId: "G-B043JWQMCE"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");
appleProvider.setCustomParameters({
  prompt: "select_account",
});

// ✅ Exports
export { app, auth, provider, appleProvider };