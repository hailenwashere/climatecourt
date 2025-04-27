// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai";


// only edit firebase.ts. firebase.js is compiled version from the ts file

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
export const db = getDatabase(app);
// export default app;

const vertexAI = getVertexAI(app);
export const model = getGenerativeModel(vertexAI, {
  model: "gemini-2.0-flash",
});
