import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  writeBatch,
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

export async function seedSampleProducts(products) {
  const productRefs = products.map((product) =>
    doc(db, "products", product.id)
  );
  const existingProducts = await Promise.all(productRefs.map(getDoc));
  const batch = writeBatch(db);
  let hasNewProducts = false;

  existingProducts.forEach((productSnapshot, index) => {
    if (!productSnapshot.exists()) {
      const { id, ...productData } = products[index];
      batch.set(productRefs[index], {
        ...productData,
        createdAt: serverTimestamp(),
      });
      hasNewProducts = true;
    }
  });

  if (hasNewProducts) {
    await batch.commit();
  }
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
