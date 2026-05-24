import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { browser } from "$app/environment";

const firebaseConfig = {
  apiKey: "AIzaSyAyWTGoeBguS7gCcwi7509JHMSGRNqy3PA",
  authDomain: "unitest-3e6d7.firebaseapp.com",
  projectId: "unitest-3e6d7",
  storageBucket: "unitest-3e6d7.firebasestorage.app",
  messagingSenderId: "985142651823",
  appId: "1:985142651823:web:10a225794e1051b0605d5a",
  measurementId: "G-8E00F528YJ"
};

const app = initializeApp(firebaseConfig);

const analytics = browser ? getAnalytics(app) : null;

export { app };