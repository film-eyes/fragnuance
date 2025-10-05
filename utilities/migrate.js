import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

// читаем JSON вручную
const serviceAccount = JSON.parse(
  fs.readFileSync(new URL("../serviceAccountKey.json", import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();

async function migrateIngredients() {
  console.log("🚀 Начинаем миграцию...");

  // ⚠️ укажи ID своей старой коллекции (путь "users/.../ingredients")
  const snapshot = await db
    .collection("users")
    .doc("XPBz4N1o1jfq5g0uZe2S1SahtMJ2")
    .collection("ingredients")
    .get();

  const batch = db.batch();

  snapshot.docs.forEach((doc) => {
    const newRef = db.collection("ingredients").doc(doc.id);
    batch.set(newRef, doc.data());
  });

  await batch.commit();
  console.log("✅ Перенос завершён!");
}

migrateIngredients();