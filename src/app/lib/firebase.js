"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// src/lib/firebase.ts
var app_1 = require("firebase/app");
// import { getAuth } from "firebase/auth";
var firestore_1 = require("firebase/firestore");
var firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
var app = (0, app_1.initializeApp)(firebaseConfig);
console.log(firebaseConfig.apiKey);
// export const auth = getAuth(app);
exports.db = (0, firestore_1.getFirestore)(app);
exports.default = app;
