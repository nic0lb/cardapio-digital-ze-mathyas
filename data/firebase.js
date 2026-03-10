import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAuLVM982MUnK0-8HT0LdpBxhm_cOS-0Os",
  authDomain: "cardapio-digital-845ac.firebaseapp.com",
  projectId: "cardapio-digital-845ac",
  storageBucket: "cardapio-digital-845ac.firebasestorage.app",
  messagingSenderId: "136698316142",
  appId: "1:136698316142:web:3a193530cb2662b588ed7f"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
