import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../auth/firebase/config.js";

const productsCollection = collection(db, "products");

export async function getProducts() {
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map((productDoc) => ({
    id: productDoc.id,
    ...productDoc.data(),
  }));
}

export async function getProductById(productId) {
  const productDoc = await getDoc(doc(db, "products", productId));
  return productDoc.exists()
    ? { id: productDoc.id, ...productDoc.data() }
    : null;
}

export async function createProduct(product) {
  const productRef = await addDoc(productsCollection, {
    ...product,
    createdAt: serverTimestamp(),
  });

  return { id: productRef.id, ...product };
}
