import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function carregarProdutos() {

  const produtos = [];

  const querySnapshot = await getDocs(collection(db, "produtos"));

  querySnapshot.forEach((doc) => {
    produtos.push(doc.data());
  });

  return produtos;
}
