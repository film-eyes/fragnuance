import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import fs from "fs";

dotenv.config();

// Загружаем файл по пути из .env.local
const serviceAccountPath =
  process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.SERVICE_ACCOUNT_KEY_PATH;
if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(`Файл serviceAccountKey.json не найден по пути: ${serviceAccountPath}`);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function migrateIngredients() {
  console.log("🚀 Начинаем миграцию...");
  const snapshot = await db.collectionGroup("ingredients").get();
  const batch = db.batch();

  snapshot.docs.forEach((doc) => {
    const newRef = db.collection("ingredients").doc(doc.id);
    batch.set(newRef, doc.data());
  });

  await batch.commit();
  console.log("✅ Перенос завершён!");
}

migrateIngredients();